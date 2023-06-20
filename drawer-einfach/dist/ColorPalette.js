import { ItemRadio } from './item.js';
export class ColorPaletteGroup {
    static addColorPalette(key, palette) {
        ColorPaletteGroup.group[key] = palette;
    }
}
ColorPaletteGroup.group = {};
ColorPaletteGroup.renderColorPalettes = () => {
    for (const key in ColorPaletteGroup.group) {
        if (ColorPaletteGroup.group.hasOwnProperty(key)) {
            ColorPaletteGroup.group[key].render();
        }
    }
};
export default class ColorPalette {
    constructor(type) {
        this.colors = [];
        this.addNewColor = (color) => {
            this.colors.push(color);
            console.log(color.key);
        };
        this.getColorByKey = (key) => {
            return this.colors.findIndex((el) => el.key === key);
        };
        this.render = () => {
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
        this.type = type;
    }
}
export class Color {
    constructor(menuApi, key, value, callback) {
        this.key = key;
        this.colorValue = value;
        this.radioButton = new ItemRadio('div', key, menuApi);
        if (this.key === ItemRadio.defaultBackground) {
            this.radioButton.inputElement.checked = true;
        }
        if (callback) {
            this.radioButton.inputElement.addEventListener('mousedown', () => callback(this));
        }
        ItemRadio.defaultBackground = this.defaultColor;
    }
    setColorOption(isBackground) {
        if (isBackground) {
            Color.defaultBackground = this.key;
        }
        else {
            Color.defaultForground = this.key;
        }
    }
    setDefaultBackground(defaultColor) {
        this.defaultColor = defaultColor;
        ItemRadio.defaultBackground = defaultColor;
    }
}
export var Types;
(function (Types) {
    Types["Outline"] = "Outline";
    Types["Hintergrund"] = "Hintergrund";
})(Types || (Types = {}));
//# sourceMappingURL=ColorPalette.js.map