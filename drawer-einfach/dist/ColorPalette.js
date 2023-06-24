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
        // Set new default color
        // Currently not in use
        this.setDefaultColor = (key) => {
            const color = this.colors.find((el) => el.key === key);
            if (color) {
                this.defaultRGBA = color.colorFormatAsRGBA();
                this.colorKey = color.key;
                color.radioButton.inputElement.checked = true;
            }
        };
        this.type = type;
        this.item = new Item('ul', menuApi);
        this.item.container.push(new Item('li', menuApi, type));
        menuApi.addItem(this.item);
    }
    // Set colorpicker to be the selected shapes color
    setColorPicker(isSingleSelect, shapesColorKey) {
        this.colors.forEach((cl) => {
            if (isSingleSelect) {
                if (shapesColorKey === cl.key) {
                    cl.radioButton.inputElement.checked = true;
                }
                else {
                    cl.radioButton.inputElement.checked = false;
                }
            }
            else {
                cl.radioButton.inputElement.checked = false;
            }
        });
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
        this.radioButton.inputElement.addEventListener('mousedown', () => callback(this));
    }
    colorFormatAsRGBA() {
        const { red, green, blue, alpha } = this.colorValue;
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }
}
//# sourceMappingURL=ColorPalette.js.map