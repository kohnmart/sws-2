import { Item } from './item.js';
import ColorPalette, { Color, ColorPaletteGroup, Types, } from './ColorPalette.js';
export default class MenuApi {
    constructor() {
        /* create new menu and append functionality */
        this.createMenu = () => {
            var _a;
            (_a = document.getElementById('menu-display')) === null || _a === void 0 ? void 0 : _a.appendChild(this.ulList);
            this.hide();
            return this;
        };
        /* create new item with callback */
        this.createItem = (item_content, callback) => {
            return new Item('button', this, item_content, (m) => callback(m));
        };
        /* create separator hr-line */
        this.createSeparator = () => {
            return new Item('hr', this);
        };
        /* add single item to list */
        this.addItem = (item) => {
            this.itemList.push(item);
        };
        /* append new items to list */
        this.addItems = (...items) => {
            items.forEach((item) => {
                this.itemList.push(item);
            });
        };
        /* add new item at index */
        this.addItemAt = (item, index) => {
            // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice?retiredLocale=de
            const beforeIndex = this.itemList.slice(0, index);
            const afterIndex = this.itemList.slice(index);
            this.itemList = [...beforeIndex, item, ...afterIndex];
        };
        /* remove item */
        this.removeItem = (item) => {
            const index = this.itemList.findIndex((e) => e.element.innerText == item.element.innerText);
            const beforeIndex = this.itemList.slice(0, index);
            const afterIndex = this.itemList.slice(index + 1);
            this.itemList = [...beforeIndex, ...afterIndex];
        };
        /* display menu instance */
        this.show = (x, y) => {
            /* clear ul-list */
            const parent = document.getElementById('menu-display');
            parent === null || parent === void 0 ? void 0 : parent.childNodes[0].remove();
            this.ulList = document.createElement('ul');
            this.ulList.id = MenuApi.id;
            parent === null || parent === void 0 ? void 0 : parent.appendChild(this.ulList);
            /* render items as elements in ul-list */
            this.itemList.forEach((item) => {
                item.render();
            });
            ColorPaletteGroup.renderColorPalettes();
            // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
            //this.ulList.style.transform = `translate(${x}px, ${y}px)`;
            this.ulList.style.left = `${x}px`;
            this.ulList.style.top = `${y}px`;
            /* event-prevent default for all elements */
            document.addEventListener('mousedown', this.eventListener, true);
        };
        /* hide menu instance */
        this.hide = () => {
            this.ulList.style.display = 'none';
            /* remove listener */
            document.removeEventListener('mousedown', this.eventListener, true);
        };
        this.createRadioOption = (colorTypes, colorOptions, defaultColor, callback) => {
            /* CREATE COLOR PALETTES */
            colorTypes.forEach((type) => {
                ColorPaletteGroup.addColorPalette(type, new ColorPalette(type));
            });
            ColorPaletteGroup.menuApi = this;
            /* ADD INDIVIDUAL COLOR */
            ColorPaletteGroup.group[Types.Hintergrund].addNewColor(new Color(this, ColorPaletteGroup.group[Types.Hintergrund], 'transparent', 'transparent', { red: 0, green: 0, blue: 0, alpha: 0 }, (m) => callback(m)));
            colorTypes.forEach((type) => {
                /*  Loop over color-map */
                for (const key in colorOptions) {
                    if (colorOptions.hasOwnProperty(key)) {
                        /* Create new Color */
                        const color = new Color(this, ColorPaletteGroup.group[type], key, colorOptions[key].name, colorOptions[key].value, (m) => callback(m));
                        ColorPaletteGroup.group[type].addNewColor(color);
                    }
                }
                if (defaultColor[type].type === type) {
                    ColorPaletteGroup.group[type].setDefaultColor(defaultColor[type].key);
                }
            });
        };
        this.itemList = [];
        this.ulList = document.createElement('ul');
        this.eventListener = (event) => {
            const target = event.target;
            /* check if target is menu or menu-item */
            if (target.id != Item.id && target.id != MenuApi.id) {
                event.preventDefault();
                event.stopPropagation();
                this.hide();
            }
        };
    }
}
MenuApi.id = 'menu';
//# sourceMappingURL=menuApi.js.map