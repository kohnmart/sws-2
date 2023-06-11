export class Item {
    /* create new item */
    constructor(tagName, menuInstance, itemContent, callback) {
        this.container = document.createElement(tagName);
        this.container.id = Item.id;
        this.menuInstance = menuInstance;
        if (itemContent) {
            this.container.innerText = itemContent;
        }
        if (callback) {
            this.container.addEventListener('click', () => callback(this.menuInstance));
        }
    }
    /* render item in ul-list */
    render() {
        const li = document.createElement('li');
        li.appendChild(this.container);
        this.menuInstance.ulList.appendChild(li);
    }
}
Item.id = 'menu-item';
export class ItemColor extends Item {
    constructor(tagName, menuInstance, key, value, defaultColor, callback) {
        super(tagName, menuInstance, null, callback);
        this.key = key;
        this.defaultColor = defaultColor;
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'radio';
        this.inputElement.name = key;
        this.inputElement.value = value;
        if (this.key === this.defaultColor) {
            this.inputElement.checked = true;
        }
        this.labelElement = document.createElement('label');
        this.labelElement.textContent = value;
        this.labelElement.htmlFor = value;
        this.container.append(this.inputElement);
        this.container.append(this.labelElement);
    }
    setColorOption(color) {
        this.defaultColor = color;
        // Additional logic related to color setting
    }
}
//# sourceMappingURL=item.js.map