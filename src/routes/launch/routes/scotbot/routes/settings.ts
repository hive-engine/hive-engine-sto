import { ToastMessage } from 'services/toast-service';
import { I18N } from 'aurelia-i18n';
import { ScotService } from 'services/scot-service';
import {
    ValidationController,
    ValidationControllerFactory,
    ValidationRules,
    ControllerValidateResult
} from 'aurelia-validation';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { SteemEngine } from 'services/steem-engine';
import { autoinject } from 'aurelia-framework';
import { environment } from 'environment';
import { DialogService } from 'aurelia-dialog';
import { ConfirmModal } from './confirm-modal';
import { ToastService } from 'services/toast-service';
import { NativeTokens } from 'common/types';

class SettingsModel implements ScotConfig {
    author_curve_exponent;
    author_reward_percentage;
    beneficiaries_account;
    beneficiaries_reward_percentage;
    cashout_window_days;
    curation_curve_exponent;
    downvote_power_consumption;
    downvote_regeneration_seconds;
    issue_token;
    json_metadata_app_value;
    json_metadata_key;
    json_metadata_value;
    promoted_post_account;
    reduction_every_n_block;
    reduction_percentage;
    rewards_token;
    rewards_token_every_n_block;
    token;
    token_account;
    vote_power_consumption;
    vote_regeneration_seconds;
    vote_window_days;
}

ValidationRules.ensure('author_curve_exponent')
    .required()
    .then()
    .satisfies(
        (value: any, object: any) =>
            parseFloat(value) >= 1 && parseFloat(value) <= 2
    )
    .withMessageKey('authorCurveExponent')
    .ensure('author_reward_percentage')
    .required()
    .then()
    .satisfies(
        (value: any, object: any) =>
            parseInt(value) >= 0 && parseInt(value) <= 100
    )
    .withMessageKey('authorRewardPercentage')
    .ensure('beneficiaries_reward_percentage')
    .required()
    .then()
    .satisfies(
        (value: any, object: any) =>
            parseInt(value) >= 0 && parseInt(value) <= 100
    )
    .withMessageKey('authorRewardPercentage')
    .ensure('cashout_window_days')
    .required()
    .then()
    .satisfies(
        (value: any, object: any) =>
            parseFloat(value) >= 0.1 && parseFloat(value) <= 365
    )
    .withMessageKey('cashoutWindowDays')
    .ensure('curation_curve_exponent')
    .required()
    .then()
    .satisfies(
        (value: any, object: any) =>
            parseFloat(value) >= 0.5 && parseFloat(value) <= 2
    )
    .withMessageKey('curationCurveExponent')
    .ensure('downvote_power_consumption')
    .required()
    .then()
    .satisfies(
        (value: any, object: any) =>
            parseInt(value) >= 1 && parseInt(value) <= 10000
    )
    .withMessageKey('downvotePowerConsumption')
    .ensure('downvote_regeneration_seconds')
    .required()
    .then()
    .satisfies((value: any, object: any) => parseInt(value) >= -1)
    .withMessageKey('downvoteRegenerationSeconds')
    .ensure('reduction_every_n_block')
    .required()
    .then()
    .satisfies((value: any, object: any) => parseFloat(value) > 0)
    .withMessageKey('reductionEveryNBlock')
    .ensure('reduction_percentage')
    .required()
    .then()
    .satisfies(
        (value: any, object: any) =>
            parseFloat(value) >= 1 && parseFloat(value) <= 100
    )
    .withMessageKey('reductionPercentage')
    .ensure('rewards_token')
    .required()
    .then()
    .satisfies((value: any, object: any) => parseFloat(value) > 0)
    .withMessageKey('rewardsToken')
    .ensure('rewards_token_every_n_block')
    .required()
    .then()
    .satisfies((value: any, object: any) => parseFloat(value) > 0)
    .withMessageKey('rewardsTokenEveryNBlock')
    .ensure('vote_power_consumption')
    .required()
    .then()
    .satisfies(
        (value: any, object: any) =>
            parseFloat(value) >= 1 && parseFloat(value) <= 10000
    )
    .withMessageKey('votePowerConsumption')
    .ensure('vote_window_days')
    .required()
    .then()
    .satisfies((value: any, object: any) => !isNaN(parseFloat(value)))
    .withMessageKey('voteWindowDays')
    .ensure('vote_regeneration_seconds')
    .required()
    .then()
    .satisfies((value: any, object: any) => parseInt(value) > 0)
    .withMessageKey('voteRegenerationSeconds')
    .ensure('json_metadata_value')
    .required()
    .then()
    .satisfies((value: any, object: any) => value !== 'scottest')
    .withMessageKey('jsonMetadataValue')
    .on(SettingsModel);

