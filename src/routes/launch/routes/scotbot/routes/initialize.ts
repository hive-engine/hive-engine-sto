import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { SteemEngine } from 'services/steem-engine';
import { autoinject } from 'aurelia-dependency-injection';
import { ValidationControllerFactory, ValidationController, ValidationRules, ControllerValidateResult } from 'aurelia-validation';

const FEE_ACCOUNT = 'steemsc';
const FEE_ACCOUNT_PUBLIC_KEY = 'STM68QuR591BeretgKsf93Cjcr3nzSJejjoGsYNaTZZUoPAgyzWAZ';

import steem from 'steem';
import environment from 'environment';

@autoinject()
export class Initialize {
    private userActiveKey: string;
    private steemUsername = 'beggars';
    private tokenSymbol;
    private environment = environment;

    private balance;
    private tokens = [];

    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;

    constructor(private controllerFactory: ValidationControllerFactory, private se: SteemEngine) {
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
            const encoded = steem.memo.encode(this.userActiveKey, FEE_ACCOUNT_PUBLIC_KEY, `#${this.userActiveKey}:${this.tokenSymbol}`);

            // Make sure we have a token
            if (encoded) {
                steem_keychain.requestSendToken(this.steemUsername, FEE_ACCOUNT, '0.001', encoded, 'ENG', (response) => {
                    console.log(response);
                })
            }
        }
    }
}

ValidationRules
    .ensure('userActiveKey').required().withMessageKey('activeKey')
    .ensure('tokenSymbol').required().withMessageKey('tokenSymbol')
    .on(Initialize);
