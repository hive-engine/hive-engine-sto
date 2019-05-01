import { PLATFORM } from 'aurelia-pal';
import { RouterConfiguration, Router } from 'aurelia-router';

export class Account {
    private router: Router;

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Account';

        config.map([
            { route: ['', 'account'], name: 'launch', moduleId: PLATFORM.moduleName('./routes/account'), nav: true, title: 'Account' },
            { route: 'kyc', name: 'kyc', moduleId: PLATFORM.moduleName('./routes/kyc/landing'), title: 'KYC' },
            { route: 'profile', name: 'profile', moduleId: PLATFORM.moduleName('./routes/kyc/investor-questionnaire'), nav: true, title: 'Profile' },
            { route: 'kyc-questionnaire', name: 'kycQuestionnaire', moduleId: PLATFORM.moduleName('./routes/kyc/investor-questionnaire'), title: 'KYC Questionnaire' },
            { route: 'airdrop', name: 'airdrop', moduleId: PLATFORM.moduleName('./routes/airdrop/airdrop'), nav: true, title: 'Airdrop' },
        ]);

        this.router = router;
    }
}
