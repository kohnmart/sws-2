import { Item } from './item.js';
class Menu {
    constructor() {
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
            this.list.style.display = 'none';
        };
        this.list = document.createElement('ul');
    }
}
export { Item };
export default Menu;
