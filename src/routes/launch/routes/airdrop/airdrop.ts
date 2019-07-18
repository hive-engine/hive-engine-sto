import { Subscription } from 'rxjs';
import { AirDropMode } from './../../../../store/state';
import { Store, connectTo } from 'aurelia-store';
import { BootstrapFormRenderer } from 'resources/bootstrap-form-renderer';
import { SteemEngine } from 'services/steem-engine';
import { autoinject, computedFrom, TaskQueue, reset } from 'aurelia-framework';

import Papa from 'papaparse';
import { ValidationController, ValidationControllerFactory, ValidationRules } from 'aurelia-validation';
import { environment } from 'environment';
import { State } from 'store/state';

import { Client, PrivateKey, Operation } from 'dsteem';

const STEEM_ENGINE_OP_ID = 'ssc-mainnet1';
const MAX_PAYLOAD_SIZE = 8192;
const MAX_ACCOUNTS_CHECK = 500;

const STEEM_ENDPOINTS = [
    {
        id: 1,
        url: 'https://anyx.io',
        maxPayloadSize: 8192,
        maxAccountsCheck: 500,
        instance: null as Client,
        disabled: false
    },
    {
        id: 2,
        url: 'https://api.steemit.com',
        maxPayloadSize: 2000,
        maxAccountsCheck: 999,
        instance: null as Client,
        disabled: false
    }
];

const clients = STEEM_ENDPOINTS.map(node => {
    node.instance = new Client(node.url, { timeout: 1000 });

    return node;
});

function getClient() { 
    const client = clients.find(c => !c.disabled);
    return client;
}

async function customJson(account: string, key: string, id: string, json: any, useActive: boolean, retries: number = 0) {
	const data = {
		id: id, 
		json: JSON.stringify(json),
		required_auths: useActive ? [account] : [],
		required_posting_auths: useActive ? [] : [account]
    };

    try {
        return await getClient().instance.broadcast.json(data, PrivateKey.fromString(key));
    } catch (e) {
        console.error(`Error broadcasting custom JSON operation. Error: ${e}`);
        
        if (retries < 3) {
            return await customJson(account, key, id, json, useActive, retries + 1);
        } else {
            console.error('Error broadcasting custom JSON after 3 failed attempts.');
        }
    }
}

function updateAirdropStateAction(state: State, obj: any): State {
    const newState = { ...state };

    newState.airdrop = { ...newState.airdrop, ...obj };

    return newState;
}

function resetAirdropStateAction(state: State): State {
    const newState = { ...state };

    newState.airdrop = {
        currentStep: 1,
        completed: 0,
        percentage: 0,
        usersToAirdrop: [],
        usersNotExisting: [],
        airdropCompletion: 0,
        totalInPayload: 0,
        currentToken: null,
        airdropFee: '0.00',
        payloads: [[]],
        feeTransactionId: '',
        details: {
            token: '',
            activeKey: '',
            memoText: '',
            mode: AirDropMode.issue
        }
    };

    return newState;
}

@autoinject()
export class Airdrop {
    public usersToAirDrop = [];
    public usersNotExisting = [];
    public userConfirmationInProgress = false;
    public airdropInProgress = false;
    public airdropComplete = false;
    public completed: number = 0;
    public errors = [];
    public fileInput: HTMLInputElement;
    public memoText: string;
    public tokenSymbol: string;
    public activeKey: string = '';
    public accountName: string = '';
    public step = 1;
    public payloads = [[]];
    public payloadsSize = 0;
    public totalInPayload: any = 0.00;
    public airdropFee = '0';
    public airdropMode: AirDropMode = AirDropMode.transfer;
        
    public currentUser: string;
    public currentAmount: number;

    public tokenExists = true;
    public tokenValidationInProgress = false;
    public currentToken;
    private feeTransactionId;

    public airdropPercentage = 0;
    public controller: ValidationController;
    public renderer;

    public uploadMode = 'file';
    public manualCsv;

    public state: State;
    public subscription: Subscription;

    private csvExample = `@inertia,56
@aggroed,21
@yabapmatt,69
@beggars,100
@fdskjflk,232`;

