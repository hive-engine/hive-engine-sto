import { ScotService } from './../../../../../services/scot-service';
import { ValidationController, ValidationControllerFactory, ValidationRules, ControllerValidateResult } from "aurelia-validation";
import { BootstrapFormRenderer } from "resources/bootstrap-form-renderer";
import { SteemEngine } from "services/steem-engine";
import { autoinject } from "aurelia-framework";
import environment from "environment";
import { difference } from 'common/functions';
import { DialogService } from 'aurelia-dialog';
import { ConfirmModal } from './confirm-modal';

class SettingsModel implements ScotConfig {
    author_curve_exponent;
    author_reward_percentage;
    cashout_window_days;
    curation_curve_exponent;
    downvote_power_consumption;
    downvote_regeneration_seconds;
    issue_token;
    json_metadata_key;
    json_metadata_value;
    reduction_every_n_block;
    reduction_percentage;
    rewards_token;
    rewards_token_every_n_block;
    token;
    token_account;
    vote_power_consumption;
    vote_regeneration_seconds;
}

ValidationRules
    .ensure('author_curve_exponent')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value >= 1 && value <= 2))
        .withMessageKey('authorCurveExponent')
    .ensure('author_reward_percentage')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value >= 0 && value <= 100))
        .withMessageKey('authorRewardPercentage')
    .ensure('cashout_window_days')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value >= 0.1 && value <= 365))
        .withMessageKey('cashoutWindowDays')
    .ensure('curation_curve_exponent')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value >= 0.5 && value <= 2))
        .withMessageKey('curationCurveExponent')
    .ensure('downvote_power_consumption')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value >= 1 && value <= 10000))
        .withMessageKey('downvotePowerConsumption')
    .ensure('downvote_regeneration_seconds')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value >= -1))
        .withMessageKey('downvoteRegenerationSeconds')
    .ensure('reduction_every_n_block')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value > 0))
        .withMessageKey('reductionEveryNBlock')
    .ensure('reduction_percentage')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value >= 1 && value <= 100))
        .withMessageKey('reductionPercentage')
    .ensure('rewards_token')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value > 0))
        .withMessageKey('rewardsToken')
    .ensure('rewards_token_every_n_block')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value > 0))
        .withMessageKey('rewardsTokenEveryNBlock')
    .ensure('vote_power_consumption')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value >= 1 && value <= 10000))
        .withMessageKey('votePowerConsumption')
    .ensure('vote_regeneration_seconds')
        .required()
        .then()
        .satisfies((value: any, object: any) => (value > 0))
        .withMessageKey('voteRegenerationSeconds')
    .on(SettingsModel);

@autoinject()
export class Settings {
    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;

    loadedSettings: ScotConfig = new SettingsModel();
    settings: ScotConfig = new SettingsModel();

    private environment = environment;

    private balance;
    private tokens = [];
    private config;

    constructor(
        private controllerFactory: ValidationControllerFactory, 
        private se: SteemEngine,
        private dialogService: DialogService,
        private scot: ScotService) {
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

    async tokenChanged() {
        const config = await this.scot.getConfig('SCOTT');

        this.loadedSettings = { ...config };
        this.settings = { ...config };
    }

    async saveSettings() {
        const user = localStorage.getItem('username');
        
        const validator: ControllerValidateResult = await this.controller.validate();
        
        if (validator.valid) {
            const settings = difference(this.settings, this.loadedSettings);

            // Request the first part to be sent to Holger
            steem_keychain.requestSendToken(
                user, 
                environment.SCOTBOT.FEE_ACCOUNT_1, 
                environment.SCOTBOT.FEES.SETUP_1, 
                JSON.stringify(settings), 
                'ENG', (response) => {
                    if (response.success) {
                        this.dialogService.open({ viewModel: ConfirmModal, model: {difference, settings: this.settings} });
                    }
                });
        }
    }
}
