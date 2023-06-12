export class Item {
    /* create new item */
    constructor(tagName, menuInstance, itemContent, callback) {
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
    /* render item in ul-list */
    render() {
        const li = document.createElement('li');
        li.appendChild(this.element);
        this.menuInstance.ulList.appendChild(li);
    }
}
Item.id = 'menu-item';
export class ItemColor extends Item {
    constructor(type, tagName, menuInstance, key, value, defaultColor, callback) {
        super(tagName, menuInstance);
        this.key = key;
        ItemColor.defaultBackground = defaultColor;
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'radio';
        this.inputElement.name = type;
        this.inputElement.value = value;
        this.inputElement.id = Item.id;
        if (this.key === ItemColor.defaultBackground) {
            this.inputElement.checked = true;
        }
        if (callback) {
            this.inputElement.addEventListener('mousedown', () => callback(this));
        }
        this.labelElement = document.createElement('label');
        this.labelElement.textContent = value;
        this.labelElement.htmlFor = value;
        this.labelElement.id = Item.id;
        this.element.append(this.inputElement);
        this.element.append(this.labelElement);
    }
    setColorOption(isBackground) {
        console.log('COLOR');
        if (isBackground) {
            ItemColor.defaultBackground = this.key;
        }
        else {
            ItemColor.defaultForground = this.key;
        }
        // Additional logic related to color setting
    }
}
export var Types;
(function (Types) {
    Types["Vordergrund"] = "Vordergrund";
    Types["Hintergrund"] = "Hintergrund";
})(Types || (Types = {}));
//# sourceMappingURL=item.js.map