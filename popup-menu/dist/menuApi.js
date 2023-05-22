import Menu, { Item } from './menu.js';
/* create new menu and append functionality */
const createMenu = () => {
    var _a;
    const menu = new Menu();
    (_a = document.getElementById('display')) === null || _a === void 0 ? void 0 : _a.appendChild(menu.list);
    return menu;
};
/* create new item with callback */
const createItem = (item_content, callback) => {
    const element = document.createElement('li');
    element.innerText = item_content;
    const item = new Item(element);
    callback();
    return item;
};
/* create separator hr-line */
const createSeparator = () => {
    const separator = document.createElement('hr');
    return new Item(separator);
};
export default {
    createMenu,
    createItem,
    createSeparator,
};
