import { Selector } from './Selector.js';
export class ToolArea {
    constructor(shapesSelector, menu) {
        this.selectedShape = undefined;
        const list = [];
        shapesSelector.forEach((shape) => {
            const listItem = document.createElement('li');
            listItem.innerText = shape.label;
            menu.appendChild(listItem);
            list.push(listItem);
            listItem.addEventListener('click', () => {
                selectTool.call(this, shape, listItem);
            });
        });
        function selectTool(shape, activeListItem) {
            // remove class from all elements
            list.forEach((item) => {
                item.classList.remove('marked');
            });
            if (shape.hasOwnProperty('shapeManager')) {
                Selector.isEditMode = false;
                this.selectedShape = shape;
            }
            else {
                console.log('Selection Mode');
                Selector.isEditMode = true;
                this.selectedShape = shape;
            }
            // add class to the one that is selected currently
            activeListItem.classList.add('marked');
        }
    }
    getSelectedShape() {
        return this.selectedShape;
    }
}
//# sourceMappingURL=ToolArea.js.map