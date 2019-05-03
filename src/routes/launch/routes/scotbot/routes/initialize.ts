const FEE_ACCOUNT = 'steemsc';
const FEE_ACCOUNT_PUBLIC_KEY = 'STM68QuR591BeretgKsf93Cjcr3nzSJejjoGsYNaTZZUoPAgyzWAZ';

import steem from 'steem';

export class Initialize {
    private userActiveKey: string;
    private steemUsername = 'beggars';

    sendInitialEngFeeWithKey() {
        // Firstly, we want to encode the active key
        const encoded = steem.memo.encode(this.userActiveKey, FEE_ACCOUNT_PUBLIC_KEY, `#active-key:${this.userActiveKey}`);

        if (encoded) {
            steem_keychain.requestSendToken(this.steemUsername, FEE_ACCOUNT, '0.001', encoded, 'ENG', (response) => {
                console.log(response);
            })
        }
    }
}