@autoinject()
export class Settings {
    public isReady = false;

    private controller: ValidationController;
    private renderer: BootstrapFormRenderer;

    loadedSettings: ScotConfig = new SettingsModel();
    settings: ScotConfig = new SettingsModel();

    private environment = environment;

    private balance;
    private tokens = [];
    private config;
    private info;
    private isLoading = false;

    private feeOnePaid = false;
    private feeTwoPaid = false;

    constructor(
        private controllerFactory: ValidationControllerFactory,
        private se: SteemEngine,
        private dialogService: DialogService,
        private scot: ScotService,
        private i18n: I18N,
        private toast: ToastService
    ) {
        this.controller = controllerFactory.createForCurrentScope();

        this.renderer = new BootstrapFormRenderer();

        this.controller.addRenderer(this.renderer);
    }

    async activate() {
        const user = localStorage.getItem('username');

        try {
            const balance = await this.se.loadBalances(
                user,
                environment.NATIVE_TOKEN
            );

            if (balance[0]) {
                this.balance = parseFloat(balance[0].balance).toFixed(3);
            }
        } catch {
            /* none */
        }

        this.tokens = await this.se.loadUserTokens(user);
    }

    async tokenChanged() {
        this.isLoading = true;

        const config = await this.scot.getConfig(this.settings.token);
        const info = await this.scot.getInfo(this.settings.token);

        this.info = info;
        this.settings = config;

        this.isLoading = false;
    }

    async saveSettings() {
        const user = localStorage.getItem('username');

        const validator: ControllerValidateResult = await this.controller.validate();

        const appValue: any = this.settings.json_metadata_app_value;

        // Is app value a string
        if (typeof appValue === 'string' || appValue instanceof String) {
            // Is it empty? Set the value to null
            if (appValue.trim() === '') {
                this.settings.json_metadata_app_value = null;
            }
        }

        if (validator.valid) {
            // If token hasn't been completely setup
            if (this.info.setup_complete !== 2) {
                // If we haven't paid the first fee, prompt the user
                if (!this.feeOnePaid && this.info.setup_complete !== 1) {
                    // Request the first part to be sent to Holger
                    steem_keychain.requestSendToken(
                        user,
                        environment.SCOTBOT.FEE_ACCOUNT_1,
                        environment.SCOTBOT.FEES.SETUP_1,
                        JSON.stringify(this.settings),
                        NativeTokens.Eng,
                        async response => {
                            if (response.success && !this.feeTwoPaid) {
                                this.feeOnePaid = true;

                                this.info = await this.scot.getInfo(
                                    this.settings.token
                                );

                                this.dialogService.open({
                                    viewModel: ConfirmModal,
                                    model: {
                                        settings: this.settings,
                                        vm: this
                                    }
                                });
                            }
                        }
                    );
                }
                // We've paid the first user, now pay the last fee
                else {
                    this.dialogService.open({
                        viewModel: ConfirmModal,
                        model: {
                            settings: this.settings,
                            vm: this
                        }
                    });
                }
            } else {
                steem_keychain.requestSendToken(
                    user,
                    environment.SCOTBOT.CHANGE_ACCOUNT,
                    environment.SCOTBOT.FEES.CHANGE,
                    JSON.stringify(this.settings),
                    NativeTokens.Eng,
                    response => {
                        if (response.success) {
                            const toast = new ToastMessage();

                            toast.message = this.i18n.tr('settingsSaved');

                            this.toast.success(toast);
                        }
                    }
                );
            }
        }
    }
}
