import { PLATFORM } from 'aurelia-pal';
import { DialogController } from 'aurelia-dialog';
import { autoinject, useView } from 'aurelia-framework';
import environment from 'environment';

@useView(PLATFORM.moduleName('./confirm-modal.html'))
@autoinject()
export class ConfirmModal {
    private item;
    private parent;
    private difference;

    constructor(private controller: DialogController) {
        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;
    }

    async activate(model) {
        this.item = model.settings;
        this.difference = model.difference;
        this.parent = model.vm;
    }

    async promptKeychain() {
        const user = localStorage.getItem('username');

        steem_keychain.requestSendToken(
            user,
            environment.SCOTBOT.FEE_ACCOUNT_2,
            environment.SCOTBOT.FEES.SETUP_2,
            `{"token": "${this.item.token}"}`,
            'ENG', (response) => {
                if (response.success) {
                    this.parent.feeTwoPaid = true;
                    this.controller.close(true);
                } else {
                    this.parent.feeTwoPaid = false;
                }
            });
    }
}
