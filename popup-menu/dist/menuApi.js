import { Item } from './item.js';
export default class MenuApi {
    constructor() {
        this.itemList = [];
        this.ulList = document.createElement('ul');
        this.isdisplayed = false;
        /* create new menu and append functionality */
        this.createMenu = () => {
            var _a;
            (_a = document.getElementById('menu-display')) === null || _a === void 0 ? void 0 : _a.appendChild(this.ulList);
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
            this.itemList.push(item);
        };
        /* append new items to list */
        this.addItems = (...items) => {
            items.forEach((item) => {
                this.itemList.push(item);
            });
        };
        /* add new item at index */
        this.addItemAt = (item, index) => {
            // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice?retiredLocale=de
            console.log('Gt');
            const beforeIndex = this.itemList.slice(0, index);
            const afterIndex = this.itemList.slice(index);
            this.itemList = [...beforeIndex, item, ...afterIndex];
        };
        /* remove item */
        this.removeItem = (item) => {
            const index = this.itemList.findIndex((e) => e.element.innerText == item.element.innerText);
            const beforeIndex = this.itemList.slice(0, index);
            const afterIndex = this.itemList.slice(index + 1);
            this.itemList = [...beforeIndex, ...afterIndex];
            console.log('Log');
            console.log(this.itemList);
        };
        /* display menu instance */
        this.show = (x, y) => {
            /* clear ul-list */
            const parent = document.getElementById('menu-display');
            parent === null || parent === void 0 ? void 0 : parent.childNodes[0].remove();
            this.ulList = document.createElement('ul');
            parent === null || parent === void 0 ? void 0 : parent.appendChild(this.ulList);
            /* render list */
            this.itemList.forEach((item) => {
                const li = document.createElement('li');
                li.appendChild(item.element);
                this.ulList.appendChild(li);
            });
            // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
            this.ulList.style.display = 'block';
            this.ulList.style.transform = `translate(${x}px, ${y}px)`;
            this.isdisplayed = true;
        };
        /* hide menu instance */
        this.hide = () => {
            this.ulList.style.display = 'none';
            this.isdisplayed = false;
        };
    }
}
