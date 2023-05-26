import { Item } from './item.js';
export default class MenuApi {
    constructor() {
        this.list = document.createElement('ul');
        this.isdisplayed = false;
        /* create new menu and append functionality */
        this.createMenu = () => {
            var _a;
            (_a = document.getElementById('menu-display')) === null || _a === void 0 ? void 0 : _a.appendChild(this.list);
            this.hide();
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
            const li = document.createElement('li');
            li.appendChild(item.element);
            this.list.appendChild(li);
        };
        /* append new items to list */
        this.addItems = (...items) => {
            items.forEach((item) => {
                const li = document.createElement('li');
                li.appendChild(item.element);
                this.list.appendChild(li);
            });
        };
        /* add new item at index */
        this.addItemAt = (item, targetIndex) => {
            // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
            const li = document.createElement('li');
            li.appendChild(item.element);
            this.list.insertBefore(li, this.list.children[targetIndex]);
        };
        /* remove item */
        this.removeItem = (item) => {
            this.list.removeChild(item.element.parentNode);
        };
        /* display menu instance */
        this.show = (x, y) => {
            // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
            this.list.style.display = 'block';
            this.list.style.transform = `translate(${x}px, ${y}px)`;
            this.isdisplayed = true;
        };
        /* hide menu instance */
        this.hide = () => {
            this.list.style.display = 'none';
            this.isdisplayed = false;
        };
    }
}
