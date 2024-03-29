import { Item, ItemRadio } from './item.js';
export class ColorPaletteGroup {
    static menuApi;
    static group = {};
    static addColorPalette(key, palette) {
        ColorPaletteGroup.group[key] = palette;
    }
}
export default class ColorPalette {
    type;
    item;
    colors = [];
    defaultRGBA;
    colorKey;
    shapeConstraints = [];
    constructor(type, menuApi) {
        this.type = type;
        this.item = new Item('ul', menuApi);
        // create new sublist for colorpickers
        this.item.container.push(new Item('li', menuApi, type));
        menuApi.addItem(this.item);
    }
    addNewColor = (color) => {
        this.colors.push(color);
    };
    // Set new default color initially
    setDefaultColor = (key) => {
        const color = this.colors.find((el) => el.key === key);
        if (color) {
            this.defaultRGBA = color.colorFormatAsRGBA();
            this.colorKey = color.key;
            color.radioButton.inputElement.checked = true;
        }
    };
    // Set colorpicker to be the selected shapes color
    setColorPicker(shapeTypeConstraint, isSingleSelect, shapesColorKey) {
        this.colors.forEach((cl) => {
            // check for constraints
            if (!this.shapeConstraints.includes(shapeTypeConstraint)) {
                // enable all inputs
                cl.radioButton.inputElement.disabled = false;
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
            }
            else {
                // disable all inputs for this shape
                cl.radioButton.inputElement.disabled = true;
            }
        });
    }
}
export class ColorPicker {
    key;
    colorValue;
    radioButton;
    paletteInstance;
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
