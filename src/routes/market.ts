import { Subscription } from 'rxjs';
import { DialogService } from 'aurelia-dialog';
import { State } from 'store/state';
import { dispatchify, Store } from 'aurelia-store';

import uniq from 'lodash/uniq';
import fill from 'lodash/fill';
import find from 'lodash/find';

import moment from 'moment';

import { query } from 'common/apollo';

import { computedFrom } from 'aurelia-binding';
import { usdFormat } from 'common/functions';
import { loading } from 'store/actions';
import { SteemEngine } from 'services/steem-engine';
import { autoinject } from 'aurelia-framework';

const Data = {
    "token": "ENG",
    "precision": 8,
    "user_orders": [],
    "user_token_balance": {
      "account": "beggars",
      "symbol": "ENG",
      "balance": "123.60000000",
      "$loki": 13547
    },
    "user_steemp_balance": {
      "account": "beggars",
      "symbol": "STEEMP",
      "balance": "0.000",
      "$loki": 14239
    }
};

@autoinject()
export class Market {
    private chartData;
    private state: State;
    private subscription: Subscription;
    private urlTokenParam = '';
    private renderMarket = false;
    private token = {};

    constructor(private store: Store<State>, private SE: SteemEngine, private dialogService: DialogService) {
        this.store.registerAction('loadMarketData', this.loadMarketData);
    }

    bind() {
        this.subscription = this.store.state.subscribe((state: State) => {
            this.state = state;

            this.token = this.state.tokens.find(t => t.symbol === this.urlTokenParam);
        });
    }

    unbind() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    async activate({ token }) {
        await this.store.dispatch(this.loadMarketData, token);

        // await dispatchify(loadSteemPrice)();
        // await dispatchify(loadBuyBook)(token);
        // await dispatchify(loadSellBook)(token);
        // await dispatchify(loadTradesHistory)(token);
        // await dispatchify(loadUserBalances)(token);
        // await dispatchify(loadUserBuyBook)(token);
        // await dispatchify(loadUserSellBook)(token);

        this.renderMarket = true;

        dispatchify(loading)(false);

        this.urlTokenParam = token;
    }

    deactivate() {
        dispatchify(loading)(true);
        this.renderMarket = false;
    }

    async loadMarketData(state: State, token?) {
        const newState = { ...state };

        const account = newState.user.loggedIn ? newState.user.name : null;

        const data = await query(`query {
            sscstore {
                priceSBD,
                priceSteem,
                quantity,
                disabled
            },
            
            tokenParams {
                tokenCreationFee
            },
            
            tokens(limit: 1000, offset: 0) {
                issuer,
                symbol,
                name,
                metadata {
                    url,
                    icon,
                    desc
                },
                precision,
                maxSupply,
                supply,
                circulatingSupply
            },
            
            metrics(limit: 1000, offset: 0) {
              symbol,
              volume,
              volumeExpiration,
              lastPrice,
              lowestAsk,
              highestBid,
              lastDayPrice,
              lastDayPriceExpiration,
              priceChangeSteem,
              priceChangePercent
            },
            
            steempBalance {
              account,
              symbol,
              balance
            },
            
            balances(account: "${account}", limit: 1000, offset: 0) {
              account,
              symbol,
              balance
            },
            
            buyBook(symbol: "${token}", limit: 200, offset: 0) {
              txId,
              timestamp,
              account,
              symbol,
              quantity,
              price,
              tokensLocked,
              expiration
            },
            
            sellBook(symbol: "${token}", limit: 200, offset: 0) {
              txId,
              timestamp,
              account,
              symbol,
              quantity,
              price,
              expiration
            },
            
            tradesHistory(symbol: "${token}", limit: 30, offset: 0) {
              type,
              symbol,
              quantity,
              price,
              timestamp
            },
            
            userBuyBook: buyBook(symbol: "${token}", account: "${account}", limit: 100, offset: 0) {
              txId,
              timestamp,
              account,
              symbol,
              quantity,
              price,
              tokensLocked,
              expiration
            },
            
            userSellBook: sellBook(symbol: "${token}", account: "${account}", limit: 100, offset: 0) {
              txId,
              timestamp,
              account,
              symbol,
              quantity,
              price,
              expiration
            },
            
            tokenBalance(symbol: "${token}", account: "${account}") {
                account,
                symbol,
                balance
            }
        }`);

        if (data.data) {
            const response = data.data;

            newState.buyBook = response.buyBook;
            newState.sellBook = response.sellBook;
            newState.tradesHistory = response.tradesHistory;

            if (newState.user.loggedIn) {
                newState.user.tokenBalance = response.tokenBalance;
                newState.user.buyBook = response.userBuyBook;
                newState.user.sellBook = response.userSellBook;
            }
        }

        return newState;
    }

