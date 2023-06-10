import MenuApi from './menuApi';

export class Item {
  static id: string = 'menu-item';
  element: HTMLElement;
  menuInstance: MenuApi;
  /* create new item */
  constructor(
    tagName: string,
    menuInstance: MenuApi,
    itemContent?: string,
    callback?: (m: MenuApi) => void
  ) {
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
  render(): void {
    const li = document.createElement('li');
    li.appendChild(this.element);
    this.menuInstance.ulList.appendChild(li);
  }
}
