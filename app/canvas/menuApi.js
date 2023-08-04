import { Item } from './item.js';
import ColorPalette, { ColorPicker, ColorPaletteGroup, } from './ColorPalette.js';
export default class MenuApi {
    constructor() {
        /* create new menu and append functionality */
        this.createMenu = () => {
            document.getElementById('menu-display')?.appendChild(this.ulList);
            this.hide();
            return this;
        };
        /* create new item with callback */
        this.createItem = (item_content, callback) => {
            return new Item('button', this, item_content, (m) => callback(m));
        };
        /* create separator hr-line */
        this.createSeparator = (isHorizontal = true) => {
            const item = new Item('hr', this);
            if (!isHorizontal) {
                item.element.style.height = '25px';
                item.element.style.width = '3px';
            }
            else {
                item.element.style.width = '100%';
                item.element.style.height = '3px';
            }
            return item;
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
            parent?.childNodes[0].remove();
            this.ulList = document.createElement('ul');
            this.ulList.id = MenuApi.id;
            parent?.appendChild(this.ulList);
            /* render items as elements in ul-list */
            this.itemList.forEach((item) => {
                item.render();
            });
            // Ref: https://www.w3schools.com/JSREF/canvas_translate.asp
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
        this.createRadioOption = (colorTypes, colorOptions, defaultColor, specialColor, shapeConstraints, callback) => {
            /* CREATE COLOR PALETTES */
            /* set reference to menuapi.this */
            ColorPaletteGroup.menuApi = this;
            this.addItem(this.createSeparator());
            /* init palettes per type */
            colorTypes.forEach((type) => {
                ColorPaletteGroup.addColorPalette(type, new ColorPalette(type, this));
                this.addItem(this.createSeparator());
            });
            /* ADD INDIVIDUAL PALETTE COLORS */
            for (const key in specialColor) {
                if (specialColor.hasOwnProperty(key)) {
                    const { type, name, value } = specialColor[key];
                    ColorPaletteGroup.group[type].addNewColor(new ColorPicker(this, ColorPaletteGroup.group[type], key, name, value, callback));
                }
            }
            /* ADD ALL MAIN COLORS TO THE PALETTES */
            colorTypes.forEach((type) => {
                for (const key in colorOptions) {
                    if (colorOptions.hasOwnProperty(key)) {
                        const { name, value } = colorOptions[key];
                        ColorPaletteGroup.group[type].addNewColor(new ColorPicker(this, ColorPaletteGroup.group[type], key, name, value, callback));
                    }
                }
                /* SET THE DEFAULT COLOR */
                if (defaultColor?.[type]?.type === type) {
                    ColorPaletteGroup.group[type].setDefaultColor(defaultColor[type].key);
                }
            });
            /* SET CONSTRAINTS */
            for (const key in shapeConstraints) {
                if (shapeConstraints.hasOwnProperty(key)) {
                    const { type, shapeType } = shapeConstraints[key];
                    ColorPaletteGroup.group[type].shapeConstraints.push(shapeType);
                }
            }
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
