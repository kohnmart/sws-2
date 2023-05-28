import MenuApi from './menuApi';

export class Item {
  element: HTMLElement;
  menuInstance: MenuApi;

  /* create new item with callback */
  constructor(
    tagName: string,
    menuInstance: MenuApi,
    itemContent?: string,
    callback?: (m: MenuApi) => void
  ) {
    this.element = document.createElement(tagName);
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
