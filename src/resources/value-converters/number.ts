import { valueConverter } from 'aurelia-binding';

@valueConverter('number')
export class NumberValueConverter {
    fromView(val, precision = 0) {
        return !val ? val : parseFloat(val).toFixed(precision);
    }

    toView(val) {
        return !val ? val : val.toString();
    }
}
