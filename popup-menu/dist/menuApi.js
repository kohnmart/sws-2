export class MenuApi {
    constructor(isOrdered) {
        this.isOrdered = isOrdered;
        this.isOrdered
            ? (this.list = document.createElement('ul'))
            : (this.list = document.createElement('ol'));
        return this;
    }
    addItem(text) {
        const item = document.createElement('li');
        item.innerText = text;
        this.list.appendChild(item);
    }
    show() {
        document.addEventListener('click', (e) => {
            console.log('Test');
            e.preventDefault();
            let { display, position, right, bottom } = this.list.style;
            display = 'block';
            position = 'fixed';
            right = '100';
            bottom = '100';
        });
    }
    hide() {
        this.list.style.display = 'none';
    }
}
