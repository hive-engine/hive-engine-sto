import { InfoModal } from './../modals/info';
import { ActionsCellRenderer } from './../common/cell-renderers/actions-renderer';
import { SendModal } from './../modals/send';
import { SymbolCellRenderer } from './../common/cell-renderers/symbol-renderer';
import { SteemEngine } from './../services/steem-engine';
import { State } from 'store/state';
import { dispatchify, Store } from 'aurelia-store';
import { loadBalances } from 'store/actions';

import { DialogService } from 'aurelia-dialog';
import { GridOptions, ColumnApi, GridApi } from 'ag-grid-community';
import { autoinject } from 'aurelia-framework';
import { addCommas } from 'common/functions';

@autoinject()
export class Balances {
    private username = null;
    private state: State;
    private gridOptions: GridOptions;
    private gridApi: GridApi;
    private columnApi: ColumnApi;
    private columnDefs = [];
    private rowData = [];

    constructor(private store: Store<State>, private SE: SteemEngine, private dialogService: DialogService) {
        this.gridOptions = <GridOptions>{};

        this.gridOptions.headerHeight = 50;
        this.gridOptions.rowHeight = 40;
        this.gridOptions.domLayout = 'autoHeight';

        this.gridOptions.onGridReady = (params) => {
            this.gridApi = params.api;
            this.columnApi = this.gridOptions.columnApi;
            this.initGrid();
        };

        this.gridOptions.onFirstDataRendered = (params) => {
            params.api.sizeColumnsToFit();
        }
    }

    initGrid() {
        ActionsCellRenderer.prototype.viewModel = this;

        this.columnDefs = [
            { headerName: 'Symbol', field: 'symbol', cellRenderer: SymbolCellRenderer, sortable: true },
            { headerName: 'Token Name', field: 'name', sortable: true },
            { headerName: 'Balance', field: 'balance', sortable: true },
            { headerName: 'USD Value', field: 'usdValue', sortable: true },
            { headerName: '% Chg', field: 'priceChangePercent', width: 100, sortable: true },
            { headerName: '', field: 'value', cellRenderer: ActionsCellRenderer, colId: 'actions', sortable: false }
        ];
    }

    bind() {
        this.store.state.subscribe((state: State) => {
            this.state = state;

            const balances = [ ...this.state.user.balances ];

            balances.map(balance => {
                const token = state.tokens.find(t => t.symbol === balance.symbol);

                if (token && token.metadata && token.metadata.icon) {
                    balance.icon = token.metadata.icon;
                }

                balance.balance = `${addCommas(balance.balance)} ${balance.symbol}`;

                return balance;
            });

            this.rowData = this.state.user.balances;
        
            //this.state.user.balances.sort((a, b) => b.balance * b.lastPrice * window.steem_price - a.balance * a.lastPrice * window.steem_price);
        });
    }

    async canActivate({ user }) {
        const cachedUsername = localStorage.getItem('username');

        if (!user && !cachedUsername) {
            return false;
        }

        if (!user) {
            this.username = cachedUsername;
        } else {
            this.username = user;
        }

        await dispatchify(loadBalances)(this.username);
    }

    send(type, item) {
        item = { ...item, ...this.state.tokens.find(t => t.symbol === item.symbol) };

        if (type === 'info') {
            this.dialogService.open({ viewModel: InfoModal, model: item }).whenClosed(response => {
                console.log(response);
            });
        }

        if (type === 'send') {
            this.dialogService.open({ viewModel: SendModal, model: item }).whenClosed(response => {
                console.log(response);
            });
        }
    }
}
