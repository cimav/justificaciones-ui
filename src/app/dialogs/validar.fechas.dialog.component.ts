import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

/*
export class ValidarFechas {
    fechaCreacion: Date;
    fechaCotizar: Date;
    fechaMercado: Date;
    fechaEmision: Date;
    constructor(fechaCreacion: Date, fechaCotizar: Date, fechaMercado: Date, fechaEmision: Date) {
        this.fechaCreacion = fechaCreacion;
        this.fechaCotizar = fechaCotizar;
        this.fechaEmision = fechaEmision;
        this.fechaMercado = fechaMercado;
    }
}
*/

@Component({
    selector: 'app-validar-fechas-dialog',
    templateUrl: './validar.fechas.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ValidarFechasDialogComponent {

    // fechaEmision: Date;

    constructor(public dialogRef: MatDialogRef<ValidarFechasDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: String) {
    }

    // , @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    onClick(): void {
      this.dialogRef.close();
    }

}
