import {Component } from '@angular/core';
import { MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning.dialog.component.html'
})
export class WarningDialogComponent {

    identificador: string;

    constructor(public dialogRef: MatDialogRef<WarningDialogComponent>) {
    }

    onClick(): void {
        this.dialogRef.close();
    }

    showWarning() {
        localStorage.setItem('show-warning', 'present');
    }

}
