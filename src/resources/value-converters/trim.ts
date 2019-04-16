import { valueConverter } from 'aurelia-binding';

@valueConverter('trim')
export class Trim {
  toView(arr, limit: number = 2) {
    if (!arr) {
      return arr;
    }

    return arr.slice(0, limit);
  }
}
