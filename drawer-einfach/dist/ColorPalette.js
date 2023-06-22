import { ItemRadio } from './item.js';
export class ColorPaletteGroup {
    static addColorPalette(key, palette) {
        ColorPaletteGroup.group[key] = palette;
    }
}
ColorPaletteGroup.group = {};
ColorPaletteGroup.renderColorPalettes = () => {
    /* for (const key in ColorPaletteGroup.group) {
      if (ColorPaletteGroup.group.hasOwnProperty(key)) {
        ColorPaletteGroup.group[key].render();
      }
    } */
};
export default class ColorPalette {
    constructor(type) {
        this.colors = [];
        this.addNewColor = (color) => {
            this.colors.push(color);
        };
        this.setDefaultColor = (key) => {
            const index = this.colors.findIndex((el) => el.key === key);
            this.defaultRGBA = this.colors[index].colorAsRGBA();
            this.colors[index].radioButton.inputElement.checked = true;
            if (this.colors[index].radioButton.inputElement.name === Types.Hintergrund) {
                this.colors[index].setColorOption(true);
            }
            else {
                this.colors[index].setColorOption(false);
            }
        };
        this.render = () => {
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
        this.type = type;
    }
}
export class Color {
    constructor(menuApi, paletteInstance, key, name, value, callback) {
        this.paletteInstance = paletteInstance;
        this.key = key;
        this.colorValue = value;
        this.radioButton = new ItemRadio('div', name, menuApi);
        this.radioButton.inputElement.name = this.paletteInstance.type;
        menuApi.addItems(this.radioButton, menuApi.createSeparator());
        if (callback) {
            this.radioButton.inputElement.addEventListener('mousedown', () => callback(this));
        }
    }
    setColorOption(isBackground) {
        if (isBackground) {
            Color.defaultBackground = this.key;
        }
        else {
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
export var Types;
(function (Types) {
    Types["Outline"] = "Outline";
    Types["Hintergrund"] = "Hintergrund";
})(Types || (Types = {}));
//# sourceMappingURL=ColorPalette.js.map