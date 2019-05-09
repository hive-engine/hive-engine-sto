import '@babel/polyfill';
import 'bootstrap/dist/js/bootstrap.bundle';

import { Aurelia, LogManager } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';
import { PLATFORM } from 'aurelia-pal';

import { I18N, TCustomAttribute } from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';

import { initialState } from './store/state';
import { login, loading } from 'store/actions';
import store from 'store/store';

import modalCss from './styles/modal.css';

import environment from './environment';

LogManager.addAppender(new ConsoleAppender());
export async function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature(PLATFORM.moduleName('components/index'))
        .feature(PLATFORM.moduleName('resources/index'));

    if (environment.debug) {
        LogManager.setLevel(LogManager.logLevel.debug);
    }

    if (environment.testing) {
        aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
    }

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'));
    aurelia.use.plugin(PLATFORM.moduleName('ag-grid-aurelia'));
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
        config
            .useDefaults()
            .useCSS(modalCss)
    });

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-store', 'store'), {
        initialState: initialState,
        history: {
            undoable: false,
            limit: 10
        }
    });

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), instance => {
        let aliases = ['t', 'i18n'];
        TCustomAttribute.configureAliases(aliases);

        instance.i18next.use(Backend);

        return instance.setup({
            backend: {
                loadPath: 'locales/{{lng}}/{{ns}}.json'
            },
            attributes: aliases,
            lng: environment.defaultLocale,
            ns: ['translation', 'buttons', 'errors'],
            defaultNS: 'translation',
            fallbackLng: 'en',
            debug: false
        });
    });

    ValidationMessageProvider.prototype.getMessage = function(key) {
        const i18n = aurelia.container.get(I18N);
        const translation = i18n.tr(`errors:${key}`);
        return this.parser.parse(translation);
    }

    ValidationMessageProvider.prototype.getDisplayName = function(propertyName, displayName) {
        if (displayName !== null && displayName !== undefined) {
          return displayName;
        }

        const i18n = aurelia.container.get(I18N);
        return i18n.tr(propertyName);
    };

    await aurelia.start();

    if (PLATFORM.global.localStorage) {
        if (!PLATFORM.global.localStorage.getItem('steem-engine__state')) {
            PLATFORM.global.localStorage.setItem('steem-engine__state', JSON.stringify(initialState));
        }
    }

    await store.dispatch('Rehydrate', 'steem-engine__state');
    //await store.dispatch(loadTokens);
    await store.dispatch(loading, false);

    if (PLATFORM.global.localStorage) {
        if (PLATFORM.global.localStorage.getItem('se_access_token')) {
            const username = PLATFORM.global.localStorage.getItem('username');
            const accessToken = PLATFORM.global.localStorage.getItem('se_access_token');
            const refreshToken = PLATFORM.global.localStorage.getItem('se_refresh_token');

            await store.dispatch(login, {
                username,
                accessToken,
                refreshToken
            });
        }
    }
    
    await aurelia.setRoot(PLATFORM.moduleName('app'));
}
