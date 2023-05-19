export class MenuApi {
    constructor(bgcolor = 'grey', display = 'flex', padding = '20px', align = 'left') {
        var _a;
        // create new list element
        this.list = document.createElement('ul');
        this.is_displayed = false;
        this.is_moving = false;
        this.display_type = display;
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
        this.list.style.backgroundColor = bgcolor;
        this.list.style.textAlign = align;
        this.list.style.padding = padding;
        // append to root div
        (_a = document.getElementById('display')) === null || _a === void 0 ? void 0 : _a.appendChild(this.list);
        return this;
    }
    addItems(title, ...inputs) {
        const items = [...inputs];
        const headline = document.createElement('h4');
        headline.innerText = title;
        this.list.appendChild(headline);
        items.forEach((el) => {
            const item = document.createElement('li');
            item.innerText = el;
            item.style.listStyle = 'none';
            item.style.margin = '5px 0px';
            this.list.appendChild(item);
        });
    }
    show(event) {
        this.is_displayed = true;
        this.list.style.display = this.display_type;
        let { clientX: x, clientY: y } = event;
        this.list.style.transform = `translate(${x}px, ${y}px)`;
    }
    hide() {
        this.is_displayed = false;
        this.list.style.display = 'none';
    }
    move(event) {
        let { clientX: x, clientY: y } = event;
        this.list.style.transform = `translate(${x}px, ${y}px)`;
    }
}
