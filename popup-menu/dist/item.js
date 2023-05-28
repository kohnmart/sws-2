export class Item {
    /* create new item with callback */
    constructor(tagName, menuInstance, itemContent, callback) {
        this.element = document.createElement(tagName);
        this.element.id = Item.id;
        this.menuInstance = menuInstance;
        if (itemContent) {
            this.element.innerText = itemContent;
        }
        if (callback) {
            this.element.addEventListener('click', () => callback(this.menuInstance));
        }
    }
    /* render item in ul-list */
    render() {
        const li = document.createElement('li');
        li.appendChild(this.element);
        this.menuInstance.ulList.appendChild(li);
    }
}
Item.id = 'menu-item';
