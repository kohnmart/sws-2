import MenuApi from './menuApi.js';

export class Item {
  public static id: string = 'menu-item';
  public element: HTMLElement;
  private menuInstance: MenuApi;
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
      this.element.addEventListener('mousedown', () =>
        callback(this.menuInstance)
      );
    }
  }

  /* render item in ul-list */
  render(): void {
    const li = document.createElement('li');
    li.appendChild(this.element);
    this.menuInstance.ulList.appendChild(li);
  }
}

export class ItemColor extends Item {
  public static defaultBackground: string | undefined;
  public static defaultForground: string | undefined;
  public type: Types;
  public key: string;
  public inputElement: HTMLInputElement;
  private labelElement: HTMLLabelElement;

  constructor(
    type: Types,
    tagName: string,
    menuInstance: MenuApi,
    key: string,
    value: string,
    defaultColor: string | undefined,
    callback?: (m: ItemColor) => void
  ) {
    super(tagName, menuInstance);
    this.key = key;
    ItemColor.defaultBackground = defaultColor;
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'radio';
    this.inputElement.name = type;
    this.inputElement.value = value;
    this.inputElement.id = Item.id;

    if (this.key === ItemColor.defaultBackground) {
      this.inputElement.checked = true;
    }

    if (callback) {
      this.inputElement.addEventListener('mousedown', () => callback(this));
    }

    this.labelElement = document.createElement('label');
    this.labelElement.textContent = value;
    this.labelElement.htmlFor = value;
    this.labelElement.id = Item.id;
    this.element.append(this.inputElement);
    this.element.append(this.labelElement);
  }

  setColorOption(isBackground: boolean): void {
    console.log('COLOR');
    if (isBackground) {
      ItemColor.defaultBackground = this.key;
    } else {
      ItemColor.defaultForground = this.key;
    }
    // Additional logic related to color setting
  }
}
export enum Types {
  Vordergrund = 'Vordergrund',
  Hintergrund = 'Hintergrund',
}
