import { I18N } from 'aurelia-i18n';
import { HttpClient, json } from 'aurelia-fetch-client';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { autoinject, newInstance, lazy, observable } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ControllerValidateResult, ValidationRules } from 'aurelia-validation';
import { SteemEngine } from 'services/steem-engine';
import { environment } from 'environment';
import { ToastService, ToastMessage } from 'services/toast-service';

@autoinject()
export class Votebot {
    private environment = environment;
    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;
    private interval;
    private formSubmitted = false;

    private tokenAction;
    private toAccount = ''; // If tokenAction === 1
    private steemUsername;

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
            window.steem_keychain.requestSendToken(localStorage.getItem('username'), environment.SCOTTUBE.FEE_ACCOUNT, environment.SCOTTUBE.FEE, 'Votebot fee', environment.SCOTTUBE.FEE_SYMBOL, async response => {
                if (response.success) {
                    try {
                        await this.api.fetch('votebot', {
                            method: 'POST',
                            body: json({
                                tokenAction: this.tokenAction,
                                toAccount: this.toAccount,
                                steemUsername: this.steemUsername
                            })
                        });

                        const toast = new ToastMessage();
                        toast.message = this.i18n.tr('votebotSuccess');
                        this.toast.success(toast);
            
                        this.formSubmitted = true;
                    } catch (e) {
                        const toast = new ToastMessage();
                        toast.message = this.i18n.tr('votebotError');
                        this.toast.error(toast);
                        return;
                    }
                }
            });
        }
    }
}

ValidationRules
    .ensure('tokenAction').required().withMessageKey('tokenAction')
    .ensure('steemUsername').required().withMessageKey('steemUsername')
    .on(Votebot);