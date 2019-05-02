import { PLATFORM } from 'aurelia-pal';
import { RouterConfiguration, Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class ScotBot {
    private router: Router;
    private subscription;

    constructor(private ea: EventAggregator) {

    }

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.map([
            { 
                route: ['', 'initialize'], 
                name: 'initialize', 
                moduleId: PLATFORM.moduleName('./routes/initialize'), 
                nav: true, 
                title: 'Initialize' 
            },
            { 
                route: 'settings', 
                name: 'settings', 
                moduleId: PLATFORM.moduleName('./routes/settings'), 
                nav: true, 
                title: 'Settings' 
            },
            { 
                route: 'custom-website', 
                name: 'customWebsite', 
                moduleId: PLATFORM.moduleName('./routes/custom-website'), 
                nav: true, 
                title: 'Custom Website' 
            },
        ]);

        this.router = router;
    }

    activate() {
        this.subscription = this.ea.subscribe('router:navigation:complete', () => {
            if (this.router.parent) {
                const routes = this.router.navigation.map(n => n);
                
                (this.router.parent.navigation as any).navigation = [  ...routes ];
            }
        });
    }

    canDeactivate() {
        (this.router.parent.navigation as any).navigation = null;
        this.subscription.dispose();
    }
}
