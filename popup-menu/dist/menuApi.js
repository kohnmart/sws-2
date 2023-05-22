import { Item } from './item.js';
export default class MenuApi {
    constructor() {
        this.list = document.createElement('ul');
        /* create new menu and append functionality */
        this.createMenu = () => {
            var _a;
            (_a = document.getElementById('display')) === null || _a === void 0 ? void 0 : _a.appendChild(this.list);
            return this;
        };
        /* create new item with callback */
        this.createItem = (item_content, callback) => {
            return new Item('button', this, item_content, (m) => callback(m));
        };
        /* create separator hr-line */
        this.createSeparator = () => {
            return new Item('hr', this);
        };
        /* add single item to list */
        this.addItem = (item) => {
            this.list.appendChild(item.element);
        };
        /* append new items to list */
        this.addItems = (...items) => {
            items.forEach((item) => {
                this.list.appendChild(item.element);
            });
        };
        /* add new item at index */
        this.addItemAt = (item, targetIndex) => {
            // Ref: https://www.w3schools.com/JSREF/met_node_replacechild.asp
            const element = this.list.children[targetIndex];
            this.list.replaceChild(item.element, this.list.children[targetIndex]);
            this.list.appendChild(element);
        };
        /* remove item */
        this.removeItem = (item) => {
            this.list.removeChild(item.element);
        };
        /* display menu instance */
        this.show = (x, y) => {
            // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
            this.list.style.display = 'block';
            this.list.style.transform = `translate(${x}px, ${y}px)`;
        };
        /* hide menu instance */
        this.hide = () => {
            console.log('HIDE');
            this.list.style.display = 'none';
        };
    }
}
