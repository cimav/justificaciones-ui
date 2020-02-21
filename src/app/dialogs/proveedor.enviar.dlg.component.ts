import {Proveedor} from '../model';
import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {RestService} from '../rest.service';

@Component({
    selector: 'app-proveedor-enviar-dialog',
    templateUrl: './proveedor.enviar.dlg.component.html',
    styleUrls: ['./proveedor.dialog.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProveedorEnviarDlgComponent {

    constructor(private dialogRef: MatDialogRef<ProveedorEnviarDlgComponent>,
                @Inject(MAT_DIALOG_DATA) public data: Proveedor, public dialog: MatDialog, private rest: RestService) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onClick(): void {
        this.dialogRef.close(this.data);
    }

}
