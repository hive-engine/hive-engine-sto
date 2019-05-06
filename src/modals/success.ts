import { PLATFORM } from 'aurelia-pal';
import { DialogController } from 'aurelia-dialog';
import { autoinject, useView } from 'aurelia-framework';

@useView(PLATFORM.moduleName('./success.html'))
@autoinject()
export class SuccessModal {
    private item;

    constructor(
        private controller: DialogController) {
        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;
    }

    async activate(item) {
        this.item = item;
    }
}
