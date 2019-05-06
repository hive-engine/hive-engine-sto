import { ValidationController, ValidationControllerFactory } from "aurelia-validation";
import { BootstrapFormRenderer } from "resources/bootstrap-form-renderer";
import { SteemEngine } from "services/steem-engine";
import { autoinject } from "aurelia-framework";
import environment from "environment";
@autoinject()
export class Settings {
    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;

    settings: ScotConfig;

    private environment = environment;

    private balance;
    private tokens = [];

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

    saveSettings() {
        
    }
}