    constructor(private controllerFactory: ValidationControllerFactory, private se: SteemEngine, private store: Store<State>, private taskQueue: TaskQueue) {
        this.controller = controllerFactory.createForCurrentScope();

        this.renderer = new BootstrapFormRenderer();

        this.controller.addRenderer(this.renderer);
    }  
    
    bind() {
        this.subscription = this.store.state.subscribe((state: State) => {
            this.state = state;

            this.payloads = state.airdrop.payloads;
            this.airdropFee = state.airdrop.airdropFee;
            this.airdropPercentage = state.airdrop.percentage;
            this.completed = state.airdrop.completed;
            this.usersNotExisting = state.airdrop.usersNotExisting;
            this.usersToAirDrop = state.airdrop.usersToAirdrop;
            this.currentToken = state.airdrop.currentToken;
            this.activeKey = state.airdrop.details.activeKey;
            this.memoText = state.airdrop.details.memoText;
            this.tokenSymbol = state.airdrop.details.token;
            this.airdropMode = state.airdrop.details.mode;
            this.feeTransactionId = state.airdrop.feeTransactionId;

            if (state.airdrop.currentStep === 4 && !this.airdropInProgress) {
                this.taskQueue.queueTask(() => {
                    this.runAirdrop();
                });
            }

            if (state.user.loggedIn) {
                this.accountName = state.user.name;
            }
        });
    }

    unbind() {
        this.subscription.unsubscribe();
    }

    attached() {
        this.store.registerAction('updateAirdropStateAction', updateAirdropStateAction);
        this.store.registerAction('resetAirdropStateAction', resetAirdropStateAction);

        this.taskQueue.queueMicroTask(() => {
            this.payloadsSize = this.payloads.length;
        });
    }

    async goToStep(step: number) {
        const result = await this.controller.validate();

        if (result.valid) {
            if (step === 3) {
                try {
                    this.tokenValidationInProgress = true;
                    
                    const token = await this.se.findToken(this.tokenSymbol);

                    if (token) {
                        this.tokenExists = true;

                        this.store.dispatch(updateAirdropStateAction, { 
                            currentToken: token,
                            details: {
                                token: this.tokenSymbol,
                                activeKey: this.activeKey,
                                memoText: this.memoText,
                                mode: this.airdropMode
                            }
                        });
                    } else {
                        this.tokenExists = false;
                        return;
                    }
                } finally {
                    this.tokenValidationInProgress = false;
                }
            }

            this.store.dispatch(updateAirdropStateAction, { currentStep: step });
        }
    }

