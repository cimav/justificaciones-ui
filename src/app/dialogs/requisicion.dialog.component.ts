import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-requisicion-dialog',
    templateUrl: './requisicion.dialog.component.html'
})
export class RequisicionDialogComponent {

    constructor(public dialogRef: MatDialogRef<RequisicionDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public requisicion: string) {
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onClick(): void {
        this.dialogRef.close(true);
    }

}
