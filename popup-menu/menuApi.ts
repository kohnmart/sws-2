export class MenuApi {
  static list: HTMLElement = document.createElement('ul');
  static display_type: string = 'flex';

  static createMenu(): MenuApi {
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
    document.getElementById('display')?.appendChild(this.list);
    return new MenuApi();
  }

  static createItem(
    item_content: string,
    callback: (item: Item) => void
  ): Item {
    const element = document.createElement('li');
    element.style.listStyle = 'none';
    element.style.margin = '5px 0px';
    element.innerText = item_content;
    return new Item(element);
  }

  addItem(...items: Item[]) {
    items.forEach((item) => {
      MenuApi.list.appendChild(item.element);
    });
  }

  static createSeparator(): Item {
    const separator: HTMLElement = document.createElement('hr');
    return new Item(separator);
  }

  addItemAt(item: Item, targetIndex: number) {
    const list = [...MenuApi.list.childNodes];

    const itemAtTarget = list[targetIndex];

    const currentIndex = list.findIndex((e) => e == item.element);

    list[targetIndex] = item.element;
    list[currentIndex] = itemAtTarget;
  }

  removeItem(item: Item) {
    const list = [...MenuApi.list.childNodes];
    const index = list.findIndex((e) => e == item.element);
    list.splice(index, 0);
  }

  show(x: Number, y: Number): void {
    MenuApi.list.style.display = 'block';
    MenuApi.list.style.transform = `translate(${x}px, ${y}px)`;
  }

  hide(): void {
    MenuApi.list.style.display = 'none';
  }
}

export class Item {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  hide(): void {
    this.element.style.display = 'none';
  }

  show(): void {
    this.element.style.display = 'block';
  }
}
