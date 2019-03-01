import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-requisicion-dialog',
    templateUrl: './importar.dialog.component.html'
})
export class ImportarDialogComponent {

    constructor(public dialogRef: MatDialogRef<ImportarDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public requisicion: string) {
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onClick(): void {
        this.dialogRef.close(true);
    }

}
