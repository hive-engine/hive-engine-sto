import { PLATFORM } from 'aurelia-pal';
import { DialogController } from 'aurelia-dialog';
import { autoinject, useView } from 'aurelia-framework';

@useView(PLATFORM.moduleName('./security-modal.html'))
@autoinject()
export class SecurityModal {
    constructor(private controller: DialogController) {
        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;
    }
}
