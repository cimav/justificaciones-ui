import {Component, Inject, ViewChild, ViewEncapsulation, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Proveedor, ProveedorNetmultix, Moneda} from '../model';
import {SearchProveedorDialogComponent} from './search-proveedor-dialog.component';
import {NgForm} from '@angular/forms';
import {RestService} from "../rest.service";

export class ProveedorData {
  proveedor: Proveedor;
  status: number;
  is_admin: boolean;
  constructor(proveedor: Proveedor, status: number, is_admin: boolean) {
    this.proveedor = proveedor;
    this.status = status;
    this.is_admin = is_admin;
  }
}

@Component({
  selector: 'app-proveedor-dialog',
  templateUrl: './proveedor.dialog.component.html',
  styleUrls: ['./proveedor.dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProveedorDialogComponent implements OnInit {

  monedas: Moneda[] = [];

  @ViewChild('proveedorForm') proveedorForm: NgForm;

  constructor(private dialogRef: MatDialogRef<ProveedorDialogComponent>, // private rest: RestService,
              @Inject(MAT_DIALOG_DATA) public data: ProveedorData, public dialog: MatDialog, private rest: RestService) {
  }

  ngOnInit() {
    this.rest.getMonedas().subscribe(
        (response: Moneda[]) => {
          this.monedas = response;
        },
        error => console.log(error),
        () => console.log('Get Monedas:' + (this.monedas).length)
    );
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(SearchProveedorDialogComponent,
      {height: '600px', width: '700px', hasBackdrop: true});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const proveedorNetmultix: ProveedorNetmultix = <ProveedorNetmultix>result.selected;
        this.data.proveedor.clave = proveedorNetmultix.clave.trim();
        this.data.proveedor.razon_social = proveedorNetmultix.razon_social;
        this.data.proveedor.rfc = proveedorNetmultix.rfc;
        this.data.proveedor.telefono = proveedorNetmultix.telefono;
        this.data.proveedor.domicilio = proveedorNetmultix.domicilio;
        this.data.proveedor.email = proveedorNetmultix.email;
        this.data.proveedor.banco = proveedorNetmultix.banco;
        this.data.proveedor.contacto = proveedorNetmultix.contacto;

        this.proveedorForm.form.markAsDirty();
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    this.dialogRef.close(this.data.proveedor);
  }

  /*
  canEditar(): boolean {
    return this.data.is_admin || this.data.status === Estado.edicion;
  }
  */
}
