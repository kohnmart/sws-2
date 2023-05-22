import { Item } from './item.js';

class Menu {
  list: HTMLUListElement;
  constructor() {
    this.list = document.createElement('ul');
  }

  addItem = (item: Item) => {
    this.list.appendChild(item.element);
  };

  /* append new items to list */
  addItems = (...items: Item[]) => {
    items.forEach((item) => {
      this.list.appendChild(item.element);
    });
  };

  /* add new item at index */
  addItemAt = (item: Item, targetIndex: number) => {
    // Ref: https://www.w3schools.com/JSREF/met_node_replacechild.asp
    const element = this.list.children[targetIndex];
    this.list.replaceChild(item.element, this.list.children[targetIndex]);
    this.list.appendChild(element);
  };

  /* remove item */
  removeItem = (item: Item) => {
    this.list.removeChild(item.element);
  };

  /* display menu instance */
  show = (x: Number, y: Number): void => {
    // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
    this.list.style.display = 'block';
    this.list.style.transform = `translate(${x}px, ${y}px)`;
  };

  /* hide menu instance */
  hide = (): void => {
    this.list.style.display = 'none';
  };
}

export { Item };
export default Menu;
