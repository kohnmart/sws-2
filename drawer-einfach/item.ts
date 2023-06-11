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
      this.container.addEventListener('click', () =>
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
    selectedColor: string,
    callback?: (m: MenuApi) => void
  ) {
    super(tagName, menuInstance, null, callback);
    this.key = key;
    this.defaultColor = selectedColor;
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'radio';
    this.inputElement.name = key;
    this.inputElement.value = value;

    this.labelElement = document.createElement('label');
    this.labelElement.textContent = value;
    this.labelElement.htmlFor = value;

    this.container.append(this.inputElement);
    this.container.append(this.labelElement);
  }

  setColorOption(color: string): void {
    this.defaultColor = color;
    // Additional logic related to color setting
  }
}
