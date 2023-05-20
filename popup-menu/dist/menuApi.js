export class MenuApi {
    static createMenu() {
        var _a;
        // create new list element
        this.list = document.createElement('ul');
        this.display_type = 'flex';
        // list base-style-configuration
        this.list.style.display = 'none';
        this.list.style.position = 'absolute';
        this.list.style.left = '0px';
        this.list.style.top = '0px';
        this.list.style.flexDirection = 'column';
        this.list.style.alignItems = 'center';
        this.list.style.justifyContent = 'center';
        this.list.style.height = 'auto';
        this.list.style.width = 'auto';
        // optional styling
        this.list.style.backgroundColor = 'grey';
        this.list.style.textAlign = 'center';
        this.list.style.padding = '10px';
        // append to root div
        (_a = document.getElementById('display')) === null || _a === void 0 ? void 0 : _a.appendChild(this.list);
        return new MenuApi();
    }
    static createItem(item_content, callback) {
        const element = document.createElement('li');
        element.style.listStyle = 'none';
        element.style.margin = '5px 0px';
        element.innerText = item_content;
        return new Item(element);
    }
    addItem(...items) {
        items.forEach((item) => {
            MenuApi.list.appendChild(item.element);
        });
    }
    static createSeparator() {
        const separator = document.createElement('hr');
        return new Item(separator);
    }
    addItemAt(item, targetIndex) {
        const list = [...MenuApi.list.childNodes];
        const itemAtTarget = list[targetIndex];
        const currentIndex = list.findIndex((e) => e == item.element);
        list[targetIndex] = item.element;
        list[currentIndex] = itemAtTarget;
    }
    removeItem(item) {
        const list = [...MenuApi.list.childNodes];
        const index = list.findIndex((e) => e == item.element);
        list.splice(index, 0);
    }
    show(x, y) {
        MenuApi.list.style.display = 'block';
        MenuApi.list.style.transform = `translate(${x}px, ${y}px)`;
    }
    hide() {
        MenuApi.list.style.display = 'none';
    }
}
MenuApi.list = document.createElement('ul');
MenuApi.display_type = 'flex';
export class Item {
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
