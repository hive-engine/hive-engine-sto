import { ICellRendererParams } from 'ag-grid-community';

export class ActionsCellRenderer {
    private eGui: any;
    private params: ICellRendererParams;
    public viewModel: any;

    send() {
        this.viewModel.send();
    }

    init(params: ICellRendererParams) {
        this.eGui = document.createElement('div');
        this.eGui.classList.add('cell-button-actions');
        this.eGui.innerHTML = `
            <a href="javascript:void(0);" data-type="info"><i class="fas fa-info-circle"></i></a>
            <a href="javascript:void(0);" data-type="exchange"><i class="fas fa-exchange-alt"></i></a>
            <a href="javascript:void(0);" data-type="send"><i class="fas fa-share-square"></i></a>
            <a href="javascript:void(0);" data-type="history"><i class="fas fa-list-ul"></i></a>
        `;

        this.eGui.addEventListener('click', this.actionClickListener);

        this.params = params;
    }

    actionClickListener = (evt) => {
        evt.preventDefault();
        const item = evt.target;
        if (item && item.dataset.type) {
            const type = item.dataset.type;
            
            this.viewModel.send(type, this.params.data);
        }
    }

    getGui() {
        return this.eGui;
    }

    // refresh(params) {
    //     this.eGui.innerHTML = `
    //         <a href="#"><i class="fa fa-info-circle"></i></a>
    //         <a href="#"><i class="fas fa-exchange-alt"></i></a>
    //         <a href="#"><i class="fas fa-share-square"></i></a>
    //         <a href="#"><i class="fas fa-list-ul"></i></a>
    //     `;
    //     return true;
    // }

    destroy() {
        // cleanup
        this.eGui.removeEventListener('click', this.actionClickListener);
    }
}
