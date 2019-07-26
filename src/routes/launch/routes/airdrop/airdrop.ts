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
        maxPayloadSize: 8000,
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
    node.instance = new Client(node.url, { timeout: 10000 });

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
        
        if (retries < 10) {
            return await customJson(account, key, id, json, useActive, retries + 1);
        } else {
            console.error('Error broadcasting custom JSON after 10 failed attempts.');
        }
    }
}

@autoinject()
export class Airdrop {

}
