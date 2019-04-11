import { usdFormat } from 'common/functions';

//  return value ? '<span class="' + (rowdata.priceChangePercent > 0 ? 'green' : (rowdata.priceChangePercent < 0 ? 'red' : '')) + '">' + usdFormat(value) + '</span>' : '--';

export class PriceChangeRenderer {
    private eGui: any;


    init(params) {
        this.eGui = document.createElement('span');

        const rowData = params.data;

        if (rowData.priceChangePercent > 0) {
            this.eGui.classList.add('green');
        } else if (rowData.priceChangePercent < 0) {
            this.eGui.classList.add('red');
        } else {
            this.eGui.classList.remove('green');
            this.eGui.classList.remove('red');
        }

        this.eGui.innerHTML = `${usdFormat(params.value)}`;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        const rowData = params.data;

        if (rowData.priceChangePercent > 0) {
            this.eGui.classList.add('green');
        } else if (rowData.priceChangePercent < 0) {
            this.eGui.classList.add('red');
        } else {
            this.eGui.classList.remove('green');
            this.eGui.classList.remove('red');
        }

        this.eGui.innerHTML = `${usdFormat(params.value)}`;

        return true;
    }

    destroy() {
        // cleanup
    }
}
