import {Component, Inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {RestService} from '../rest.service';
import {Proveedor, ProveedorNetmultix} from '../model';
import {SearchProveedorDialogComponent} from './search-proveedor-dialog.component';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-proveedor-dialog',
  templateUrl: './proveedor.dialog.component.html',
  styleUrls: ['./proveedor.dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProveedorDialogComponent {

  @ViewChild('proveedorForm') proveedorForm: NgForm;

  constructor(public dialogRef: MatDialogRef<ProveedorDialogComponent>, private rest: RestService,
              @Inject(MAT_DIALOG_DATA) public proveedor: Proveedor, public dialog: MatDialog) {
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(SearchProveedorDialogComponent,
      {height: '600px', width: '700px', hasBackdrop: true});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const proveedorNetmultix: ProveedorNetmultix = <ProveedorNetmultix>result.selected;
        this.proveedor.clave = proveedorNetmultix.clave.trim();
        this.proveedor.razon_social = proveedorNetmultix.razon_social;
        this.proveedor.rfc = proveedorNetmultix.rfc;
        this.proveedor.telefono = proveedorNetmultix.telefono;
        this.proveedor.domicilio = proveedorNetmultix.domicilio;
        this.proveedor.email = proveedorNetmultix.email;
        this.proveedor.banco = proveedorNetmultix.banco;
        this.proveedor.contacto = proveedorNetmultix.contacto;

        this.proveedorForm.form.markAsDirty();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    this.dialogRef.close(this.proveedor);
  }

}
