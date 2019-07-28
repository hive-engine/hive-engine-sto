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
                route: 'nitrous', 
                name: 'nitrous', 
                moduleId: PLATFORM.moduleName('./routes/nitrous'), 
                nav: true, 
                title: 'Nitrous' 
            },
        ]);

        this.router = router;
    }

    activate() {
        this.subscription = this.ea.subscribe('router:navigation:complete', () => {
            if (this.router.parent) {
                const routes = this.router.navigation.map(n => {
                    n.href = n.href.replace('launchscotbot', 'launch/scotbot');
                    return n;
                });
                
                (this.router.parent.navigation as any).navigation = routes;
            }
        });
    }

    deactivate() {
        (this.router.parent.navigation as any).navigation = null;
        this.subscription.dispose();
    }
}
