export class MenuApi {

    isOrdered: boolean;
    list: HTMLUListElement

    constructor(isOrdered: boolean) {
        this.isOrdered = isOrdered;
    }

    create() {
        this.isOrdered ? 
        this.list = document.createElement("ul") : 
        this.list = document.createElement("ol");
    }

    addItem(text: string) {
        const item:HTMLElement = document.createElement("li");
        item.innerText = text
        this.list.appendChild(item);
    }

    show() {
        let {display, position, right, bottom} = this.list.style;
        display = "block";
        position = "fixed";
        right = "100";
        bottom = "100";
    }

    hide() {
        this.list.style.display = "none";
    }

}