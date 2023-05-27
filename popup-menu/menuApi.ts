import { Item } from './item.js';

export default class MenuApi {
  itemList: Array<Item> = [];
  ulList: HTMLUListElement = document.createElement('ul');
  eventListener: EventListenerOrEventListenerObject = (e) => {
    e.preventDefault();
  };

  /* create new menu and append functionality */
  createMenu = () => {
    document.getElementById('menu-display')?.appendChild(this.ulList);
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
    this.itemList.push(item);
  };

  /* append new items to list */
  addItems = (...items: Item[]) => {
    items.forEach((item) => {
      this.itemList.push(item);
    });
  };

  /* add new item at index */
  addItemAt = (item: Item, index: number) => {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice?retiredLocale=de
    const beforeIndex = this.itemList.slice(0, index);
    const afterIndex = this.itemList.slice(index);
    this.itemList = [...beforeIndex, item, ...afterIndex];
  };

  /* remove item */
  removeItem = (item: Item) => {
    const index = this.itemList.findIndex(
      (e) => e.element.innerText == item.element.innerText
    );
    const beforeIndex = this.itemList.slice(0, index);
    const afterIndex = this.itemList.slice(index + 1);
    this.itemList = [...beforeIndex, ...afterIndex];
  };

  /* display menu instance */
  show = (x: Number, y: Number): void => {
    /* clear ul-list */
    const parent = document.getElementById('menu-display');
    parent?.childNodes[0].remove();
    this.ulList = document.createElement('ul');
    parent?.appendChild(this.ulList);

    /* render items as elements in ul-list */
    this.itemList.forEach((item) => {
      item.render();
    });

    // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
    this.ulList.style.display = 'block';
    this.ulList.style.transform = `translate(${x}px, ${y}px)`;

    /* event-prevent default for all elements */
    document.addEventListener('click', this.eventListener);
  };

  /* hide menu instance */
  hide = (): void => {
    this.ulList.style.display = 'none';
    /* remove listener */
    document.removeEventListener('click', this.eventListener);
  };
}