    @computedFrom('state.tokens.length')
    get tokens() {
        return this.state.tokens.filter(t => t.metadata && !t.metadata.hide_in_market);
    }

    attached() {
        const buyOrderLabels = uniq(this.state.buyBook.map(o => o.price));
        const buyOrderDataset = [];

        let buyOrderCurrentVolume = 0;

        buyOrderLabels.forEach(label => {
            let matchingBuyOrders = this.state.buyBook.filter(o => o.price === label);
            if (matchingBuyOrders.length === 0) {
                buyOrderDataset.push(null);
            } else {
                buyOrderCurrentVolume = buyOrderCurrentVolume + matchingBuyOrders.reduce((acc, val: any) => { return val.price * val.quantity }, 0);
                buyOrderDataset.push(buyOrderCurrentVolume);
            }
        });
        buyOrderLabels.reverse();
        buyOrderDataset.reverse();

        const sellOrderLabels = uniq(this.state.sellBook.map(o => o.price));
        const sellOrderDataset = fill(Array(buyOrderDataset.length), null);
        let sellOrderCurrentVolume = 0;

        sellOrderLabels.forEach(label => {
            let matchingSellOrders = this.state.sellBook.filter(o => o.price === label);

            if (matchingSellOrders.length === 0) {
                sellOrderDataset.push(null);
            } else {
                sellOrderCurrentVolume = sellOrderCurrentVolume + matchingSellOrders.reduce((acc, val: any) => { return val.price * val.quantity }, 0);
                sellOrderDataset.push(sellOrderCurrentVolume);
            }
        });

        this.chartData = {
			labels: buyOrderLabels.concat(sellOrderLabels),
			datasets: [
				{
					label: 'Buy',
					steppedLine: 'after',
					borderColor: '#88e86b',
					backgroundColor: '#a9ea96',
					data: buyOrderDataset
				},
				{
					label: 'Sell',
					steppedLine: 'before',
					borderColor: '#e45858',
					backgroundColor: '#e87f7f',
					data: sellOrderDataset
				}
			]
        };
    }

    marketChartRendered() {

    }

    @computedFrom('state.tradesHistory.length', 'state.steemPrice')
    get lastPrice() {
        if (this.state && this.state.tradesHistory && this.state.tradesHistory.length > 0) {
            const item = this.state.tradesHistory[0].price;

            return `${item} STEEM / ${usdFormat(item , null, this.state.steemPrice)}`;
        }

        return '--';
    }

    @computedFrom('urlTokenParam', 'state.tokens.length')
    get twentyFourHourVolume() {
        if (this.state) {
            const token = this.state.tokens.find(t => t.symbol === this.urlTokenParam);

            if (token) {
                return `${token.volume} STEEM / ${usdFormat(token.volume, 2, this.state.steemPrice)}`;
            }
        }

        return '--';
    }

    @computedFrom('state.buyBook.length')
    get bid() {
        if (this.state) {
            return (this.state.buyBook.length > 0) ? `${this.state.buyBook[0].price} STEEM` : '--';
        }

        return '--';
    }

    @computedFrom('state.sellBook.length')
    get ask() {
        if (this.state) {
            return (this.state.sellBook.length > 0) ? `${this.state.sellBook[0].price} STEEM` : '--';
        }

        return '--';
    }
}
