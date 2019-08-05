import {customAttribute, inject} from 'aurelia-framework';
import $ from 'jquery';

@customAttribute('bootstrap-tooltip')
@inject(Element)
export class BootstrapTooltip {
  constructor(private element: Element) {
    this.element = element;
  }

  bind() {
    (<any>$(this.element)).tooltip();
  }
}
