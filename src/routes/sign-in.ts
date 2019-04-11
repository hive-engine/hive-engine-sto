import { I18N } from 'aurelia-i18n';
import { ToastMessage } from './../services/toast-service';
import { login } from 'store/actions';
import { dispatchify } from 'aurelia-store';
import { SteemEngine } from 'services/steem-engine';
import { autoinject } from 'aurelia-framework';
import { ToastService } from 'services/toast-service';
import { Router } from 'aurelia-router';

@autoinject()
export class Signin {
    private username = '';
    private privateKey = '';

    constructor(
        private router: Router,
        private SE: SteemEngine, 
        private i18n: I18N, 
        private toast: ToastService) {

    }

    async keychainSignIn() {
        const username = await this.SE.login(this.username.trim().toLowerCase());

        if (username) {
            const toast = new ToastMessage();
    
            toast.message = this.i18n.tr('signinSuccess');

            toast.overrideOptions.onClosing = () => {
                this.router.navigateToRoute('home');
            }

            this.toast.success(toast);

            await dispatchify(login)(username);
        }
    }

    keySignIn() {
        this.SE.login(this.username.trim().toLowerCase(), this.privateKey.trim());
    }
}
