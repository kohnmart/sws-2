import { Item } from './item.js';
/* ul-list element */
let list;
/* create new menu and append functionality */
const createMenu = () => {
    var _a;
    list = document.createElement('ul');
    (_a = document.getElementById('display')) === null || _a === void 0 ? void 0 : _a.appendChild(list);
    return { list, addItem, addItems, addItemAt, removeItem, show };
};
/* create new item with callback */
const createItem = (item_content, _callback) => {
    const element = document.createElement('li');
    element.style.listStyle = 'none';
    element.style.margin = '5px 0px';
    element.innerText = item_content;
    return new Item(element);
};
/* append new single item to list */
const addItem = (item) => {
    list.appendChild(item.element);
};
/* append new items to list */
const addItems = (...items) => {
    items.forEach((item) => {
        list.appendChild(item.element);
    });
};
/* add new item at index */
const addItemAt = (item, targetIndex) => {
    // Ref: https://www.w3schools.com/JSREF/met_node_replacechild.asp
    const element = list.children[targetIndex];
    list.replaceChild(item.element, list.children[targetIndex]);
    list.appendChild(element);
};
/* remove item */
const removeItem = (item) => {
    list.removeChild(item.element);
};
/* create separator hr-line */
const createSeparator = () => {
    const separator = document.createElement('hr');
    return new Item(separator);
};
/* display menu instance */
const show = (x, y) => {
    // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
    list.style.display = 'block';
    list.style.transform = `translate(${x}px, ${y}px)`;
};
/* hide menu instance */
const hide = () => {
    list.style.display = 'none';
};
export default {
    createMenu,
    createItem,
    createSeparator,
    hide,
};
export { Item };
