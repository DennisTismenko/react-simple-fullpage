export default class PageNode {
  constructor(component, path, parent = null) {
    if (!path) throw new Error('Path prop is required.');
    this.component = component;
    this.path = path;
    this.parent = parent;
  }
}
