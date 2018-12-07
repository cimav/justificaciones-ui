import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-crear-dialog',
  templateUrl: './crear.dialog.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CrearDialogComponent {

  @ViewChild('id_input_filter') inputEl: ElementRef;
  identificador: string;

  constructor(public dialogRef: MatDialogRef<CrearDialogComponent>) {
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
