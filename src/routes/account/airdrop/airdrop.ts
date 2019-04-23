import { SteemEngine } from 'services/steem-engine';
import { autoinject } from 'aurelia-framework';

import steem from 'steem';

import Papa from 'papaparse';

const STEEM_ENGINE_OP_ID = 'ssc-mainnet1';
const MAX_PAYLOAD_SIZE = 8192;

@autoinject()
export class Airdrop {
    private hasPaidEngFee = false;
    private usersToAirDrop = [];
    private usersNotExisting = [];
    private userConfirmationInProgress = false;
    private airdropInProgress = false;
    private airdropComplete = false;
    private completed: number = 0;
    private fileInput: HTMLInputElement;
    private memoText: string;
    private tokenSymbol: string;
    private symbolPrecision: string;
    private activeKey: string = '5K6K3Sy39Psr79bGXcxYQMuzXVn6nbYLonXvHLX5PepLEkUDMau';
    private step = 1;
        
    private currentUser: string;
    private currentAmount: number;

    private airdropPercentage = 0;


    constructor(private se: SteemEngine) {

    }

    async uploadCsv() {
        try {
            const results = await parseCsv(this.fileInput.files[0]) as any;

            if (results.data) {
                this.usersToAirDrop = results.data;

                this.userConfirmationInProgress = true;

                await forEach(this.usersToAirDrop, async (user, index) => {
                    const username = user[0].replace('@', '');

                    const res = await steem.api.getAccountsAsync([username]);

                    // User doesn't exist
                    if (!res.length) {
                        this.usersNotExisting.push(username);
                        this.usersToAirDrop.splice(index, 1);
                    }
                });

                this.userConfirmationInProgress = false;

                // All users exist
                if (!this.usersNotExisting.length) {
                    this.step = 2;
                }
            
            }
        } catch (e) {
            console.error(e);
        }
    }

    payFee() {
        // User hasn't already paid a fee
        if (!this.hasPaidEngFee) {
            steem_keychain.requestSendToken(localStorage.getItem('username'), 'steem-eng', '0.001', 'airdrop-fee', 'ENG', response => {
                if (response.success) {
                    this.hasPaidEngFee = true;
                    this.step = 4;

                    localStorage.setItem('airdrop_transaction_id', response.result.id);
                }
            });
        }
    }

    async runAirdrop() {
        this.completed = 0;
        this.airdropInProgress = true;

        for (const user of this.usersToAirDrop) {
            const username = user[0].replace('@', '');
            const quantity = parseFloat(user[1].replace(',', '.'));

            this.currentUser = username;
            this.currentAmount = quantity;

            const payload = {
                'contractName':'tokens',
                'contractAction':'issue',
                'contractPayload': {
                    'symbol': `${this.tokenSymbol.toUpperCase()}`,
                    'to': `${username}`,
                    'quantity': `${quantity}`,
                    'memo': this.memoText
                }
            };

            const required_auths = [localStorage.getItem('username')];
            const required_posting_auths = [];

            await steem.broadcast.customJsonAsync(this.activeKey, required_auths, required_posting_auths, STEEM_ENGINE_OP_ID, JSON.stringify(payload));
            
            this.completed++;
            this.airdropPercentage = Math.round((this.completed / this.usersToAirDrop.length) * 100);

            if (this.completed !== (this.usersToAirDrop.length) && this.completed !== 0) {
                await sleep(3000);
            } else {
                this.airdropInProgress = false;
                this.airdropComplete = true;
                this.airdropPercentage = 100;
            }
        }
    }
}

async function forEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function parseCsv(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: results => {
                resolve(results);
            },
            error: err => {
                reject(err);
            }
        });
    });
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
