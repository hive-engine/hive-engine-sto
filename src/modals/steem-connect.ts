import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { SteemEngine } from 'services/steem-engine';

@autoinject()
export class SteemConnectModal {

    constructor(private controller: DialogController, private SE: SteemEngine) {
        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;
    }
}
