import { AuthorizeStep } from './resources/pipeline-steps/authorize';
import { MaintenanceStep } from './resources/pipeline-steps/maintenance';
import { State } from 'store/state';
import { Store, connectTo, } from 'aurelia-store';

import { PreRenderStep } from './resources/pipeline-steps/prerender';
import { PostRenderStep } from './resources/pipeline-steps/postrender';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './styles/site-main.css';
import './styles/main.css';

import { PLATFORM } from 'aurelia-pal';
import { autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration, activationStrategy } from 'aurelia-router';

import environment from 'environment';

import 'store/store';
import { loadSteemPrice } from 'store/actions';
import { Subscription } from 'rxjs';

@autoinject()
@connectTo()
export class App {
    public router: Router;
    private year = new Date().getFullYear();
    private state: State;
    private subscription: Subscription;

    constructor(private store: Store<State>) {
        this.subscription = this.store.state.subscribe((state) => {
          if (state) {
            this.state = state;
    
            AuthorizeStep.loggedIn = state.user.loggedIn;
          }
        });
      }

    // bind() {
    //     this.stateSubscription = this.store.state.pipe(pluck('steemPrice')).subscribe(price => {
    //         if (price) {
    //             window.steem_price = price;
    //         }
    //     });
    // }

    // unbind() {
    //     if (this.stateSubscription) {
    //         this.stateSubscription.unsubscribe();
    //     }
    // }

    public configureRouter(config: RouterConfiguration, router: Router) {
        config.title = environment.siteName;

        config.addPipelineStep('authorize', MaintenanceStep);
        config.addPipelineStep('authorize', AuthorizeStep);
        config.addPipelineStep('preRender', PreRenderStep);
        config.addPipelineStep('postRender', PostRenderStep);

        config.map([
            {
                route: ['', 'home'],
                name: 'home',
                moduleId: PLATFORM.moduleName('./routes/home'),
                nav: false,
                title: 'Home'
            },
            {
                route: 'maintenance',
                name: 'maintenance',
                moduleId: PLATFORM.moduleName('./routes/maintenance'),
                nav: false,
                title: 'Maintenance'
            },
            {
                route: 'projects/:project?',
                name: 'projects',
                moduleId: PLATFORM.moduleName('./routes/projects/projects'),
                nav: false,
                activationStrategy: activationStrategy.invokeLifecycle,
                href: '/projects',
                title: 'Projects'
            },
            {
                route: 'sign-in',
                name: 'signin',
                moduleId: PLATFORM.moduleName('./routes/sign-in'),
                nav: false,
                title: 'Signin'
            },
            {
                route: 'launch',
                name: 'launch',
                moduleId: PLATFORM.moduleName('./routes/launch/launch'),
                nav: true,
                title: 'Launch'
            },
            {
                route: 'state-costs',
                name: 'stateCosts',
                moduleId: PLATFORM.moduleName('./routes/launch/state-costs'),
                nav: false,
                title: 'State Costs'
            },
            {
                route: 'pricing-enquire',
                name: 'pricingEnquire',
                moduleId: PLATFORM.moduleName('./routes/pricing-enquire'),
                nav: false,
                title: 'Pricing Enquire'
            },
            // {
            //     route: 'account',
            //     name: 'account',
            //     moduleId: PLATFORM.moduleName('./routes/account/account'),
            //     nav: true,
            //     auth: true,
            //     title: 'Account'
            // },
            {
                route: 'account/kyc',
                name: 'accountKyc',
                moduleId: PLATFORM.moduleName('./routes/account/kyc/landing'),
                nav: false,
                title: 'Kyc'
            },
            {
                route: 'account/profile',
                name: 'accountProfile',
                moduleId: PLATFORM.moduleName('./routes/account/kyc/investor-questionnaire'),
                nav: false,
                title: 'Account Profile'
            },
            {
                route: 'account/kyc-questionnaire',
                name: 'accountKycQuestionnaire',
                moduleId: PLATFORM.moduleName('./routes/account/kyc/investor-questionnaire'),
                nav: false,
                title: 'Investor Questionnaire'
            },
            {
                route: 'account/airdrop',
                name: 'accountAirdrop',
                moduleId: PLATFORM.moduleName('./routes/account/airdrop/airdrop'),
                nav: false,
                auth: true,
                title: 'Airdrop'
            }
        ]);

        this.router = router;
    }

    attached() {
        this.store.dispatch(loadSteemPrice);
    }
}
