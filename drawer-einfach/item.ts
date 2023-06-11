import MenuApi from './menuApi';

export class Item {
  public static id: string = 'menu-item';
  public container: HTMLElement;
  private menuInstance: MenuApi;
  /* create new item */
  constructor(
    tagName: string,
    menuInstance: MenuApi,
    itemContent?: string,
    callback?: (m: MenuApi) => void
  ) {
    this.container = document.createElement(tagName);
    this.container.id = Item.id;
    this.menuInstance = menuInstance;
    if (itemContent) {
      this.container.innerText = itemContent;
    }
    if (callback) {
      this.container.addEventListener('mousedown', () =>
        callback(this.menuInstance)
      );
    }
  }

  /* render item in ul-list */
  render(): void {
    const li = document.createElement('li');
    li.appendChild(this.container);
    this.menuInstance.ulList.appendChild(li);
  }
}

export class ItemColor extends Item {
  key: string;
  value: string;
  defaultColor: string;
  container: HTMLElement;
  inputElement: HTMLInputElement;
  labelElement: HTMLLabelElement;

  constructor(
    tagName: string,
    menuInstance: MenuApi,
    key: string,
    value: string,
    defaultColor: string | undefined,
    callback?: (m: MenuApi) => void
  ) {
    super(tagName, menuInstance, null, callback);
    this.key = key;
    this.defaultColor = defaultColor;
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'radio';
    this.inputElement.name = key;
    this.inputElement.value = value;
    this.inputElement.id = Item.id;

    if (this.key === this.defaultColor) {
      this.inputElement.checked = true;
    }

    this.labelElement = document.createElement('label');
    this.labelElement.textContent = value;
    this.labelElement.htmlFor = value;
    this.labelElement.id = Item.id;
    this.container.append(this.inputElement);
    this.container.append(this.labelElement);
  }

  setColorOption(color: string): void {
    this.defaultColor = color;
    // Additional logic related to color setting
  }
}
