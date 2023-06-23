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
  public item: Item;
  public colors: Color[] = [];
  public defaultRGBA: string;

  constructor(type: Types, menuApi: MenuApi) {
    this.type = type;
    this.item = new Item('ul', menuApi);
    this.item.container.push(new Item('li', menuApi, type));
    menuApi.addItem(this.item);
  }

  addNewColor = (color: Color): void => {
    this.colors.push(color);
  };

  setDefaultColor = (key: string): void => {
    const color = this.colors.find((el) => el.key === key);
    if (color) {
      this.defaultRGBA = color.colorAsRGBA();
      color.radioButton.inputElement.checked = true;
      color.setColorOption(
        color.radioButton.inputElement.name === Types.Hintergrund
      );
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
    this.radioButton = new ItemRadio('li', name, menuApi);
    this.radioButton.inputElement.name = this.paletteInstance.type;
    this.paletteInstance.item.container.push(this.radioButton);
    if (callback) {
      this.radioButton.inputElement.addEventListener('mousedown', () =>
        callback(this)
      );
    }
  }

  setColorOption(isBackground: boolean): void {
    Color.defaultBackground = isBackground ? this.key : Color.defaultBackground;
    Color.defaultForground = !isBackground ? this.key : Color.defaultForground;
  }

  colorAsRGBA(): string {
    const { red, green, blue, alpha } = this.colorValue;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
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
