import { log } from './../../../services/log-service';
import { StoService } from '../../../services/sto-service';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class Account {
    private hasCompletedKyc = false;
    private username;
    
    constructor(private stoService: StoService) {

    }

    async activate() {
        const username = localStorage.getItem('username');

        if (username) {
            this.username = username;

            try {
                const kyc = await this.stoService.kycStatus(username);
            } catch (e) {
                log.error(e);
            }
        }
    }
}
