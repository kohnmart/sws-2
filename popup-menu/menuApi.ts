import { Item } from './item.js';

interface MenuOptions {
  list: HTMLElement;
  addItem(item: Item): void;
  addItems(...items: Item[]): void;
  addItemAt(item: Item, targetIndex: number): void;
  removeItem(item: Item): void;
  show(x: Number, y: Number): void;
  hide(): void;
}

interface MenuApi {
  createMenu(): MenuOptions;
  createItem(item_content: string, _callback: (item: Item) => void): Item;
  createSeparator(): Item;
}

/* ul-list element */
let list: HTMLElement;

/* create new menu and append functionality */
const createMenu = (): MenuOptions => {
  list = document.createElement('ul');
  document.getElementById('display')?.appendChild(list);
  return { list, addItem, addItems, addItemAt, removeItem, show, hide };
};

/* create new item with callback */
const createItem = (
  item_content: string,
  _callback: (item: Item) => void
): Item => {
  const element = document.createElement('li');
  element.style.listStyle = 'none';
  element.style.margin = '5px 0px';
  element.innerText = item_content;
  return new Item(element);
};

/* append new single item to list */
const addItem = (item: Item) => {
  list.appendChild(item.element);
};

/* append new items to list */
const addItems = (...items: Item[]) => {
  items.forEach((item) => {
    list.appendChild(item.element);
  });
};

/* add new item at index */
const addItemAt = (item: Item, targetIndex: number) => {
  // Ref: https://www.w3schools.com/JSREF/met_node_replacechild.asp
  const element = list.children[targetIndex];
  list.replaceChild(item.element, list.children[targetIndex]);
  list.appendChild(element);
};

/* remove item */
const removeItem = (item: Item) => {
  list.removeChild(item.element);
};

/* create separator hr-line */
const createSeparator = (): Item => {
  const separator: HTMLElement = document.createElement('hr');
  return new Item(separator);
};

/* display menu instance */
const show = (x: Number, y: Number): void => {
  // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
  list.style.display = 'block';
  list.style.transform = `translate(${x}px, ${y}px)`;
};

/* hide menu instance */
const hide = (): void => {
  list.style.display = 'none';
};

export default {
  createMenu,
  createItem,
  createSeparator,
};

export { MenuApi, Item };
