import { StoService } from './sto-service';
import { Subscription } from 'rxjs';
import { I18N } from 'aurelia-i18n';
import { State } from 'store/state';
import { HttpClient } from 'aurelia-fetch-client';
import { newInstance } from 'aurelia-framework';
import { environment } from 'environment';
import SSC from 'sscjs';
import { connectTo, dispatchify, Store } from 'aurelia-store';
import steem from 'steem';
import { logout } from 'store/actions';

import { ToastService, ToastMessage } from './toast-service';
import { queryParam, popupCenter, tryParse } from 'common/functions';

@connectTo()
export class SteemEngine {
    private ssc;
    private state: State;
    private subscription: Subscription;

    constructor(
        @newInstance() private http: HttpClient,
        @newInstance() private http2: HttpClient,
        private i18n: I18N,
        private store: Store<State>,
        private stoService: StoService,
        private toast: ToastService) {

        this.ssc = new SSC(environment.RPC_URL);

        this.http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl(environment.ACCOUNTS_API_URL);
        });

        this.http2.configure(config => config.useStandardConfiguration());

        this.subscription = this.store.state.subscribe((state: State) => {
            if (state) {
                this.state = state;
            }
        });
    }

    request(url: string, params: any) {
        // Cache buster
        params.v = new Date().getTime();

        url = url + queryParam(params);

        return this.http.fetch(url, {
            method: 'GET'
        });
    }

    async login(username: string, key?: string) {
        return new Promise(async (resolve, reject) => {
            if (window.steem_keychain && !key) {
                // Get an encrypted memo only the user can decrypt with their private key
                const encryptedMemo = await this.stoService.getUserAuthMemo(username);

                // Tell Keychain to ask the end user to allow the memo to be decrypted using their posting key
                steem_keychain.requestVerifyKey(username, encryptedMemo, 'Posting', async (response) => {
                    if (response.error) {
                        const toast = new ToastMessage();
    
                        toast.message = this.i18n.tr('errorLogin', { 
                            username, 
                            ns: 'errors' 
                        });
    
                        this.toast.error(toast);
                    } else {
                        // Get the return memo and remove the "#" at the start of the private memo
                        const signedKey = (response.result as unknown as string).substring(1);

                        // The decrypted memo is an encrypted string, so pass this to the server to get back refresh and access tokens
                        const tokens = await this.stoService.verifyUserAuthMemo(response.data.username, signedKey);

                        // Store the username, access token and refresh token
                        localStorage.setItem('username', response.data.username);
                        localStorage.setItem('se_access_token', tokens.accessToken);
                        localStorage.setItem('se_refresh_token', tokens.refreshToken);

                        resolve({username, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken});
                    }
                });
            } else {
                try {
                    if (key && !steem.auth.isWif(key)) {
                        key = steem.auth.getPrivateKeys(username, key, ['posting']).posting;
                    }
                } catch(err) {
                    const toast = new ToastMessage();
    
                    toast.message = this.i18n.tr('invalidPrivateKeyOrPassword', { 
                        ns: 'errors' 
                    });
    
                    this.toast.error(toast);
                    return;
                }
    
                try {
                    const user = await steem.api.getAccountsAsync([username]);
    
                    if (user && user.length > 0) {
                        try {
                            if (steem.auth.wifToPublic(key) == user[0].memo_key || steem.auth.wifToPublic(key) === user[0].posting.key_auths[0][0]) {
                                // Get an encrypted memo only the user can decrypt with their private key
                                const encryptedMemo = await this.stoService.getUserAuthMemo(username);

                                // Decrypt the private memo to get the encrypted string
                                const signedKey = steem.memo.decode(key, encryptedMemo).substring(1);

                                // The decrypted memo is an encrypted string, so pass this to the server to get back refresh and access tokens
                                const tokens = await this.stoService.verifyUserAuthMemo(username, signedKey);

                                // Store the username, private key, access token and refresh token
                                localStorage.setItem('username', username);
                                localStorage.setItem('se_access_token', tokens.accessToken);
                                localStorage.setItem('se_refresh_token', tokens.refreshToken);

                                resolve({username, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken});
                            } else {
                                const toast = new ToastMessage();
    
                                toast.message = this.i18n.tr('errorLogin', { 
                                    ns: 'errors' 
                                });
                
                                this.toast.error(toast);
                            }
                        } catch(err) {
                            const toast = new ToastMessage();
    
                            toast.message = this.i18n.tr('errorLogin', { 
                                ns: 'errors' 
                            });
            
                            this.toast.error(toast);
                        }
                    } else {
                        const toast = new ToastMessage();
    
                        toast.message = this.i18n.tr('errorLoading', { 
                            ns: 'errors' 
                        });
        
                        this.toast.error(toast);
                    }
                } catch (e) {
                    return;
                }
            }
        });
    }

    logout() {
        dispatchify(logout)();
    }

    async steemConnectJson(auth_type, data) {
        return new Promise((resolve, reject) => {
            const username = this.state.user.name;
            let url = 'https://steemconnect.com/sign/custom-json?';

            if (auth_type == 'active') {
                url += 'required_posting_auths=' + encodeURI('[]');
                url += '&required_auths=' + encodeURI('["' + username + '"]');
            } else {
                url += 'required_posting_auths=' + encodeURI('["' + username + '"]');
            }
    
            url += '&id=' + environment.CHAIN_ID;
            url += '&json=' + encodeURI(JSON.stringify(data));
    
            popupCenter(url, 'steemconnect', 500, 560);
        });
    }

    async getAccount(username: string) {
        try {
            const user = await steem.api.getAccountsAsync([username]); 
        
            return user && user.length > 0 ? user[0] : null;
        } catch (e) {
            throw new Error(e);
        }
    }

    async loadBalances(account: string, symbol?: string) {
        return await this.ssc.find('tokens', 'balances', { account: account, symbol }, 1000, 0, '', false);
    }

    async loadUserTokens(account: string) {
        return await this.ssc.find('tokens', 'tokens', { issuer: account }, 1000, 0, '', false);
    }

    async findToken(symbol: string) {
        return await this.ssc.findOne('tokens', 'tokens', { symbol });
    }

    async loadParams() {
        let loaded = 0;
        let params = {};

		this.ssc.findOne('sscstore', 'params', {  }, (err, result) => {
			if(result && !err) {
                params = { ...params, ...result };
            }

			if(++loaded >= 3) {
                return params;
            }
		});

		this.ssc.findOne('tokens', 'params', {  }, (err, result) => {
			if(result && !err) {
                params = { ...params, ...result };
            }

			if(++loaded >= 3) {
                return params;
            }
		});
    }

    async sendToken(symbol: string, to: string, quantity: number, memo: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const username = localStorage.getItem('username');
    
            if (!username) {
              window.location.reload();
              return;
            }
        
            const transaction_data = {
              'contractName': 'tokens',
              'contractAction': 'transfer',
              'contractPayload': {
                'symbol': symbol,
                'to': to,
                'quantity': quantity,
                'memo': memo
              }
            };
        
            console.log('SENDING: ' + symbol);
        
            if (window.steem_keychain) {
              steem_keychain.requestCustomJson(username, environment.CHAIN_ID, 'Active', JSON.stringify(transaction_data), 'Token Transfer: ' + symbol, (response) => {
                if (response.success && response.result) {
                    this.checkTransaction(response.result.id, 3, tx => {
                        if (tx.success) {
                            const toast = new ToastMessage();

                            toast.message = this.i18n.tr('tokensSent', {
                                quantity,
                                symbol,
                                to
                            });
            
                            this.toast.success(toast);
                        } else {
                            const toast = new ToastMessage();

                            toast.message = this.i18n.tr('errorSubmittedTransfer', {
                                ns: 'errors',
                                error: tx.error
                            });
            
                            this.toast.error(toast);
                        }
                    });
                } else {
                    // hide
                }
              });
            } else {
                    this.steemConnectJson('active', transaction_data).then(() => {
                        // this.loadBalances(SE.User.name, () => this.showHistory(symbol));
                    });
                }
        });
    }

    async sendTokens(transfers: Array<{symbol: string, to: string, quantity: string, memo: string}>): Promise<any> {
        return new Promise((resolve, reject) => {
            const username = localStorage.getItem('username');
    
            if (!username) {
              window.location.reload();
              return;
            }

            const transaction_data = [];

            transfers.forEach(t => {
                transaction_data.push({
                    contractName: 'tokens',
                    contractAction: 'transfer',
                    contractPayload: {
                        symbol: t.symbol,
                        to: t.to,
                        quantity: t.quantity,
                        memo: t.memo
                    }
                });
            });
        
            if (window.steem_keychain) {
              steem_keychain.requestCustomJson(username, environment.CHAIN_ID, 'Active', JSON.stringify(transaction_data), 'Token Transfers', (response) => {
                if (response.success && response.result) {
                    this.checkTransaction(response.result.id, 3, tx => {
                        if (tx.success) {
                            const toast = new ToastMessage();

                            toast.message = this.i18n.tr('multipleTokensSent');
            
                            this.toast.success(toast);

                            resolve();
                        } else {
                            const toast = new ToastMessage();

                            toast.message = this.i18n.tr('errorSubmittedTransfer', {
                                ns: 'errors',
                                error: tx.error
                            });
            
                            this.toast.error(toast);

                            reject();
                        }
                    });
                } else {
                    reject();
                }
              });
            } else {
                    this.steemConnectJson('active', transaction_data).then(() => {
                        // this.loadBalances(SE.User.name, () => this.showHistory(symbol));
                    });
                }
        });
    }

    checkTransaction(trx_id, retries, callback) {
		this.ssc.getTransactionInfo(trx_id, (err, result) => {
			if (result) {
				let error = null;

				if (result.logs) {
					const logs = JSON.parse(result.logs);

					if (logs.errors && logs.errors.length > 0) {
                        error = logs.errors[0];
                    }
				}

				if (callback) {
                    callback(Object.assign(result, { error: error, success: !error }));
                }	
			} else if (retries > 0) {
                setTimeout(() => this.checkTransaction(trx_id, retries - 1, callback), 5000);
            } else if (callback) {
                callback({ success: false, error: 'Transaction not found.' });
            }
		});
    }

    issueToken(symbol, to, quantity) {
        const transaction_data = {
            'contractName': 'tokens',
            'contractAction': 'issue',
            'contractPayload': {
                'symbol': symbol,
                'to': to,
                'quantity': quantity
            }
        };
    }
}
