import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {RestService} from '../rest.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProveedorNetmultix} from '../model';

@Component({
  selector: 'app-proveedor-dialog',
  templateUrl: './search-proveedor-dialog.component.html',
  styleUrls: ['./search-proveedor-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchProveedorDialogComponent implements OnInit {

  proveedoresNetmultix: ProveedorNetmultix[] = [];
  proveedoresNetmultixFiltered: ProveedorNetmultix[] = [];
  loading = true;

  @ViewChild('id_input_filter') inputEl: ElementRef;

  constructor(public dialogRef: MatDialogRef<SearchProveedorDialogComponent>, private rest: RestService) {
  }

  ngOnInit() {

    this.loading = true;
    this.rest.getProveedoresNetmultix().subscribe(
      (response: ProveedorNetmultix[]) => {
        this.proveedoresNetmultix = response;
      },
      error => console.log(error),
      () => {
        this.applyFilter('');
        this.loading = false;
        this.inputEl.nativeElement.focus();
        console.log('Get Proveedores:' + (this.proveedoresNetmultix).length);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.proveedoresNetmultixFiltered = this.proveedoresNetmultix.filter(provee => provee.razon_social.includes(filterValue.toUpperCase()));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDblClick(selected: ProveedorNetmultix): void {
    this.dialogRef.close({selected});
  }

}
