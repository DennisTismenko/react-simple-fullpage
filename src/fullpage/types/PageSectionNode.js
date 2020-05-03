export default class PageSectionNode {
  constructor(
    component,
    orientation,
    offset,
    children = [],
    parent = null,
    options = {loop: false},
  ) {
    this._index = offset;
    this.component = component;
    this.orientation = orientation;
    this.children = children;
    this.options = options;
    this.parent = parent;
  }
}
