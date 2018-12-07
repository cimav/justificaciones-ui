import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CrearDialogComponent} from './crear.dialog.component';

export interface EliminarDialogData {
  id: number;
  identificador: string;
  titulo: string;
}

@Component({
  selector: 'app-eliminar-dialog',
  templateUrl: './eliminar.dialog.component.html'
})
export class EliminarDialogComponent {

  identificador: string;

  constructor(public dialogRef: MatDialogRef<CrearDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EliminarDialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    this.dialogRef.close(this.data.id);
  }

}
