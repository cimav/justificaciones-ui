import {Component } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-notificar-dialog',
    templateUrl: './notificar.dialog.component.html'
})
export class NotificarDialogComponent {

    identificador: string;

    constructor(public dialogRef: MatDialogRef<NotificarDialogComponent>) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onClick(): void {
        this.dialogRef.close(true);
    }

}