    async uploadCsv() {
        try {
            const results = this.uploadMode === 'file' ? 
                await parseCsv(this.fileInput.files[0]) as any : await parseCsv(this.manualCsv) as any;

            // We have parsed the CSV
            if (results.data) {
                this.usersToAirDrop = results.data;

                this.userConfirmationInProgress = true;

                let users = [[]];

                // Loop over the users to airdrop and build an array of payloads
                this.usersToAirDrop.forEach(user => {
                    const username = user[0].replace('@', '');

                    const lastUserLength = users[users.length - 1].length;

                    if (lastUserLength > getClient().maxAccountsCheck) {
                        users.push([username]);
                    } else {
                        users[users.length - 1].push(username);
                    }        
                });

                const checkedUsers = [];

                // Check if all of the accounts exist
                await forEach(users, async (users, index) => {
                    const res = await getClient().instance.database.getAccounts(users);

                    for (let user of res) {
                        checkedUsers.push(user.name);
                    }
                });

                this.usersToAirDrop.forEach((user, index) => {
                    if (!checkedUsers.includes(user[0].replace('@', ''))) {
                        this.usersNotExisting.push(user[0]);
                        this.usersToAirDrop.splice(index, 1);
                    }
                });

                this.userConfirmationInProgress = false;

                this.store.dispatch(updateAirdropStateAction, { usersToAirdrop: this.usersToAirDrop });

                // All users exist
                if (!this.usersNotExisting.length) {
                    this.goToStep(2);
                }

                this.store.dispatch(updateAirdropStateAction, { 
                    usersToAirdrop: this.usersToAirDrop,
                    airdropFee: (this.usersToAirDrop.length * 20 / 1000).toFixed(3),
                    usersNotExisting: this.usersNotExisting
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    payFee() {
        if (this.currentToken) {
            steem_keychain.requestSendToken(this.accountName, environment.AIRDROP.FEE_ACCOUNT, this.airdropFee, environment.AIRDROP.MEMO, environment.AIRDROP.TOKEN, response => {
                if (response.success) {
                    this.store.dispatch(updateAirdropStateAction, { currentStep: 4 });
                    this.store.dispatch(updateAirdropStateAction, { feeTransactionId: response.result.id });
                }
            });
        }
    }

    @computedFrom('usersToAirDrop.length')
    get totalAmountBeingAirdropped() {
        let finalAmount = 0.000;

        this.usersToAirDrop.forEach(user => {
            if (user[1]) {
                finalAmount += parseFloat(user[1].replace(',', '.'));
            }
        });

        return finalAmount.toFixed(this.currentToken.precision);
    }

    async runAirdrop() {
        this.airdropInProgress = true;

        const validation = await this.controller.validate();

        if (!validation.valid) {
            console.error('One or more required fields were not filled out');
            return;
        }

        this.taskQueue.queueTask(() => {
            this.buildPayloads();
            this.handleJsonBroadcast(); 
        });
    }

    buildPayloads() {
        for (const user of this.usersToAirDrop) {
            if (user[1]) {
                const username = user[0].replace('@', '');
                const quantity = parseFloat(user[1].replace(',', '.'));
    
                const payload = {
                    contractName:'tokens',
                    contractAction: this.airdropMode,
                    contractPayload: {
                        symbol: `${this.tokenSymbol.toUpperCase()}`,
                        to: `${username}`,
                        quantity: `${quantity.toFixed(this.currentToken.precision)}`,
                        memo: this.memoText
                    }
                };
    
                const lastPayloadSize = JSON.stringify(this.payloads[this.payloads.length - 1]).length;
                const payloadSize = JSON.stringify(payload).length;
    
                if (payloadSize + lastPayloadSize > MAX_PAYLOAD_SIZE) {
                    this.payloads.push([payload]);
                } else {
                    this.payloads[this.payloads.length - 1].push(payload);
                }    
            }    
        }

        const accountsInPayload = [];

        this.payloads.forEach(payload => {
            payload.forEach(data => {
                accountsInPayload.push(data.contractPayload.to);
                this.totalInPayload += parseFloat(data.contractPayload.quantity);
            });
        });
        
        this.totalInPayload = this.totalInPayload.toFixed(this.currentToken.precision);

        this.store.dispatch(updateAirdropStateAction, { 
            payloads: this.payloads,
            usersToAirdrop: [] 
        });
    }

    async handleJsonBroadcast() {
        // Iterate over payloads
        for (const [index, payload] of this.payloads.entries()) {
            try {
                await customJson(this.accountName, this.activeKey, STEEM_ENGINE_OP_ID, payload, true, 6);

                // On success, remove the payload
                this.payloads.splice(index, 1);
            
                this.completed++;

                this.store.dispatch(updateAirdropStateAction, { 
                    percentage: Math.round((this.completed / this.payloadsSize) * 100),
                    completed: this.completed,
                    payloads: this.payloads
                });
            } catch (e) {
                console.error(e);
            }
    
            if (this.payloads.length) {
                await sleep(3000);
            } else {
                this.airdropInProgress = false;
                this.airdropComplete = true;
                this.airdropPercentage = 100;

                localStorage.removeItem('steem-engine__state');
            }
        }

        if (!this.payloads.length) {
            this.airdropComplete = true;
            this.airdropPercentage = 100;

            localStorage.removeItem('steem-engine__state');
        }
    }

    cancelAirdrop() {
        const result = window.confirm('Are you sure you want to cancel?');

        if (result) {
            localStorage.removeItem('steem-engine__state');
            this.store.dispatch(resetAirdropStateAction);
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

ValidationRules
    .ensure('memoText').required().withMessageKey('memoText')
    .ensure('tokenSymbol').required().withMessageKey('tokenSymbol')
    .ensure('activeKey').required().withMessageKey('activeKey')
    .ensure('accountName').required().withMessageKey('accountName')
    .when((obj: Airdrop) => obj.state.airdrop.currentStep === 2)
    .ensure('confirmationText').equals('AIRDROP').withMessageKey('confirmationText')
    .when((obj: Airdrop) => obj.state.airdrop.currentStep === 4)
    .on(Airdrop);

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
