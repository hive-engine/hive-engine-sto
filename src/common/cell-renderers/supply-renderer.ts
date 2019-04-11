import { addCommas } from 'common/functions';

export class SupplyCellRenderer {
    private eGui: any;


    init(params) {
        this.eGui = document.createElement('div');

        const value = parseFloat(params.value);

        this.eGui.innerHTML = `${addCommas((value === null) ? 0 : +value.toFixed(3))}`;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        const value = parseFloat(params.value);

        this.eGui.innerHTML = `${addCommas((value === null) ? 0 : +value.toFixed(3))}`;
        return true;
    }

    destroy() {
        // cleanup
    }
}
