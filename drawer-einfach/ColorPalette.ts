import { ItemRadio } from './item.js';
import MenuApi from './menuApi.js';

export class ColorPaletteGroup {
  static menuApi: MenuApi;
  static group: { [key: string]: ColorPalette } = {};

  static addColorPalette(key: string, palette: ColorPalette) {
    ColorPaletteGroup.group[key] = palette;
  }

  static renderColorPalettes = () => {
    for (const key in ColorPaletteGroup.group) {
      if (ColorPaletteGroup.group.hasOwnProperty(key)) {
        ColorPaletteGroup.group[key].render();
      }
    }
  };
}

export default class ColorPalette {
  public type: Types;
  public colors: Color[] = [];
  public defaultRGBA: string;
  constructor(type: Types) {
    this.type = type;
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

  render = () => {
    const container = document.createElement('div');
    const header = document.createElement('p');
    header.innerHTML = this.type;

    container.append(header);

    this.colors.forEach((element) => {
      container.appendChild(element.radioButton.element);
      element.radioButton.inputElement.name = this.type;
      ColorPaletteGroup.menuApi.createSeparator();
    });

    ColorPaletteGroup.menuApi.ulList.appendChild(container);
  };
}

export class Color {
  public static defaultBackground: string | undefined;
  public static defaultForground: string | undefined;
  public key: string;
  public colorValue: IColorValue;
  public defaultColor: string | undefined;
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
