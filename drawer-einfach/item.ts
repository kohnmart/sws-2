import MenuApi from './menuApi.js';

export class Item {
  public static readonly id: string = 'menu-item';
  public readonly element: HTMLElement;
  public readonly container: Item[] = [];
  private readonly menuInstance: MenuApi;
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

  render(): void {
    const listElement = document.createElement('li');
    listElement.appendChild(this.element);
    if (this.container.length > 0) {
      this.container.forEach((subItem) => {
        this.element.appendChild(subItem.element);
        listElement.id = 'item-list';
      });
    }
    this.menuInstance.ulList.appendChild(listElement);
  }
}

export class ItemRadio extends Item {
  public readonly key: string;
  public readonly inputElement: HTMLInputElement;
  private readonly labelElement: HTMLLabelElement;

  constructor(tagName: string, key: string, menuInstance: MenuApi) {
    super(tagName, menuInstance);
    this.key = key;

    /* Create input element */
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'radio';
    this.inputElement.value = key;
    this.inputElement.id = Item.id;

    /* Create corresponding label */
    this.labelElement = document.createElement('label');
    this.labelElement.textContent = key;
    this.labelElement.htmlFor = key;
    this.labelElement.id = Item.id;

    /* Add nodes to parent-element */
    this.element.append(this.inputElement, this.labelElement);
  }
}
