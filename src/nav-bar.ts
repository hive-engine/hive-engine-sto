import { logout } from 'store/actions';
import { dispatchify } from 'aurelia-store';
import { customElement, bindable } from 'aurelia-framework';

@customElement('nav-bar')
export class NavBar {
    @bindable router;
    @bindable user;

    login() {
        this.router.navigateToRoute('signin');
    }

    logout() {
        dispatchify(logout)();
        this.router.navigateToRoute('home');
    }
}
