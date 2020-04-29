import {cloneElement} from 'react';
import Page from '../components/Page.react';
import FullPageSection from '../components/FullPageSection.react';
import PageNode from './PageNode';
import PageSectionNode from './PageSectionNode';

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
    return root.component;
  } else {
    return cloneElement(root.component, {
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

export const downAction = (pageTree, onAction) => {
  const {focused} = pageTree;
  let section = focused.parent;
  while(section && section.orientation !== 'vertical') {
    section = section.parent;
  }
  if (section) {
    const next = nextChildIndex(section);
    if (next !== null) {
      section._index = next;
      onAction(new FullPageTree(pageTree.root));
    }
  }
}

export const upAction = (pageTree, onAction) => {
  const {focused} = pageTree;
  let section = focused.parent;
  while(section && section.orientation !== 'vertical') {
    section = section.parent;
  }
  if (section) {
    const prev = prevChildIndex(section);
    if (prev !== null) {
      section._index = prev;
      onAction(new FullPageTree(pageTree.root));
    }
  }
}

// get focusedChild() {
//   return this.children[this._index];
// }

// get prevChild() {
//   const prevIndex = this._prevChildIndex;
//   if (!prevIndex) return undefined;
//   return this.children[prevIndex];
// }

const nextChildIndex = (section) => {
  return section.options.loop
    ? (section._index + 1) % section.children.length
    : section._index + 1 < section.children.length
    ? section._index + 1
    : null;
}

const prevChildIndex = (section) => {
  return section.options.loop
    ? (section._index - 1) % section.children.length
    : section._index - 1 >= 0
    ? section._index - 1
    : null;
}

// get offset() {
//   return this._index;
// }

// focusNextChild() {
//   const nextIndex = this._nextChildIndex;
//   if (!nextIndex) {
//     console.warn('Next child does not exist.');
//   } else {
//     this._index = nextIndex;
//   }
//   return this.focusedChild;
// }

// focusPrevChild() {
//   const prevIndex = this._prevChildIndex;
//   if (!prevIndex) {
//     console.warn('Previous child does not exist.');
//   } else {
//     this._index = prevIndex;
//   }
//   return this.focusedChild;
// }
