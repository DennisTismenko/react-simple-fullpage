import {cloneElement} from 'react';
import Page from '../components/Page.react';
import FullPageSection from '../components/FullPageSection.react';
import PageNode from './PageNode';
import PageSectionNode from './PageSectionNode';
import update from 'immutability-helper';

export default class FullPageTree {
  constructor(root) {
    this.root = root;
    this.focused = getFocused(this.root);
    this.pathMap = getPathMap(this.root);
  }
}

export const constructFromDOM = (root, offsets = new Map()) => {
  return new FullPageTree(_constructFromDOM(root, null, offsets));
};

const _constructFromDOM = (root, parent, offsets) => {
  const {children, path, direction} = root.props;
  if (root.type === Page) {
    return new PageNode(root, path, parent);
  } else if (root.type === FullPageSection) {
    const sectionNode = new PageSectionNode(
      root,
      direction,
      offsets.has(root) ? offsets.get(root) : 0,
      [],
      parent,
    );
    sectionNode.children = children.map((child) =>
      _constructFromDOM(child, sectionNode, offsets),
    );
    return sectionNode;
  }
};

export const createDOMComponents = (root) => {
  return _createDOMComponents(root);
};

const _createDOMComponents = (root) => {
  if (root instanceof PageNode) {
    return cloneElement(root.component, {key: root.path});
  } else {
    return cloneElement(root.component, {
      key: root.children
        .map((child) => (child.path ? child.path : 'section'))
        .join('_'),
      offset: root._index,
      children: root.children.map((child) => _createDOMComponents(child)),
    });
  }
};

const getPathMap = (root, pathMap = new Map()) => {
  root.children.forEach((child) => {
    if (child instanceof PageNode) {
      pathMap.set(child.path, child);
    } else {
      getPathMap(child, pathMap);
    }
  });
  return pathMap;
};

export const getComponentOffsetMap = (root) => {
  return _getComponentOffsetMap(root, new Map());
};

const _getComponentOffsetMap = (root, map) => {
  if (root instanceof PageSectionNode) {
    map.set(root.component, root._index);
    root.children.forEach((child) => {
      _getComponentOffsetMap(child, map);
    });
  }
  return map;
};

const getFocused = (root) => {
  let current = root;
  let focused;
  while (!focused) {
    if (current instanceof PageNode) {
      focused = current;
    } else if (current instanceof PageSectionNode) {
      current = current.children[current._index];
    }
  }
  return focused;
};

export const navigateAction = (pageTree, direction, onSuccess) => {
  const {focused} = pageTree;
  let targetOrientation;
  if (direction === 'up' || direction === 'down') {
    targetOrientation = 'vertical';
  } else if (direction === 'left' || direction === 'right') {
    targetOrientation = 'horizontal';
  } else {
    throw new Error(`Direction '${direction}' not recognized.`);
  }
  let section = focused.parent;
  let canNavigate = false;
  let targetIndex;

  while (section && !canNavigate) {
    if (section.orientation === targetOrientation) {
      targetIndex = getTargetIndex(section, direction);
      if (targetIndex !== null) {
        canNavigate = true;
      } else {
        section = section.parent;
      }
    } else {
      section = section.parent;
    }
  }
  if (section && targetIndex !== null) {
    onSuccess(updatePageTree(pageTree, section, targetIndex));
  }
};

const updatePageTree = (pageTree, section, targetIndex) => {
  const updatedTreeRoot = updatePageSection(
    pageTree.root,
    section,
    targetIndex,
  );
  return update(pageTree, {
    root: {$set: updatedTreeRoot},
    focused: {$set: getFocused(updatedTreeRoot)},
  });
};

const updatePageSection = (root, section, targetIndex) => {
  let updatedNode;
  if (root === section) {
    updatedNode = update(root, {_index: {$set: targetIndex}});
  } else {
    updatedNode = update(root, {
      children: {
        $splice: [
          [
            root._index,
            1,
            updatePageSection(root.children[root._index], section, targetIndex),
          ],
        ],
      },
    });
  }
  updateChildParentReferences(updatedNode);
  return updatedNode;
};

const getTargetIndex = (section, direction) => {
  let targetIndex;
  if (direction === 'up' || direction === 'left') {
    targetIndex = prevChildIndex(section);
  } else if (direction === 'down' || direction === 'right') {
    targetIndex = nextChildIndex(section);
  } else {
    throw new Error(`Direction '${direction}' not recognized.`);
  }
  return targetIndex;
};

const nextChildIndex = (section) => {
  return section.options.loop
    ? (section._index + 1) % section.children.length
    : section._index + 1 < section.children.length
    ? section._index + 1
    : null;
};

const prevChildIndex = (section) => {
  return section.options.loop
    ? (section._index - 1) % section.children.length
    : section._index - 1 >= 0
    ? section._index - 1
    : null;
};

export const navigateTo = (pageTree, pageNode, onSuccess) => {
  if (pageTree.focused === pageNode) {
    return;
  }
  onSuccess(
    update(pageTree, {
      root: {$set: rebuildTreeUp(pageNode)},
      focused: {$set: pageNode},
    }),
  );
};

const rebuildTreeUp = (pageNode) => {
  let targetChild = pageNode;
  let section = pageNode.parent;
  let updatedChild = null;
  while (section) {
    let updateCommand = {};
    let updatedSection;
    const targetIndex = section.children.indexOf(targetChild);
    if (updatedChild) {
      updateCommand.children = {$splice: [[targetIndex, 1, updatedChild]]};
    }
    if (targetIndex !== section._index) {
      updateCommand._index = {$set: targetIndex};
    }

    if (Object.keys(updateCommand).length > 0) {
      updatedSection = update(section, updateCommand);
      updateChildParentReferences(updatedSection);
    }

    targetChild = section;
    updatedChild = updatedSection;
    section = section.parent;
  }
  return updatedChild ? updatedChild : targetChild;
};

const updateChildParentReferences = (parent) => {
  parent.children.forEach((child) => (child.parent = parent));
};
