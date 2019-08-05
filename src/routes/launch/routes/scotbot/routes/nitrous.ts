import { I18N } from 'aurelia-i18n';
import { HttpClient, json } from 'aurelia-fetch-client';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { autoinject, newInstance, lazy } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationController, ControllerValidateResult, ValidationRules } from 'aurelia-validation';
import { SteemEngine } from 'services/steem-engine';
import { environment } from 'environment';
import { ToastService, ToastMessage } from 'services/toast-service';

@autoinject()
export class Nitrous {
    private environment = environment;
    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;
    private interval;
    private formSubmitted = false;

    private http: HttpClient;
    private api: HttpClient;

    private url: string;
    private logo: string;
    private email: string;
    private discordUsername: string;

    private ENG_FEE = '1000.000';

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
            window.steem_keychain.requestSendToken(localStorage.getItem('username'), environment.NITROUS.FEE_ACCOUNT, environment.NITROUS.FEE, 'Nitrous fee', environment.NITROUS.FEE_SYMBOL, async response => {
                if (response.success) {
                    try {
                        await this.api.fetch('customWebsite', {
                            method: 'POST',
                            body: json({
                                url: this.url,
                                logo: this.logo,
                                email: this.email,
                                discordUsername: this.discordUsername
                            })
                        });

                        const toast = new ToastMessage();
                        toast.message = this.i18n.tr('nitrousFeeSuccess');
                        this.toast.success(toast);
            
                        this.formSubmitted = true;
                    } catch (e) {
                        const toast = new ToastMessage();
                        toast.message = this.i18n.tr('nitrousFeeError');
                        this.toast.error(toast);
                        return;
                    }
                }
            });
        }
    }
}

ValidationRules
    .ensure('url').required().withMessageKey('cwUrl')
    .ensure('logo').required().withMessageKey('cwLogo')
    .ensure('email').required().withMessageKey('emailAddress')
    .ensure('discordUsername').required().withMessageKey('discordUsername')
    .on(Nitrous);
