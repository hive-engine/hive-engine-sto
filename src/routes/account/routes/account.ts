import { StoService } from '../../../services/sto-service';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class Account {
    private username;
    
    constructor(private stoService: StoService) {

    }

    activate() {
        const username = localStorage.getItem('username');

        if (username) {
            this.username = username;
        }
    }
}
