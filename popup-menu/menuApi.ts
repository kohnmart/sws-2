export class MenuApi {
  list: HTMLElement;
  is_displayed: boolean;
  display_type: string;
  is_moving: boolean;

  constructor(
    bgcolor: string = 'grey',
    display: string = 'flex',
    padding: string = '20px',
    align: string = 'left'
  ) {
    // create new list element
    this.list = document.createElement('ul');
    this.is_displayed = false;
    this.is_moving = false;
    this.display_type = display;

    // list base-style-configuration
    this.list.style.display = 'none';
    this.list.style.position = 'absolute';
    this.list.style.left = '0px';
    this.list.style.top = '0px';
    this.list.style.flexDirection = 'column';
    this.list.style.alignItems = 'center';
    this.list.style.justifyContent = 'center';
    this.list.style.height = 'auto';
    this.list.style.width = 'auto';
    // optional styling
    this.list.style.backgroundColor = bgcolor;
    this.list.style.textAlign = align;
    this.list.style.padding = padding;

    // append to root div
    document.getElementById('display')?.appendChild(this.list);
    return this;
  }

  addItems(title: string, ...inputs: string[]) {
    const items = [...inputs];

    const headline: HTMLElement = document.createElement('h4');
    headline.innerText = title;
    this.list.appendChild(headline);

    items.forEach((el) => {
      const item: HTMLElement = document.createElement('li');
      item.innerText = el;
      item.style.listStyle = 'none';
      item.style.margin = '5px 0px';
      this.list.appendChild(item);
    });
  }

  show(event: MouseEvent): void {
    this.is_displayed = true;
    this.list.style.display = this.display_type;
    let { clientX: x, clientY: y } = event;
    this.list.style.transform = `translate(${x}px, ${y}px)`;
  }

  hide(): void {
    this.is_displayed = false;
    this.list.style.display = 'none';
  }

  move(event: MouseEvent): void {
    let { clientX: x, clientY: y } = event;
    this.list.style.transform = `translate(${x}px, ${y}px)`;
  }
}
