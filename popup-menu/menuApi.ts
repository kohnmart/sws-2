import Menu, { Item } from './menu.js';

interface IMenuApi {
  createMenu(): Menu;
  createItem(item_content: string, callback: (item: Item) => void): Item;
  createSeparator(): Item;
}

/* create new menu and append functionality */
const createMenu = (): Menu => {
  const menu = new Menu();
  document.getElementById('display')?.appendChild(menu.list);
  return menu;
};

/* create new item with callback */
const createItem = (item_content: string, callback: Function) => {
  const element = document.createElement('li');
  element.innerText = item_content;
  const item = new Item(element);
  callback();
  return item;
};

/* create separator hr-line */
const createSeparator = (): Item => {
  const separator: HTMLElement = document.createElement('hr');
  return new Item(separator);
};

export default {
  createMenu,
  createItem,
  createSeparator,
};

export { IMenuApi };
