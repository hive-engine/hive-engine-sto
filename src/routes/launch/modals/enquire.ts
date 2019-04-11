import { PLATFORM } from 'aurelia-pal';
import { BootstrapFormRenderer } from './../../../resources/bootstrap-form-renderer';
import { DialogController } from 'aurelia-dialog';
import { autoinject, lazy, newInstance, useView } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import environment from 'environment';
import { ValidationController, ValidationRules } from 'aurelia-validation';

@useView(PLATFORM.moduleName('./enquire.html'))
@autoinject()
export class EnquireModal {
    private http;
    private item;
    private renderer: BootstrapFormRenderer;
    private formSubmitted = false;

    private fields = {
        name: '',
        email: '',
        packageName: '',
        steemHandle: '',
        discordHandle: '',
        telegramHandle: '',
        skypeHandle: '',
        phone: '',
        otherComments: '',
        preferredCommunication: ''
    };

    private rules = ValidationRules
        .ensure('name').required().withMessageKey('name')
        .ensure('email').email().required().withMessageKey('emailAddress')
        .ensure('preferredCommunication').required().withMessageKey('contactMethod')
        .rules;

    constructor(
        private controller: DialogController,
        @newInstance() private validationController: ValidationController, 
        @lazy(HttpClient) private getHttpClient: () => HttpClient) {
        this.http = getHttpClient();

        this.http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.NODE_API_URL);
        });

        this.controller.settings.lock = false;
        this.controller.settings.centerHorizontalOnly = true;

        this.renderer = new BootstrapFormRenderer();
        this.validationController.addRenderer(this.renderer);

        this.validationController.addObject(this.fields, this.rules);
    }

    async activate(item) {
        this.item = item;
    }

    async send() {
        this.fields.packageName = this.item.name;

        const result = await this.validationController.validate();

        if (!result.valid) {
            return;
        }

        try {
            await this.http.fetch('launchContact', {
                method: 'POST',
                body: json(this.fields)
            });

            this.formSubmitted = true;
        } catch (e) {
            return;
        }
    }
}
