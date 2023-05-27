import MenuApi from './menuApi';

export class Item {
  /* ul list - element */
  element: HTMLElement;

  /* menu instance to ref on callback event */
  menuInstance: MenuApi;

  /* create new item with callback */
  constructor(
    tagName: string,
    menuInstance: MenuApi,
    item_content?: string,
    callback?: (m: MenuApi) => void
  ) {
    this.element = document.createElement(tagName);
    this.menuInstance = menuInstance;
    if (item_content) {
      this.element.innerText = item_content;
    }
    if (callback) {
      this.element.addEventListener('click', () => callback(this.menuInstance));
    }
  }

  render(): void {
    const li = document.createElement('li');
    li.appendChild(this.element);
    this.menuInstance.ulList.appendChild(li);
  }
}
