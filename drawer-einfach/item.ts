import MenuApi from './menuApi.js';

export class Item {
  public static id: string = 'menu-item';
  public element: HTMLElement;
  public container: Item[] = [];
  private menuInstance: MenuApi;
  /* create new item */
  constructor(
    tagName: string,
    menuInstance?: MenuApi,
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
      this.element.addEventListener('mousedown', () =>
        callback(this.menuInstance)
      );
    }
  }

  /* render item in ul-list */
  render(): void {
    const li = document.createElement('li');
    li.appendChild(this.element);
    if (this.container.length > 0) {
      this.container.forEach((subItem) => {
        this.element.appendChild(subItem.element);
        li.id = 'item-list';
      });
    }
    this.menuInstance.ulList.appendChild(li);
  }
}

export class ItemRadio extends Item {
  public key: string;
  public inputElement: HTMLInputElement;
  private labelElement: HTMLLabelElement;

  constructor(tagName: string, key: string, menuInstance: MenuApi) {
    super(tagName, menuInstance);
    this.key = key;

    this.inputElement = document.createElement('input');
    this.inputElement.type = 'radio';
    this.inputElement.value = key;
    this.inputElement.id = Item.id;

    this.labelElement = document.createElement('label');
    this.labelElement.textContent = key;
    this.labelElement.htmlFor = key;
    this.labelElement.id = Item.id;
    this.element.append(this.inputElement);
    this.element.append(this.labelElement);
  }
}
