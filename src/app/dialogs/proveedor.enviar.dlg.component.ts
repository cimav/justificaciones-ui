import {Proveedor} from '../model';
import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {RestService} from '../rest.service';

export class ProveedorEnviarData {
    proveedor: Proveedor;
    reply_to: string;
    constructor(proveedor: Proveedor, reply_to: string) {
        this.proveedor = proveedor;
        this.reply_to = reply_to + '@cimav.edu.mx';
    }
}

@Component({
    selector: 'app-proveedor-enviar-dialog',
    templateUrl: './proveedor.enviar.dlg.component.html',
    styleUrls: ['./proveedor.dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProveedorEnviarDlgComponent {

    constructor(private dialogRef: MatDialogRef<ProveedorEnviarDlgComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ProveedorEnviarData, public dialog: MatDialog, private rest: RestService) {
    }

    showFocon04Pdf() {
        window.open(this.rest.getEndPoint() + 'cotizaciones/' + this.data.proveedor.justificacion_id + '/' + this.data.proveedor.id + '.pdf');
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onClick(): void {
        this.dialogRef.close(this.data.proveedor);
    }

}
