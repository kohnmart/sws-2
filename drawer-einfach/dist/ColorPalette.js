import { Item, ItemRadio } from './item.js';
import { PLT_TYPES } from './types.js';
export class ColorPaletteGroup {
    static addColorPalette(key, palette) {
        ColorPaletteGroup.group[key] = palette;
    }
}
ColorPaletteGroup.group = {};
export default class ColorPalette {
    constructor(type, menuApi) {
        this.colors = [];
        this.addNewColor = (color) => {
            this.colors.push(color);
        };
        this.setDefaultColor = (key) => {
            const color = this.colors.find((el) => el.key === key);
            if (color) {
                this.defaultRGBA = color.colorFormatAsRGBA();
                color.radioButton.inputElement.checked = true;
                color.setColorOption(color.radioButton.inputElement.name === PLT_TYPES.Hintergrund);
            }
        };
        this.type = type;
        this.item = new Item('ul', menuApi);
        this.item.container.push(new Item('li', menuApi, type));
        menuApi.addItem(this.item);
    }
}
export class Color {
    constructor(menuApi, paletteInstance, key, name, value, callback) {
        this.paletteInstance = paletteInstance;
        this.key = key;
        this.colorValue = value;
        this.radioButton = new ItemRadio('li', name, menuApi);
        this.radioButton.inputElement.name = this.paletteInstance.type;
        this.paletteInstance.item.container.push(this.radioButton);
        if (callback) {
            this.radioButton.inputElement.addEventListener('mousedown', () => callback(this));
        }
    }
    setColorOption(isBackground) {
        Color.defaultBackground = isBackground ? this.key : Color.defaultBackground;
        Color.defaultForground = !isBackground ? this.key : Color.defaultForground;
    }
    colorFormatAsRGBA() {
        const { red, green, blue, alpha } = this.colorValue;
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
}
//# sourceMappingURL=ColorPalette.js.map