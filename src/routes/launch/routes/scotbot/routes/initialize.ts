import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { SteemEngine } from 'services/steem-engine';
import { autoinject } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationController, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { ToastMessage, ToastService } from 'services/toast-service';

import steem from 'steem';
import environment from 'environment';
import { I18N } from 'aurelia-i18n';

@autoinject()
export class Initialize {
    private userActiveKey: string;
    private steemUsername = 'beggars';
    private tokenSymbol;
    private environment = environment;
    private showForm = true;

    private balance;
    private tokens = [];

    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;

    constructor(
        private controllerFactory: ValidationControllerFactory, 
        private se: SteemEngine,
        private i18n: I18N,
        private toast: ToastService) {
        this.controller = controllerFactory.createForCurrentScope();

        this.renderer = new BootstrapFormRenderer();

        this.controller.addRenderer(this.renderer);
    }

    async activate() {
        const user = localStorage.getItem('username');

        try {
            const balance = await this.se.loadBalances(user, environment.NATIVE_TOKEN);

            if (balance[0]) {
                this.balance = parseFloat(balance[0].balance).toFixed(3);
            }
        } catch { /* none */ }
        
        this.tokens = await this.se.loadUserTokens(user);
    }

    async sendInitialEngFeeWithKey() {
        const validator: ControllerValidateResult = await this.controller.validate();

        // Validator result is valid
        if (validator.valid) {
            // Firstly, we want to encode the active key and selected token
            const encoded = steem.memo.encode(this.userActiveKey, environment.SCOTBOT.PUBLIC_KEY, `#${this.userActiveKey}:${this.tokenSymbol}`);

            // Make sure we have a token
            if (encoded) {
                steem_keychain.requestSendToken(this.steemUsername, environment.SCOTBOT.FEE_ACCOUNT, environment.SCOTBOT.FEE_AMOUNT, encoded, 'ENG', (response) => {
                    if (response.success) {
                        this.showForm = false;

                        const toast = new ToastMessage();
    
                        toast.message = this.i18n.tr('initializeSuccess');
            
                        this.toast.success(toast);
                    }
                })
            }
        }
    }
}

ValidationRules
    .ensure('userActiveKey').required().withMessageKey('activeKey')
    .ensure('tokenSymbol').required().withMessageKey('tokenSymbol')
    .on(Initialize);
