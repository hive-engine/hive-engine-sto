import { PLATFORM } from 'aurelia-pal';
import { RouterConfiguration, Router } from 'aurelia-router';

export class Launch {
    private router: Router;

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Launch';

        config.map([
            { route: ['', 'launch'], name: 'launch', moduleId: PLATFORM.moduleName('./routes/launch'), nav: true, title: 'Launch' },
            { route: 'scotbot', name: 'scotbot', moduleId: PLATFORM.moduleName('./routes/scotbot/index'), nav: true, title: 'Scotbot' },
            { route: 'state-costs', name: 'stateCosts', moduleId: PLATFORM.moduleName('./routes/state-costs'), nav: false, title: 'State Costs' },
        ]);

        this.router = router;
    }
}
