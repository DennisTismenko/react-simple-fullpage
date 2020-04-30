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
    // this.offsetMap = getComponentOffsetMap(this.root);
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
    onSuccess(
      new FullPageTree(updatePageSection(pageTree.root, section, targetIndex)),
    );
  }
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
  updatedNode.children.forEach((child) => (child.parent = updatedNode));
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
