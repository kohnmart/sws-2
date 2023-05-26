var _a, _b;
import MenuApi from './menuApi.js';
const setupContextMenu = (menuApi) => {
    const menu = menuApi.createMenu();
    const mItem1 = menuApi.createItem('I 1', (m) => {
        m.hide();
    });
    const mItem2 = menuApi.createItem('I 2', (m) => {
        console.log(m);
    });
    const mT1 = menuApi.createSeparator();
    const mItem3 = menuApi.createItem('I 3', (m) => {
        m.hide();
    });
    menu.addItems(mItem1, mItem2);
    menu.addItem(mT1);
    menu.addItem(mItem3);
    return menu;
};
const menu = setupContextMenu(new MenuApi());
/* Apply preventDefault to all child-events of parent-div */
const container = document.getElementById('container');
container === null || container === void 0 ? void 0 : container.addEventListener('click', function (event) {
    event.preventDefault();
});
/* open-menu event */
(_a = document.getElementById('open-menu')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
    const { clientX: x, clientY: y } = e;
    menu.show(x, y);
});
/* dynamic-item event */
(_b = document.getElementById('dynamic-item')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => {
    const { clientX: x, clientY: y } = e;
    const dynamicItem = menu.createItem('II 5', (m) => {
        console.log('wow');
        m.hide();
    });
    // Order after the call : I 1 , I 2 , dynamicItem , Sep , I 3
    menu.addItemAt(dynamicItem, 2);
    menu.show(x, y);
    menu.removeItem(dynamicItem);
});
