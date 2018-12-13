import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {RestService} from './rest.service';
import {Empleado, Justificacion, Moneda, Partida, Proveedor, Tipo} from './model';
import { NgForm} from '@angular/forms';
import {MatDialog, MatSnackBar, MatTableDataSource} from '@angular/material';
import {ProveedorDialogComponent} from './dialogs/proveedor.dialog.component';
import {CurrencyPipe} from '@angular/common';
import {EliminarDialogComponent} from './dialogs/eliminar.dialog.component';
import {WarningDialogComponent} from './dialogs/warning.dialog.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit, AfterViewChecked {

  @ViewChild('editForm') editForm: NgForm;

  justificacion: Justificacion;
  tipos: Tipo[] = [];
  monedas: Moneda[] = [];
  partidas: Partida[] = [];
  // partidas_by_tipo: Partida[] = [];
  empleados: Empleado[] = [];

  dsProveedores: MatTableDataSource<Proveedor>;
  displayedColumns: string[] = ['seleccionar', 'clave', 'razon_social', 'fuente', 'monto', 'acciones'];
  row_hover = 0;

  valueBuffer = 0;

  // private routeActive: ActivatedRoute, private router: Router,
  constructor(private rest: RestService,  public dialog: MatDialog,
              private currencyPipe: CurrencyPipe, public msgsBar: MatSnackBar, private changeDetector: ChangeDetectorRef) {
  }

  @Output() justificacionIdToNull = new EventEmitter();

  @Input() public set setJustificacion(justificacion_id: number) {
    this.valueBuffer = 0;
    this.rest.getJustificacion(justificacion_id).subscribe( (response: Justificacion) => {
      this.justificacion = response;
    }, error => {
      console.log('Error getJusficacion ' + justificacion_id + ' :::  ' + error);
    }, () => {
      console.log('Get Single Justificacion Entrando Edit:' + this.justificacion.id );

      this.dsProveedores = new MatTableDataSource(this.justificacion.proveedores);
      this.asignarProveeSelected();

      // 1ero carga la Justificación y después las colecciones
      this.initCollections();

      this.valueBuffer = 100;
    });
  }

  ngOnInit() {
  }

  initCollections(): void {

    this.rest.getEmpleados().subscribe(
      (response: Empleado[]) => {
        this.empleados = response;
      },
      error => console.log(error),
      () => console.log('Get Empleados:' + (this.empleados).length)
    );

    this.rest.getTipos().subscribe(
      (response: Tipo[]) => {
        this.tipos = response;
      },
      error => console.log(error),
      () => console.log('Get Tipos:' + (this.tipos).length)
    );

    this.rest.getMonedas().subscribe(
      (response: Moneda[]) => {
        this.monedas = response;
      },
      error => console.log(error),
      () => console.log('Get Monedas:' + (this.monedas).length)
    );

    this.rest.getPartidas().subscribe(
      (response: Partida[]) => {
        this.partidas = response;
      },
      error => console.log(error),
      () => {
        console.log('Get Partidas:' + (this.partidas).length);

        this.onTipoChanges(this.justificacion.tipo_id);
      }
    );

    /**************************/
    /**** Punto de entrada ****/
    /*
    this.routeActive.params.subscribe(params => {
      const id = params['id'];
      this.rest.getJustificacion(id).subscribe( (response: Justificacion) => {
        this.justificacion = response;
      }, error => {
        console.log('Error getJusficacion ' + id + ' :::  ' + error);
      }, () => {
        console.log('Get Single Justificacion Entrando Edit:' + this.justificacion.id );
        console.log(this.justificacion);

        this.dsProveedores = new MatTableDataSource(this.justificacion.proveedores);
        this.asignarProveeSelected();
      });
    });
    */

  }

  ngAfterViewInit(): void {
    // this.onTipoChanges(this.justificacion.tipo_id);
  }

  ngAfterViewChecked(): void {
    this.forceValidation();
  }

  asignarProveeSelected() {
    const prov_sel = this.justificacion.proveedores.filter(prov => this.justificacion.proveedor_id === prov.id)[0];
    this.justificacion.proveedor_selected = prov_sel;
  }

  forceValidation() {
    // requerido pq Angular2-Polymer todavía no estan al 100%
    if (this.editForm) {
      for (const nom in this.editForm.controls) {
        // $("[name='" + inner + "']").trigger('validate');
        const ctrl = this.editForm.controls[nom];
        if (ctrl) {
          ctrl.updateValueAndValidity();
          ctrl.markAsTouched();
        }
      }

      // evitar el ExpressionChangedAfterItHasBeenCheckedError
      this.changeDetector.detectChanges();
    }
  }

  /*
  ngDoCheck(): void {
    // this.forceValidation();
  }
  */

  /*
  forceValidation(): void {
    if (this.editForm) {
      const _datosForm: NgForm = this.editForm;
      Object.keys(this.editForm.controls).forEach(key => {
        _datosForm.form.get(key).valid;
      });
    }
  }
  */

  saveDatos(event: any) {
    if (this.justificacion.num_pagos <= 0) {
        this.justificacion.num_pagos = 1;
    }
    this.rest.updateJustificacion(this.justificacion).subscribe( (response: Justificacion) => {
      this.justificacion = response;
    }, error => {
      console.log('Error Update Justificacion ' + this.justificacion.id + ' :::  ' + error);
    }, () => {
      console.log('Get Update Justificacion:' + this.justificacion.id);

      this.editForm.form.markAsPristine();
      this.asignarProveeSelected();
    });
  }

  backToTable() {
    // this.router.navigate(['/table']);
    this.justificacionIdToNull.emit(null);
  }

  onTipoChanges(tipo_id: any) {
    // this.partidas_by_tipo = this.partidas.filter(partida => partida.tipo_id === tipo_id || partida.tipo_id === 99);
  }

  compareTipo(t1: Tipo, t2: Tipo): boolean {
    // necesaria pq si no, no muestra la selección
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }
  comparePartida(p1: Partida, p2: Partida): boolean {
    // necesaria pq si no, no muestra la selección
    // console.log(p1 + ' : ' + p2);
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  pdficar() {
    /*
    this.rest.updateJustificacion(this.justificacion).subscribe( (response: Justificacion) => {
      this.justificacion = response;
    }, error => {
      console.log('Error Pdficar ' + this.justificacion.id + ' :::  ' + error);
    }, () => {
      console.log('Pdficar:' + this.justificacion.id);

      this.editForm.form.markAsPristine();
      this.asignarProveeSelected();

      // window.open(this.rest.getEndPoint() + 'justificaciones/' + this.justificacion.id + '.pdf');
    });
    */

        /*
      // const showWarning = localStorage.getItem('show-warning') === null;
      const showWarning = true; //this.editForm.form.valid === false
      if (showWarning) {
          const dialogRef = this.dialog.open(WarningDialogComponent, {
              width: '350px'
          });
          dialogRef.afterClosed().subscribe(() => {
              // window.open(this.rest.getEndPoint() + 'justificaciones/' + this.justificacion.id + '.pdf');
          });
      } else {
          window.open(this.rest.getEndPoint() + 'justificaciones/' + this.justificacion.id + '.pdf');
      }
      */

      window.open(this.rest.getEndPoint() + 'justificaciones/' + this.justificacion.id + '.pdf');

  }

  cotizar(prov_id: number) {
    window.open(this.rest.getEndPoint() + 'cotizaciones/' + this.justificacion.id + '/' + prov_id + '.pdf');
  }

  mercado() {
    window.open(this.rest.getEndPoint() + 'mercado/' + this.justificacion.id + '.pdf');
  }

  monto(): number {
    return this.justificacion.proveedor_selected ? this.justificacion.proveedor_selected.monto : 0.00;
  }

  importe(): string {
    const result: number = this.monto() * 1 + this.justificacion.iva * 1;
    return result.toFixed(2);
  }

  justiDicta(tipo: number) {
    if (tipo === 7) {
      return 'Dictamen';
    } else {
      return 'Justificación';
    }
  }

  rowHover(num: number) {
    this.row_hover = num;
  }
  openProveedorDialog(proveedor: Proveedor): void {

    if (!proveedor) {
      proveedor = new Proveedor();
      proveedor.justificacion_id = this.justificacion.id;
      proveedor.monto = 0.00;
      proveedor.fuente = 0;
    }

    const prove_cpy: Proveedor = Object.assign({}, proveedor);
    const dialogRef = this.dialog.open(ProveedorDialogComponent, {
      width: '850px',
      data: prove_cpy
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (result.id) {
          this.rest.updateProveedor(result).subscribe( (response: Proveedor) => {
            // this.justificacion.proveedores = response;
            // this.dsProveedores = new MatTableDataSource(this.justificacion.proveedores);
            // setTimeout( () => { /*Your Code*/ }, 17000 );
          }, error => {
            console.log('Error updateProveedor ' + result.id + ' :::  ' + error);
          }, () => {
            console.log('Get updateProveedor:' + result.id );

            this.loadProveedores();
          });
        } else {
          this.rest.addProveedor(result).subscribe( (response: Proveedor) => {
            // this.justificacion.proveedores = response;
            // this.dsProveedores = new MatTableDataSource(this.justificacion.proveedores);
            // setTimeout( () => { /*Your Code*/ }, 17000 );
          }, error => {
            console.log('Error addProveedor ' + result.id + ' :::  ' + error);
          }, () => {
            console.log('Get addProveedor:' + result.id );

            this.loadProveedores();
          });
        }

      }
    });
  }

  loadProveedores() {
    this.rest.getProveedoresOf(this.justificacion.id).subscribe( (response: Proveedor[]) => {
      this.justificacion.proveedores = response;
      this.dsProveedores = new MatTableDataSource(response);
    }, error => {
      console.log('Error getProveedoresOf ' + this.justificacion.id + ' ::: ' + error);
    }, () => {
      console.log('Get getProveedoresOf:' + this.justificacion.id);

      this.asignarProveeSelected();
    });
  }

  currencyMonto(value) {
    return this.currencyPipe.transform(value, this.justificacion.moneda.code, 'symbol-narrow');
  }

  fuenteTxt(id: number) {
    switch (id) {
      case 0: return 'Internet';
      case 1: return 'Compranet';
      case 2: return 'Presencial';
    }
  }

  doSeleccionar(event: any, prov: Proveedor) {
    // console.log('>>>', prov.razon_social);
    // this.editForm.form.markAsDirty();
    if (event.checked) {
      this.justificacion.proveedor_id = prov.id;
      this.justificacion.proveedor_selected = prov;
    } else {
      this.justificacion.proveedor_id = 0;
      this.justificacion.proveedor_selected = null;
    }

    this.saveDatos(null);
  }

  openEliminarProveedorDialog(_id: number, _clave: string): void {
    const dialogRef = this.dialog.open(EliminarDialogComponent, {
      width: '350px',
      data: {id: _id, identificador: _clave, titulo: 'proveedor'}
    });

    dialogRef.afterClosed().subscribe((id_to_del: number) => {
      if (id_to_del) {
        // console.log('Eliminar proveedor: ', id_to_del);

        if (this.justificacion.proveedor_id === id_to_del) {
          this.justificacion.proveedor_id = null;
          this.justificacion.proveedor_selected = null;
        }

        this.rest.deleteProveedor(id_to_del).subscribe(
          data => {
            console.log ('Data borrando');
          },
          error => { console.log ('Error borrando ' + id_to_del);
          }, () => {
            console.log('Borrado proveedor: ' + id_to_del);

            this.loadProveedores();
          }
        );
      }
    });
  }

  searchRequisicion(requisicion: string): void {
    this.rest.searchRequisicion(requisicion).subscribe(
      data => {

        if (data) {
          this.justificacion.requisicion = data.requisicion;
          this.justificacion.proyecto = data.proyecto;
          this.justificacion.descripcion = data.descripcion;
          this.justificacion.autorizo_id = data.cve_responsable;
          this.justificacion.elaboro_id = data.cve_solicitante;

          const partida: Partida[] = this.partidas.filter(p => p.id === data.partida);
          if (partida && partida[0] && this.justificacion.tipo_id !== partida[0].tipo_id) {
            this.justificacion.tipo_id = partida[0].tipo_id;
            this.onTipoChanges(this.justificacion.tipo_id);
          }

          this.justificacion.partida_id = data.partida;

          this.editForm.form.markAsDirty();
        } else {
          this.msgsBar.open('Requisición no encontrada', requisicion, {
            duration: 2000,
          });
        }
        /*
          fecha_requisicion: 20180914,
          cve_creador: 344,
         */
      },
      error => { console.log ('Error search requisicion ' + requisicion);
      }, () => {
        console.log('Requisiciǿn encontrada: ' + requisicion);
      }
    );
  }

  hasCompranet(): boolean {
      // al menos 1 debe ser compranet
      const has = this.justificacion.proveedores.filter(prov => prov.fuente === 1).length > 0;
      return has;
  }

}

