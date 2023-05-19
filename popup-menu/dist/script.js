import { MenuApi as Menu } from './menuApi.js';
const menu = new Menu('grey');
menu.addItems('Menu List', 'Item-2', 'Item-3', 'Item-2', 'Item-3');
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!menu.is_displayed) {
        menu.show(e);
    }
    else {
        menu.hide();
    }
});
menu.addSubMenu('Item-2');
