import { PLATFORM } from 'aurelia-pal';
import { RouterConfiguration, Router } from 'aurelia-router';

export class Launch {
    private router: Router;

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { route: ['', 'launch'], name: 'launch', moduleId: PLATFORM.moduleName('./routes/launch'), nav: true, title: 'Home' },
            // { route: 'airdrop', name: 'airdrop', moduleId: PLATFORM.moduleName('./routes/airdrop/airdrop'), nav: false, title: 'Airdrop' },
            { route: 'scotbot', name: 'scotbot', moduleId: PLATFORM.moduleName('./routes/scotbot/index'), nav: true, title: 'Scotbot' },
            { route: 'state-costs', name: 'stateCosts', moduleId: PLATFORM.moduleName('./routes/state-costs'), nav: false, title: 'State Costs' },
        ]);

        this.router = router;
    }
}
