export class Item {
    /* create new item with callback */
    constructor(tagName, menuInstance, item_content, callback) {
        this.element = document.createElement(tagName);
        this.menuInstance = menuInstance;
        if (item_content) {
            this.element.innerText = item_content;
        }
        if (callback) {
            this.element.addEventListener('click', () => callback(this.menuInstance));
        }
    }
    hide() {
        this.element.style.display = 'none';
    }
    render() {
        this.element.style.display = 'block';
    }
}
