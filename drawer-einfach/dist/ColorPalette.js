import { Item, ItemRadio } from './item.js';
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
                this.defaultRGBA = color.colorAsRGBA();
                color.radioButton.inputElement.checked = true;
                color.setColorOption(color.radioButton.inputElement.name === Types.Hintergrund);
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
    colorAsRGBA() {
        const { red, green, blue, alpha } = this.colorValue;
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
}
export var Types;
(function (Types) {
    Types["Outline"] = "Outline";
    Types["Hintergrund"] = "Hintergrund";
})(Types || (Types = {}));
//# sourceMappingURL=ColorPalette.js.map