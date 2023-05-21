export class Item {
  element: HTMLElement;
  constructor(element: HTMLElement) {
    this.element = element;
  }

  hide(): void {
    this.element.style.display = 'none';
  }

  show(): void {
    this.element.style.display = 'block';
  }
}
