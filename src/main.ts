import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'bootstrap/dist/js/bootstrap.bundle';

import { Aurelia, LogManager } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';
import { PLATFORM } from 'aurelia-pal';
import { ValidationMessageProvider } from 'aurelia-validation';
import { I18N, TCustomAttribute } from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';

import Mousetrap from 'mousetrap';

import { initialState } from './store/state';
import { login, loading } from 'store/actions';
import store from 'store/store';

'!style-loader!css-loader!./styles/modal.css';

import { environment } from './environment';

LogManager.addAppender(new ConsoleAppender());

import { disableConnectQueue } from 'aurelia-binding';
disableConnectQueue();

Mousetrap.bind('ctrl+shift+f10', () => {
    console.debug('Enabling debug mode');
    LogManager.setLevel(LogManager.logLevel.debug);
});

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
            .useDefaults();
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

        instance.i18next
            .use(Backend)
            .use(LngDetector);

        return instance.setup({
            backend: {
                loadPath: 'locales/{{lng}}/{{ns}}.json'
            },
            detection: {
                order: ['localStorage', 'cookie', 'navigator'],
                lookupCookie: 'i18next',
                lookupLocalStorage: 'i18nextLng',
                caches: ['localStorage', 'cookie']
            },
            attributes: aliases,
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
        const translation = i18n.tr(propertyName.toString());
        return this.parser.parse(translation);
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
