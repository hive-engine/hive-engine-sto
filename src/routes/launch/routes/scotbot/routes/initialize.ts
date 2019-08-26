import { NativeTokens } from 'common/types';
import { log } from 'services/log-service';
import { SecurityModal } from './security-modal';
import { DialogService } from 'aurelia-dialog';
import { ScotService } from 'services/scot-service';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { SteemEngine } from 'services/steem-engine';
import { autoinject } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationController, ValidationRules, ControllerValidateResult } from 'aurelia-validation';
import { ToastMessage, ToastService } from 'services/toast-service';

import steem from 'steem';
import { environment } from 'environment';
import { I18N } from 'aurelia-i18n';

@autoinject()
export class Initialize {
    private userActiveKey: string;
    private tokenSymbol: string;
    private email: string;
    
    private environment = environment;
    private showForm = true;
    private info;

    private balance;
    private tokens = [];

    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;

    constructor(
        private controllerFactory: ValidationControllerFactory, 
        private se: SteemEngine,
        private scot: ScotService,
        private i18n: I18N,
        private toast: ToastService,
        private dialogService: DialogService) {
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

    async tokenSelected() {
        const info = await this.scot.getInfo(this.tokenSymbol);

        this.info = info;

        // Do we have a info object and is the setup completed
        if (Object.keys(info).length && info.setup_complete !== -1) {
            this.showForm = false;
        }
    }

    async multipleTransfer() {
        const transfers = [
            { symbol: environment.NATIVE_TOKEN, to: 'steemsc', quantity: '700.00', memo: 'pools-fee:BEGGARS' },
            { symbol: environment.NATIVE_TOKEN, to: 'holger80', quantity: '200.00', memo: 'pools-fee:BEGGARS' },
            { symbol: environment.NATIVE_TOKEN, to: 'beggars', quantity: '100.00', memo: 'pools-fee:BEGGARS' }
        ];

        this.se.sendTokens('Initialize Fee', transfers);
    }

    async sendInitialEngFeeWithKey() {
        log.debug(`Send initial ENG fee of ${environment.SCOTBOT.FEES.INITIAL} ENG`);

        if (typeof steem_keychain === 'undefined') {
            log.error(`Steem Keychain extension not detected`);
            window.alert('Please install the Steem Keychain to enable Scotbot (or use a desktop computer if you are on a mobile device)');
            return;
        }

        const validator: ControllerValidateResult = await this.controller.validate();

        // Validator result is valid
        if (validator.valid) {
            const user = localStorage.getItem('username');

            log.debug(`Validator valid and current user: ${user}`);

            const memoSettings = {
                activeKey: this.userActiveKey,
                symbol: this.tokenSymbol,
                account: user,
                email: this.email
            };

            log.debug(`About to encode memo with: `, memoSettings);

            // Firstly, we want to encode the active key and selected token
            const encoded = steem.memo.encode(this.userActiveKey, 
                environment.SCOTBOT.PUBLIC_KEY, `#${this.userActiveKey}:${this.tokenSymbol}:${user}`);

            log.debug(`Encoded memo method run with public key: ${encoded}`);

            // Make sure we have a token
            if (encoded) {
                log.debug(`We have an encoded memo`);

                steem_keychain.requestSendToken(user, environment.SCOTBOT.FEE_ACCOUNT, 
                    environment.SCOTBOT.FEES.INITIAL, encoded, NativeTokens.Eng, (response) => {
                    if (response.success) {
                        log.debug(`User has paid first 500 ENG fee`);

                        this.showForm = false;

                        const toast = new ToastMessage();
                        toast.message = this.i18n.tr('initializeSuccess');
                        this.toast.success(toast);
                    } else {
                        log.error(`${response.message}`);

                        const toast = new ToastMessage();
                        toast.message = this.i18n.tr('initializeError');
                        this.toast.error(toast);
                    }
                })
            }
        }
    }

    showSecurityModal() {
        this.dialogService.open({ 
            viewModel: SecurityModal
        });
    }
}

ValidationRules
    .ensure('userActiveKey').required().withMessageKey('activeKey')
    .ensure('tokenSymbol').required().withMessageKey('tokenSymbol')
    .on(Initialize);
