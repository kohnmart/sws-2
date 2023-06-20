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

  constructor(type: Types) {
    this.type = type;
  }

  addNewColor = (color: Color): void => {
    this.colors.push(color);
    console.log(color.key);
  };

  getColorByKey = (key: string): number | undefined => {
    return this.colors.findIndex((el) => el.key === key);
  };

  render = () => {
    const container = document.createElement('div');
    const header = document.createElement('p');
    header.innerHTML = this.type;

    container.append(header);

    this.colors.forEach((element) => {
      container.appendChild(element.radioButton.element);
      ColorPaletteGroup.menuApi.createSeparator();
    });

    ColorPaletteGroup.menuApi.ulList.appendChild(container);
    console.log(container);
  };
}

export class Color {
  public static defaultBackground: string | undefined;
  public static defaultForground: string | undefined;
  public key: string;
  public colorValue: IColorValue;
  public defaultColor: string | undefined;
  public radioButton: ItemRadio;
  constructor(
    menuApi: MenuApi,
    key: string,
    value: IColorValue,
    callback: (m: Color) => void
  ) {
    this.key = key;
    this.colorValue = value;
    this.radioButton = new ItemRadio('div', key, menuApi);

    if (this.key === ItemRadio.defaultBackground) {
      this.radioButton.inputElement.checked = true;
    }

    if (callback) {
      this.radioButton.inputElement.addEventListener('mousedown', () =>
        callback(this)
      );
    }
    ItemRadio.defaultBackground = this.defaultColor;
  }

  setColorOption(isBackground: boolean): void {
    if (isBackground) {
      Color.defaultBackground = this.key;
    } else {
      Color.defaultForground = this.key;
    }
  }

  setDefaultBackground(defaultColor: string) {
    this.defaultColor = defaultColor;
    ItemRadio.defaultBackground = defaultColor;
  }
}

type IColorValue = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export enum Types {
  Outline = 'Outline',
  Hintergrund = 'Hintergrund',
}
