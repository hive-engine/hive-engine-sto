import { SupplyCellRenderer } from './../common/cell-renderers/supply-renderer';
import { PercentCellRenderer } from './../common/cell-renderers/percent-renderer';
import { PriceChangeRenderer } from './../common/cell-renderers/price-change-renderer';
import { USDCellRenderer } from './../common/cell-renderers/usd-renderer';
import { InfoModal } from './../modals/info';
import { ActionsCellRenderer } from './../common/cell-renderers/actions-renderer';
import { SendModal } from './../modals/send';
import { SymbolCellRenderer } from './../common/cell-renderers/symbol-renderer';
import { SteemEngine } from './../services/steem-engine';
import { State } from 'store/state';
import { dispatchify, Store } from 'aurelia-store';
import { loadBalances, loadTokens } from 'store/actions';

import { DialogService } from 'aurelia-dialog';
import { GridOptions, ColumnApi, GridApi } from 'ag-grid-community';
import { autoinject } from 'aurelia-framework';
import { addCommas } from 'common/functions';

@autoinject()
export class Tokens {
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
        this.gridOptions.rowHeight = 60;
        this.gridOptions.domLayout = 'autoHeight';

        this.gridOptions.onGridReady = (params) => {
            this.gridApi = params.api;
            this.columnApi = this.gridOptions.columnApi;

            this.initGrid();
        };

        // this.gridOptions.onFirstDataRendered = (params) => {
        //     params.api.sizeColumnsToFit();
        // }

        this.gridOptions.onColumnResized = (params) => {
            params.api.resetRowHeights();
        }
    }

    initGrid() {
        ActionsCellRenderer.prototype.viewModel = this;

        this.columnDefs = [
            { 
                headerName: 'Symbol', 
                field: 'symbol', 
                cellRenderer: SymbolCellRenderer, 
                width: 110,
                sortable: true 
            },
            { 
                headerName: 'Token Name', 
                field: 'name',
                autoHeight: true,
                cellStyle: {
                    'white-space': 'normal'
                },
                width: 180,
                sortable: true 
            },
            { 
                headerName: 'Market Cap', 
                field: 'marketCap', 
                cellRenderer: USDCellRenderer,
                width: 165,
                sortable: true 
            },
            { 
                headerName: 'Price', 
                field: 'lastPrice', 
                cellRenderer: PriceChangeRenderer, 
                width: 100, 
                sortable: true 
            },
            { 
                headerName: '% Chg', 
                field: 'priceChangePercent', 
                cellRenderer: PercentCellRenderer, 
                width: 100, 
                sortable: true 
            },
            { 
                headerName: '24h Vol', 
                field: 'volume', 
                width: 100, 
                sortable: true 
            },
            { 
                headerName: 'Supply', 
                field: 'supply', 
                cellRenderer: SupplyCellRenderer,
                width: 100, 
                sortable: true 
            },
            { 
                headerName: '', 
                field: 'value', 
                cellRenderer: ActionsCellRenderer, 
                colId: 'actions', 
                sortable: false 
            }
        ];
    }

    bind() {
        this.store.state.subscribe((state: State) => {
            this.state = state;

            const tokens = [ ...this.state.tokens ];

            console.log(tokens);

            tokens.map(t => {
                const token = state.tokens.find(tk => tk.symbol === t.symbol);

                if (token && token.metadata && token.metadata.icon) {
                    t.icon = token.metadata.icon;
                }

                return t;
            });

            this.rowData = this.state.tokens;
        
            //this.state.user.balances.sort((a, b) => b.balance * b.lastPrice * window.steem_price - a.balance * a.lastPrice * window.steem_price);
        });
    }

    async canActivate({ token }) {
        await dispatchify(loadTokens)();
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
