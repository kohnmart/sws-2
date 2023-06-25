export class Item {
    constructor(tagName, menuInstance, itemContent, callback) {
        this.container = [];
        this.element = document.createElement(tagName);
        this.element.id = Item.id;
        this.menuInstance = menuInstance;
        if (itemContent) {
            this.element.innerText = itemContent;
        }
        if (callback) {
            this.element.addEventListener('mousedown', () => callback(this.menuInstance));
        }
    }
    render() {
        const listElement = document.createElement('li');
        listElement.appendChild(this.element);
        if (this.container.length > 0) {
            this.container.forEach((subItem) => {
                this.element.appendChild(subItem.element);
                listElement.id = 'item-list';
            });
        }
        this.menuInstance.ulList.appendChild(listElement);
    }
}
Item.id = 'menu-item';
export class ItemRadio extends Item {
    constructor(tagName, key, menuInstance) {
        super(tagName, menuInstance);
        this.key = key;
        /* Create input element */
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'radio';
        this.inputElement.value = key;
        this.inputElement.id = Item.id;
        /* Create corresponding label */
        this.labelElement = document.createElement('label');
        this.labelElement.textContent = key;
        this.labelElement.htmlFor = key;
        this.labelElement.id = Item.id;
        /* Add nodes to parent-element */
        this.element.append(this.inputElement, this.labelElement);
    }
}
//# sourceMappingURL=item.js.map