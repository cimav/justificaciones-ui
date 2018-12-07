import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface ReplicarDialogData {
  id: number;
  identificador: string;
}

@Component({
  selector: 'app-replicar-dialog',
  templateUrl: './replicar.dialog.component.html'
})
export class ReplicarDialogComponent {

  replica = '';

  constructor(public dialogRef: MatDialogRef<ReplicarDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ReplicarDialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    this.dialogRef.close(this.replica);
  }

}
