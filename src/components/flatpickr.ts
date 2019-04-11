import { inject } from 'aurelia-dependency-injection';

import 'flatpickr/dist/flatpickr.css';

import Flatpickr from 'flatpickr';

import {
  customElement,
  bindable,
  bindingMode,
  TaskQueue
} from 'aurelia-framework';

const BaseConfiguration: Flatpickr.Options.Options = {
    allowInput: true,
    altFormat: 'm/d/Y',
    dateFormat: 'Y-m-d h:i K',
    altInput: true
};

@inject(TaskQueue)
@customElement('flatpickr')
export class FlatpickrElement {
  public flatpickr: Flatpickr.Instance;
  @bindable public allowClear = true;
  @bindable public minDate;
  @bindable public maxDate;
  @bindable public initialDate;
  @bindable public disabled;
  @bindable public enable;
  @bindable public id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public value;

  private element: HTMLInputElement;
  private options: Flatpickr.Options.Options = { ...BaseConfiguration };

  private guard = false;

  constructor(private taskQueue) {}

  attached(): void {
    this.flatpickr = Flatpickr(
      this.element,
      this.options
    ) as Flatpickr.Instance;

    this.element.addEventListener('input', this.dateChanged);

    this.dateChanged();
  }

  detached(): void {
    this.element.removeEventListener('input', this.dateChanged);
    this.flatpickr.destroy();
  }

  minDateChanged(val) {
    if (this.flatpickr) {
      this.flatpickr.set('minDate', val);
    } else {
      this.options['minDate'] = val;
    }
  }

  maxDateChanged(val) {
    if (this.flatpickr) {
      this.flatpickr.set('maxDate', val);
    } else {
      this.options['maxDate'] = val;
    }
  }

  valueChanged(val, oldVal) {
    if (this.flatpickr) {
      if (!val && oldVal) {
        this.flatpickr.clear();
      }
    }
  }

  disableChanged(val) {
    if (this.flatpickr) {
      this.flatpickr.set('disable', val);
    } else {
      this.options['disable'] = val;
    }
  }

  enableChanged(val) {
    if (this.flatpickr) {
      this.flatpickr.set('enable', val);
    } else {
      this.options['enable'] = val;
    }
  }

  dateChanged = () => {
    if (!this.guard) {
      let formattedValue: string | Date = this.element.value;

      if (
        typeof this.element.value === 'undefined' ||
        this.element.value === '' ||
        !this.flatpickr ||
        (!formattedValue && !this.options.defaultDate)
      ) {
        return;
      }

      if (!formattedValue && this.options.defaultDate) {
        formattedValue = new Date();
      }

      formattedValue = new Date(formattedValue).toISOString();
      this.guard = true;
      this.flatpickr.setDate(formattedValue);

      this.taskQueue.queueMicroTask(() => (this.guard = false));
    }
  };

  clear() {
    this.flatpickr.clear();
  }

  inputChanged(evt: Event) {
    evt.stopPropagation();

    this.changed();
  }

  @bindable() private changed = () => {};
}
