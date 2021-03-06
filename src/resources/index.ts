import { PLATFORM } from 'aurelia-pal';
import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(config: FrameworkConfiguration) {
    config.globalResources([
        PLATFORM.moduleName('./attributes/flatpickr'),
        PLATFORM.moduleName('./value-converters/auth-filter'),
        PLATFORM.moduleName('./value-converters/trim'),
        PLATFORM.moduleName('./value-converters/large-number'),
        PLATFORM.moduleName('./value-converters/comma'),
        PLATFORM.moduleName('./value-converters/number'),
        PLATFORM.moduleName('./value-converters/object-keys'),
    ]);
}
