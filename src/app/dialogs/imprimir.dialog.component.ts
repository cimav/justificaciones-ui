import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export class FechasImprimir {
    fechaEmision: Date;
    fechaMercado: Date;
    constructor(fechaMercado: Date, fechaEmision: Date) {
        this.fechaEmision = fechaEmision;
        this.fechaMercado = fechaMercado;
    }
}

@Component({
    selector: 'app-imprimir-dialog',
    templateUrl: './imprimir.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ImprimirDialogComponent {

    // fechaEmision: Date;

    constructor(public dialogRef: MatDialogRef<ImprimirDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: FechasImprimir) {
    }

    // , @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    /*
    onClick(identificador: string): void {
      this.dialogRef.close(identificador);
    }
    */

}
