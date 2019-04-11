import { PLATFORM } from 'aurelia-pal';
import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
    config.globalResources([
        PLATFORM.moduleName('./attributes/flatpickr'),
        PLATFORM.moduleName('./value-converters/large-number'),
        PLATFORM.moduleName('./value-converters/usd-format'),
        PLATFORM.moduleName('./value-converters/comma'),
    ]);
}
