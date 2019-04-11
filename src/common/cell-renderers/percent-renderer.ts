import { usdFormat } from 'common/functions';

// <span class="' + (value > 0 ? 'green' : (value < 0 ? 'red' : '')) + '">' + value.toFixed(2) + '%</span>

export class PercentCellRenderer {
    private eGui: any;


    init(params) {
        this.eGui = document.createElement('span');

        if (params.value > 0) {
            this.eGui.classList.add('green');
        } else if (params.value < 0) {
            this.eGui.classList.add('red');
        } else {
            this.eGui.classList.remove('green');
            this.eGui.classList.remove('red');
        }

        this.eGui.innerHTML = `${params.value.toFixed(2)}%`;
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        if (params.value > 0) {
            this.eGui.classList.add('green');
        } else if (params.value < 0) {
            this.eGui.classList.add('red');
        } else {
            this.eGui.classList.remove('green');
            this.eGui.classList.remove('red');
        }

        this.eGui.innerHTML = `${params.value.toFixed(2)}%`;
        return true;
    }

    destroy() {
        // cleanup
    }
}
