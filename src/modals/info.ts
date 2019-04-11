import { DialogController } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { SteemEngine } from 'services/steem-engine';

@autoinject()
export class InfoModal {
    private token;

    constructor(private controller: DialogController, private SE: SteemEngine) {
        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;
    }

    async activate(token) {
        this.token = token;
    }
}
