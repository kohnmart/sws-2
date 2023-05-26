import { Item } from './item.js';

export default class MenuApi {
  list: HTMLUListElement = document.createElement('ul');
  isdisplayed: boolean = false;

  /* create new menu and append functionality */
  createMenu = () => {
    document.getElementById('menu-display')?.appendChild(this.list);
    this.hide();
    return this;
  };

  /* create new item with callback */
  createItem = (item_content: string, callback: (m: MenuApi) => void) => {
    return new Item('button', this, item_content, (m) => callback(m));
  };

  /* create separator hr-line */
  createSeparator = (): Item => {
    return new Item('hr', this);
  };

  /* add single item to list */
  addItem = (item: Item) => {
    const li = document.createElement('li');
    li.appendChild(item.element);
    this.list.appendChild(li);
  };

  /* append new items to list */
  addItems = (...items: Item[]) => {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.appendChild(item.element);
      this.list.appendChild(li);
    });
  };

  /* add new item at index */
  addItemAt = (item: Item, targetIndex: number) => {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
    const li = document.createElement('li');
    li.appendChild(item.element);
    this.list.insertBefore(li, this.list.children[targetIndex]);
  };

  /* remove item */
  removeItem = (item: Item) => {
    this.list.removeChild(item.element.parentNode!);
  };

  /* display menu instance */
  show = (x: Number, y: Number): void => {
    // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
    this.list.style.display = 'block';
    this.list.style.transform = `translate(${x}px, ${y}px)`;
    this.isdisplayed = true;
  };

  /* hide menu instance */
  hide = (): void => {
    this.list.style.display = 'none';
    this.isdisplayed = false;
  };
}
