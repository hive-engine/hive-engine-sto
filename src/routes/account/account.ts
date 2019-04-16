import { StoService } from './../../services/sto-service';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class Account {
    constructor(private stoService: StoService) {

    }

    activate() {
        const username = localStorage.getItem('username');

        if (username) {
            
        }
    }
}
