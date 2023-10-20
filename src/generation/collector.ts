export class Collector<Element> {
  private elements: Element[];

  get size() {
    return this.elements.length;
  }

  constructor(elements: Element[] = []) {
    this.elements = elements;
  }

  collect(element: Element): void {
    this.elements.push(element);
  }

  getElements(): Element[] {
    return this.elements;
  }
}
