let list;
const createMenu = () => {
    var _a;
    list = document.createElement('ul');
    // list base-style-configuration
    list.style.display = 'none';
    list.style.position = 'absolute';
    list.style.left = '0px';
    list.style.top = '0px';
    list.style.flexDirection = 'column';
    list.style.alignItems = 'center';
    list.style.justifyContent = 'center';
    list.style.height = 'auto';
    list.style.width = 'auto';
    // optional styling
    list.style.backgroundColor = 'grey';
    list.style.textAlign = 'center';
    list.style.padding = '10px';
    // append to root div
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
class Item {
    constructor(element) {
        this.element = element;
    }
    hide() {
        this.element.style.display = 'none';
    }
    show() {
        this.element.style.display = 'block';
    }
}
export default {
    createMenu,
    createItem,
    createSeparator,
    hide,
};
export { Item };
