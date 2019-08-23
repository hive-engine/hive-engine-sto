import { I18N } from 'aurelia-i18n';
import { HttpClient, json } from 'aurelia-fetch-client';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { autoinject, newInstance, lazy } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ControllerValidateResult, ValidationRules } from 'aurelia-validation';
import { SteemEngine } from 'services/steem-engine';
import { environment } from 'environment';
import { ToastService, ToastMessage } from 'services/toast-service';

@autoinject()
export class ScotPeak {
    private environment = environment;
    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;
    private interval;
    private formSubmitted = false;
    private email: string;
    private discordUsername: string;
    private steemUsername: string;

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
            window.steem_keychain.requestSendToken(localStorage.getItem('username'), environment.SCOTPEAK.FEE_ACCOUNT, environment.SCOTPEAK.FEE, 'ScotPeak fee', environment.SCOTPEAK.FEE_SYMBOL, async response => {
                if (response.success) {
                    try {
                        await this.api.fetch('scotpeak', {
                            method: 'POST',
                            body: json({
                                email: this.email,
                                discordUsername: this.discordUsername,
                                steemUsername: this.steemUsername
                            })
                        });

                        const toast = new ToastMessage();
                        toast.message = this.i18n.tr('scotPeakSuccess');
                        this.toast.success(toast);
            
                        this.formSubmitted = true;
                    } catch (e) {
                        const toast = new ToastMessage();
                        toast.message = this.i18n.tr('scotPeakError');
                        this.toast.error(toast);
                        return;
                    }
                }
            });
        }
    }
}

ValidationRules
    .ensure('email').required().withMessageKey('email')
    .ensure('discordUsername').required().withMessageKey('discordUsername')
    .ensure('steemUsername').required().withMessageKey('steemUsername')
    .on(ScotPeak);
