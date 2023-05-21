import { Item } from './item.js';
let list;
const createMenu = () => {
    var _a;
    list = document.createElement('ul');
    (_a = document.getElementById('display')) === null || _a === void 0 ? void 0 : _a.appendChild(list);
    return { list, addItem, addItemAt, removeItem, show };
};
const createItem = (item_content, _callback) => {
    const element = document.createElement('li');
    element.style.listStyle = 'none';
    element.style.margin = '5px 0px';
    element.innerText = item_content;
    return new Item(element);
};
const addItem = (...items) => {
    items.forEach((item) => {
        list.appendChild(item.element);
    });
};
const addItemAt = (item, targetIndex) => {
    // Ref: https://www.w3schools.com/JSREF/met_node_replacechild.asp
    const element = list.children[targetIndex];
    list.replaceChild(item.element, list.children[targetIndex]);
    list.appendChild(element);
};
const removeItem = (item) => {
    list.removeChild(item.element);
};
const createSeparator = () => {
    const separator = document.createElement('hr');
    return new Item(separator);
};
const show = (x, y) => {
    list.style.display = 'block';
    list.style.transform = `translate(${x}px, ${y}px)`;
};
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
