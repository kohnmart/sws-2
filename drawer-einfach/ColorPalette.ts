import { Item, ItemRadio } from './item.js';
import MenuApi from './menuApi.js';

export class ColorPaletteGroup {
  static menuApi: MenuApi;
  static group: { [key: string]: ColorPalette } = {};

  static addColorPalette(key: string, palette: ColorPalette) {
    ColorPaletteGroup.group[key] = palette;
  }
}

export default class ColorPalette {
  public type: Types;
  public container: Item;
  public colors: Color[] = [];
  public defaultRGBA: string;
  constructor(type: Types, menuApi: MenuApi) {
    this.type = type;
    this.container = new Item('div', menuApi);
    menuApi.addItem(this.container);
    this.container.container.push(new Item('p', menuApi, type));
  }

  addNewColor = (color: Color): void => {
    this.colors.push(color);
  };

  setDefaultColor = (key: string): void => {
    const index = this.colors.findIndex((el) => el.key === key);
    this.defaultRGBA = this.colors[index].colorAsRGBA();
    this.colors[index].radioButton.inputElement.checked = true;

    if (
      this.colors[index].radioButton.inputElement.name === Types.Hintergrund
    ) {
      this.colors[index].setColorOption(true);
    } else {
      this.colors[index].setColorOption(false);
    }
  };
}

export class Color {
  public static defaultBackground: string | undefined;
  public static defaultForground: string | undefined;
  public defaultColor: string | undefined;
  public key: string;
  public colorValue: IColorValue;
  public radioButton: ItemRadio;
  public paletteInstance: ColorPalette;
  constructor(
    menuApi: MenuApi,
    paletteInstance: ColorPalette,
    key: string,
    name: string,
    value: IColorValue,
    callback: (m: Color) => void
  ) {
    this.paletteInstance = paletteInstance;
    this.key = key;
    this.colorValue = value;
    this.radioButton = new ItemRadio('div', name, menuApi);
    this.radioButton.inputElement.name = this.paletteInstance.type;
    paletteInstance.container.container.push(
      this.radioButton,
      menuApi.createSeparator(false)
    );
    if (callback) {
      this.radioButton.inputElement.addEventListener('mousedown', () =>
        callback(this)
      );
    }
  }

  setColorOption(isBackground: boolean): void {
    if (isBackground) {
      Color.defaultBackground = this.key;
    } else {
      Color.defaultForground = this.key;
    }
  }

  colorAsRGBA() {
    return `rgba(
      ${this.colorValue.red}, 
      ${this.colorValue.green}, 
      ${this.colorValue.blue}, 
      ${this.colorValue.alpha})`;
  }
}

export type IColorValue = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export enum Types {
  Outline = 'Outline',
  Hintergrund = 'Hintergrund',
}
