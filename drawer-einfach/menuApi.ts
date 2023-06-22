import { Item } from './item.js';
import ColorPalette, {
  Color,
  ColorPaletteGroup,
  Types,
  IColorValue,
} from './ColorPalette.js';
import { Selector } from './Selector.js';
export default class MenuApi {
  static id: string = 'menu';
  itemList: Array<Item>;
  ulList: HTMLUListElement;
  eventListener: EventListenerOrEventListenerObject;

  constructor() {
    this.itemList = [];
    this.ulList = document.createElement('ul');
    this.eventListener = (event: Event): void => {
      const target = event.target as HTMLElement;
      /* check if target is menu or menu-item */
      if (target.id != Item.id && target.id != MenuApi.id) {
        event.preventDefault();
        event.stopPropagation();
        this.hide();
      }
    };
  }

  /* create new menu and append functionality */
  createMenu = (): MenuApi => {
    document.getElementById('menu-display')?.appendChild(this.ulList);
    this.hide();
    return this;
  };

  /* create new item with callback */
  createItem = (
    item_content: string,
    callback: (m: MenuApi | Selector) => void
  ): Item => {
    return new Item('button', this, item_content, (m) => callback(m));
  };

  /* create separator hr-line */
  createSeparator = (): Item => {
    return new Item('hr', this);
  };

  /* add single item to list */
  addItem = (item: Item): void => {
    this.itemList.push(item);
  };

  /* append new items to list */
  addItems = (...items: Item[]): void => {
    items.forEach((item) => {
      this.itemList.push(item);
    });
  };

  /* add new item at index */
  addItemAt = (item: Item, index: number): void => {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice?retiredLocale=de
    const beforeIndex = this.itemList.slice(0, index);
    const afterIndex = this.itemList.slice(index);
    this.itemList = [...beforeIndex, item, ...afterIndex];
  };

  /* remove item */
  removeItem = (item: Item): void => {
    const index = this.itemList.findIndex(
      (e) => e.element.innerText == item.element.innerText
    );
    const beforeIndex = this.itemList.slice(0, index);
    const afterIndex = this.itemList.slice(index + 1);
    this.itemList = [...beforeIndex, ...afterIndex];
  };

  /* display menu instance */
  show = (x: number, y: number): void => {
    /* clear ul-list */
    const parent = document.getElementById('menu-display');
    parent?.childNodes[0].remove();
    this.ulList = document.createElement('ul');
    this.ulList.id = MenuApi.id;
    parent?.appendChild(this.ulList);

    /* render items as elements in ul-list */
    this.itemList.forEach((item) => {
      item.render();
    });

    ColorPaletteGroup.renderColorPalettes();

    // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
    //this.ulList.style.transform = `translate(${x}px, ${y}px)`;
    this.ulList.style.left = `${x}px`;
    this.ulList.style.top = `${y}px`;

    /* event-prevent default for all elements */
    document.addEventListener('mousedown', this.eventListener, true);
  };

  /* hide menu instance */
  hide = (): void => {
    this.ulList.style.display = 'none';
    /* remove listener */
    document.removeEventListener('mousedown', this.eventListener, true);
  };

  createRadioOption = (
    colorTypes: Types[],
    colorOptions: { [key: string]: { name: string; value: IColorValue } },
    defaultColor?: {
      [key: string]: { type: Types; key: string };
    },
    callback?: (m: Color) => void
  ): void => {
    /* CREATE COLOR PALETTES */
    colorTypes.forEach((type) => {
      ColorPaletteGroup.addColorPalette(type, new ColorPalette(type));
    });

    ColorPaletteGroup.menuApi = this;

    /* ADD INDIVIDUAL COLOR */
    ColorPaletteGroup.group[Types.Hintergrund].addNewColor(
      new Color(
        this,
        ColorPaletteGroup.group[Types.Hintergrund],
        'transparent',
        'transparent',
        { red: 0, green: 0, blue: 0, alpha: 0 },
        (m: Color) => callback(m)
      )
    );

    colorTypes.forEach((type) => {
      /*  Loop over color-map */
      for (const key in colorOptions) {
        if (colorOptions.hasOwnProperty(key)) {
          /* Create new Color */
          const color = new Color(
            this,
            ColorPaletteGroup.group[type],
            key,
            colorOptions[key].name,
            colorOptions[key].value,
            (m: Color) => callback(m)
          );
          ColorPaletteGroup.group[type].addNewColor(color);
        }
      }
      if (defaultColor[type].type === type) {
        ColorPaletteGroup.group[type].setDefaultColor(defaultColor[type].key);
      }
    });
  };
}
