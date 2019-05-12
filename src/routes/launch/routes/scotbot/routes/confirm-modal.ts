import { I18N } from 'aurelia-i18n';
import { ToastMessage, ToastService } from 'services/toast-service';
import { PLATFORM } from 'aurelia-pal';
import { DialogController } from 'aurelia-dialog';
import { autoinject, useView } from 'aurelia-framework';
import environment from 'environment';

@useView(PLATFORM.moduleName('./confirm-modal.html'))
@autoinject()
export class ConfirmModal {
    private item;
    private parent;
    private settingsMap: Map<string, string>;

    constructor(private controller: DialogController, private i18n: I18N,
        private toast: ToastService) {
        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;
    }

    async activate(model) {
        this.item = model.settings;
        this.parent = model.vm;

        this.settingsMap = new Map(Object.entries(this.item));
    }

    async promptKeychain() {
        const user = localStorage.getItem('username');

        steem_keychain.requestSendToken(
            user,
            environment.SCOTBOT.FEE_ACCOUNT_2,
            environment.SCOTBOT.FEES.SETUP_2,
            JSON.stringify(this.item),
            'ENG', (response) => {
                if (response.success) {
                    this.parent.feeTwoPaid = true;

                    const toast = new ToastMessage();

                    toast.message = this.i18n.tr('settingsSaved');
        
                    this.toast.success(toast);   

                    this.controller.close(true);
                } else {
                    this.parent.feeTwoPaid = false;
                    const toast = new ToastMessage();

                    toast.message = this.i18n.tr('settingsSavedError');
        
                    this.toast.error(toast);   
                }
            });
    }
}
