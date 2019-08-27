import { I18N } from 'aurelia-i18n';
import { HttpClient, json } from 'aurelia-fetch-client';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { autoinject, newInstance, lazy, observable } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ControllerValidateResult, ValidationRules } from 'aurelia-validation';
import { SteemEngine } from 'services/steem-engine';
import { environment } from 'environment';
import { ToastService, ToastMessage } from 'services/toast-service';

@autoinject()
export class ScotbotProofOfStake {
    private environment = environment;
    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;
    private interval;
    private formSubmitted = false;

    private tokenSymbol;
    private miningPoolSize;
    private steemUsername;
    private discordUsername;

    private total = 0;

    private http: HttpClient;
    private api: HttpClient;

    constructor(
        private controllerFactory: ValidationControllerFactory, 
        private se: SteemEngine,
        private toast: ToastService,
        private i18n: I18N, 
        @lazy(HttpClient) private getHttpClient: () => HttpClient) {
        this.controller = controllerFactory.createForCurrentScope();

        this.renderer = new BootstrapFormRenderer();

        this.controller.addRenderer(this.renderer);

        this.http = getHttpClient();
        this.api = getHttpClient();

        this.http.configure(config => {
            config
                .useStandardConfiguration();
        });

        this.api.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.NODE_API_URL);
        });
    }
    async sendFee() {
        const validator: ControllerValidateResult = await this.controller.validate();

        if (validator.valid) {
            try {
                await this.se.sendTokens('Proof of Stake Fee', [
                    { symbol: environment.NATIVE_TOKEN, to: environment.SPLIT_ACCOUNT_FEES.BEGGARS, quantity: '500.000', memo: 'ScotBot PoS 50% fee' },
                    { symbol: environment.NATIVE_TOKEN, to: environment.SPLIT_ACCOUNT_FEES.AGGROED, quantity: '250.000', memo: 'ScotBot PoS 25% fee' },
                    { symbol: environment.NATIVE_TOKEN, to: environment.SPLIT_ACCOUNT_FEES.SE_DEV, quantity: '250.000', memo: 'ScotBot PoS 25% fee' }
                ]);

                await this.api.fetch('scotbot-pos', {
                    method: 'POST',
                    body: json({
                        tokenSymbol: this.tokenSymbol,
                        miningPoolSize: this.miningPoolSize,
                        steemUsername: this.steemUsername,
                        discordUsername: this.discordUsername
                    })
                });

                const toast = new ToastMessage();
                toast.message = this.i18n.tr('feePaidSuccess');
                this.toast.success(toast);
    
                this.formSubmitted = true;    
            } catch (e) {
                const toast = new ToastMessage();
                toast.message = this.i18n.tr('feePaidError');
                this.toast.error(toast);
                return;
            }
        }
    }
}
