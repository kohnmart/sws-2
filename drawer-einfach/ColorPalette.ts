import { Item, ItemRadio } from './item.js';
import MenuApi from './menuApi.js';
import { PLT_TYPES, ColorValue } from './types.js';

export class ColorPaletteGroup {
  static menuApi: MenuApi;
  static readonly group: { [key: string]: ColorPalette } = {};

  static addColorPalette(key: string, palette: ColorPalette) {
    ColorPaletteGroup.group[key] = palette;
  }
}

export default class ColorPalette {
  public readonly type: PLT_TYPES;
  public readonly item: Item;
  public readonly colors: Color[] = [];
  public defaultRGBA: string;
  public colorKey: string;

  constructor(type: PLT_TYPES, menuApi: MenuApi) {
    this.type = type;
    this.item = new Item('ul', menuApi);
    this.item.container.push(new Item('li', menuApi, type));
    menuApi.addItem(this.item);
  }

  addNewColor = (color: Color): void => {
    this.colors.push(color);
  };

  // Set new default color
  // Currently not in use
  setDefaultColor = (key: string): void => {
    const color = this.colors.find((el) => el.key === key);
    if (color) {
      this.defaultRGBA = color.colorFormatAsRGBA();
      this.colorKey = color.key;
      color.radioButton.inputElement.checked = true;
    }
  };

  // Set colorpicker to be the selected shapes color
  setColorPicker(isSingleSelect: boolean, shapesColorKey?: string) {
    this.colors.forEach((cl) => {
      if (isSingleSelect) {
        if (shapesColorKey === cl.key) {
          cl.radioButton.inputElement.checked = true;
        } else {
          cl.radioButton.inputElement.checked = false;
        }
      } else {
        cl.radioButton.inputElement.checked = false;
      }
    });
  }
}

export class Color {
  public readonly key: string;
  public readonly colorValue: ColorValue;
  public readonly radioButton: ItemRadio;
  public readonly paletteInstance: ColorPalette;

  constructor(
    menuApi: MenuApi,
    paletteInstance: ColorPalette,
    key: string,
    name: string,
    value: ColorValue,
    callback: (m: Color) => void
  ) {
    this.paletteInstance = paletteInstance;
    this.key = key;
    this.colorValue = value;
    this.radioButton = new ItemRadio('li', name, menuApi);
    this.radioButton.inputElement.name = this.paletteInstance.type;
    this.paletteInstance.item.container.push(this.radioButton);
    this.radioButton.inputElement.addEventListener('mousedown', () =>
      callback(this)
    );
  }

  colorFormatAsRGBA(): string {
    const { red, green, blue, alpha } = this.colorValue;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
}
