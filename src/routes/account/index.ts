import { PLATFORM } from 'aurelia-pal';
import { RouterConfiguration, Router } from 'aurelia-router';

export class Account {
    private router: Router;

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: ['', 'account'], name: 'launch', moduleId: PLATFORM.moduleName('./routes/account'), nav: false, title: 'Account' },
            { route: 'kyc', name: 'kyc', moduleId: PLATFORM.moduleName('./routes/accredited-investor/landing'), title: 'KYC' },
            { route: 'profile', name: 'profile', moduleId: PLATFORM.moduleName('./routes/accredited-investor/investor-questionnaire'), nav: false, title: 'Profile' },
            { route: 'kyc-questionnaire', name: 'kycQuestionnaire', moduleId: PLATFORM.moduleName('./routes/accredited-investor/investor-questionnaire'), title: 'KYC Questionnaire' }
        ]);

        this.router = router;
    }
}
