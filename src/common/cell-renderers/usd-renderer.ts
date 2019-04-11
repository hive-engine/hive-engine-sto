import { usdFormat } from 'common/functions';

export class USDCellRenderer {
    private eGui: any;


    init(params) {
        this.eGui = document.createElement('div');
        this.eGui.innerHTML = `${params.value ? usdFormat(params.value) : '--'}`;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        this.eGui.innerHTML = `${params.value ? usdFormat(params.value) : '--'}`;
        return true;
    }

    destroy() {
        // cleanup
    }
}
