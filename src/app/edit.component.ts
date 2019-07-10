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
import {NgForm,} from '@angular/forms';
import {MatDialog, MatSnackBar, MatTableDataSource} from '@angular/material';
import {ProveedorData, ProveedorDialogComponent} from './dialogs/proveedor.dialog.component';
import {CurrencyPipe} from '@angular/common';
import {EliminarDialogComponent} from './dialogs/eliminar.dialog.component';
import {ImportarDialogComponent} from './dialogs/importar.dialog.component';
import {FechasImprimir, ImprimirDialogComponent} from './dialogs/imprimir.dialog.component';
import {ValidarFechasDialogComponent} from './dialogs/validar.fechas.dialog.component';
import * as moment from 'moment';
import {Globals} from './globals';

// https://angular.io/api/forms/FormControlName#use-with-ngmodel

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

  dsTipos: MatTableDataSource<Tipo>;

  dsProveedores: MatTableDataSource<Proveedor>;
  displayedColumns: string[] = ['seleccionar', 'clave', 'razon_social', 'fuente', 'monto', 'acciones'];
  row_hover = 0;

    displayedColumnsTipos: string[] = ['seleccionar', 'romano', 'texto'];

  valueBuffer = 0;

  // private routeActive: ActivatedRoute, private router: Router,
  constructor(private rest: RestService,  public dialog: MatDialog,
              private currencyPipe: CurrencyPipe, public msgsBar: MatSnackBar, private changeDetector: ChangeDetectorRef,
              private globals: Globals) {
  }

  /*
    ageRangeCtrl: FormControl = new FormControl('', [ageRangeValidator]);
    fMercadoCtrl: FormControl = new FormControl('', []);
    fCotizarCtrl: FormControl = new FormControl('', [this.betweenValidator(this.fMercadoCtrl, null)]);
*/
    /*
    fechasGroup: FormGroup = new FormGroup({
        fCotizarCtrl: new FormControl(),
        fMercadoCtrl: new FormControl()
    }, {validators: cotizarValidator});
    */
/*
    betweenValidator(c1: AbstractControl, c2: AbstractControl): ValidatorFn {
        return (c0: AbstractControl): { [key: string]: boolean } | null => {
                if (moment && moment(c0.value).isBetween(c0.value, c1.value, null, '[]')) {
                    return null;
                } else {
                    return {'mismatchCotizar': true};
                }
                this.forceValidation();
        };
    }

    getErrorMessage() {
        return this.ageRangeCtrl.hasError('ageRange') ? 'El maldito AgRe' : 'Nada';
    }
*/

    /*
    checkCotizar(): { [key: string]: boolean } | null {
        if (this.fCotizarCtrl.value.isBetween('2019-04-09', this.fMercadoCtrl.value, null, '[]')) {
            return null;
        } else {
            return { 'dateBetween': true };
        }
    }
    */

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

  /*
    @Input() public set setEmpleado(empleado: Empleado) {
      this.empleado = empleado;
    }
    */

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
        this.dsTipos = new MatTableDataSource(this.tipos);
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

        // this.onTipoChanges(this.justificacion.tipo_id);
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

    if (moment(this.justificacion.fecha_cotizar).isBefore(this.justificacion.created_at)) {
        this.callValidarFechasDlg('Fecha límite de cotización debe ser mayor a la fecha de creación');
    } else if (moment(this.justificacion.fecha_mercado).isBefore(this.justificacion.fecha_cotizar)) {
        this.callValidarFechasDlg('Fecha del estudio de mercado debe ser mayor a fecha límite de cotización');
    // } else if (moment(this.justificacion.fecha_elaboracion).isBefore(this.justificacion.fecha_mercado)) {
    //    this.callValidarFechasDlg('Fecha de emisión debe ser mayor a fecha del estudio de mercado');
    } else {
        this.rest.updateJustificacion(this.justificacion).subscribe((response: Justificacion) => {
            this.justificacion = response;
        }, error => {
            console.log('Error Update Justificacion ' + this.justificacion.id + ' :::  ' + error);
        }, () => {
            console.log('Get Update Justificacion:' + this.justificacion.id);

            this.editForm.form.markAsPristine();
            this.asignarProveeSelected();
        });
    }
  }

  callValidarFechasDlg(msg: string) {
      const dialogRef = this.dialog.open(ValidarFechasDialogComponent, {width: '280px', hasBackdrop: true, data: msg});
      dialogRef.afterClosed().subscribe(result => {});
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

  /*
  pdficar() {
      window.open(this.rest.getEndPoint() + 'justificaciones/' + this.justificacion.id + '.pdf');
  }
  */

    openImprimirDialog_old(): void {
        const fechasImprimir: FechasImprimir = new FechasImprimir(this.justificacion.fecha_mercado, this.justificacion.fecha_elaboracion);
        const dialogRef = this.dialog.open(ImprimirDialogComponent, {
            width: '280px', hasBackdrop: true,
            data: fechasImprimir
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (this.justificacion.num_pagos <= 0) {
                    this.justificacion.num_pagos = 1;
                }
                this.justificacion.fecha_elaboracion = result;
                this.rest.updateJustificacion(this.justificacion).subscribe( (response: Justificacion) => {
                    this.justificacion = response;
                }, error => {
                    console.log('Error Update Justificacion ' + this.justificacion.id + ' :::  ' + error);
                }, () => {
                    console.log('Get Update Justificacion:' + this.justificacion.id);

                    window.open(this.rest.getEndPoint() + 'justificaciones/' + this.justificacion.id + '.pdf');

                    this.editForm.form.markAsPristine();
                    this.asignarProveeSelected();
                });
            }
        });
    }

    openImprimirDialog(): void {
        if (moment(this.justificacion.fecha_elaboracion).isBefore(this.justificacion.fecha_mercado)) {
            this.callValidarFechasDlg('Fecha de emisión debe ser mayor a fecha del estudio de mercado');
        } else {
            if (this.justificacion.num_pagos <= 0) {
                this.justificacion.num_pagos = 1;
            }
            this.rest.updateJustificacion(this.justificacion).subscribe((response: Justificacion) => {
                this.justificacion = response;
            }, error => {
                console.log('Error Update Justificacion ' + this.justificacion.id + ' :::  ' + error);
            }, () => {
                console.log('Get Update Justificacion:' + this.justificacion.id);

                window.open(this.rest.getEndPoint() + 'justificaciones/' + this.justificacion.id + '.pdf');

                this.editForm.form.markAsPristine();
                this.asignarProveeSelected();
            });
        }
    }

  cotizar(event: Event, prov_id: number) {
    event.stopPropagation();
    window.open(this.rest.getEndPoint() + 'cotizaciones/' + this.justificacion.id + '/' + prov_id + '.pdf');
  }

  /*
  openNotificarDialog(): void {
      const dialogRef = this.dialog.open(NotificarDialogComponent, {
          width: '600px', hasBackdrop: true
      });
      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.justificacion.status = Estado.notificado;
              this.saveDatos(null);
          }
      });
  }
  */

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


  addNewProveedor(): void {
      this.valueBuffer = 0;
      const proveedor: Proveedor = new Proveedor();
      proveedor.justificacion_id = this.justificacion.id;
      proveedor.monto = 0.00;
      proveedor.fuente = 0;
      this.rest.addProveedor(proveedor).subscribe( (response: Proveedor) => {
          // setTimeout( () => { /*Your Code*/ }, 17000 );
      }, error => {
          console.log('Error addNewProveedor ' + proveedor.id + ' :::  ' + error);
      }, () => {
          console.log('Get addNewProveedor:' + proveedor.id );

          this.valueBuffer = 100;

          this.loadProveedores();
      });
  }

  openProveedorDialog(event: Event, proveedor: Proveedor): void {
    if (event) {
        event.stopPropagation();
    }

    /*
    if (this.justificacion.status !== Estado.edicion ) {
        return;
    }
    */

    if (!proveedor) {
      proveedor = new Proveedor();
      proveedor.justificacion_id = this.justificacion.id;
      proveedor.monto = 0.00;
      proveedor.fuente = 0;
    }

    // const prove_cpy: Proveedor = Object.assign({}, proveedor);
    // //  const dataProveedor: ProveedorData = new ProveedorData( Object.assign({}, proveedor), this.justificacion.status, this.empleado.is_admin);
    const dataProveedor: ProveedorData = new ProveedorData( Object.assign({}, proveedor), 0, true);
    const dialogRef = this.dialog.open(ProveedorDialogComponent, {
      width: '850px',
      data: dataProveedor, // prove_cpy
        hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (result.id) {
          this.rest.updateProveedor(result).subscribe( (response: Proveedor) => {
            // this.justificacion.proveedores = response;
            // this.dsProveedores = new MatTableDataSource(this.justificacion.proveedores);
            setTimeout( () => { /*Your Code*/ }, 217000 );
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
    this.valueBuffer = 0;
    this.rest.getProveedoresOf(this.justificacion.id).subscribe( (response: Proveedor[]) => {
      this.justificacion.proveedores = response;
      this.dsProveedores = new MatTableDataSource(response);
    }, error => {
      console.log('Error getProveedoresOf ' + this.justificacion.id + ' ::: ' + error);
    }, () => {
      console.log('Get getProveedoresOf:' + this.justificacion.id);

      this.valueBuffer = 100;

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

  clickSeleccionar(event: Event) {
    event.stopPropagation();
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

    doSeleccionarTipo(event: any, tipo: Tipo) {
        if (event.checked) {
            this.justificacion.tipo_id = tipo.id;
        } else {
            this.justificacion.tipo_id = 0; // 5 Fracción I
        }
        this.saveDatos(null);
    }

  openEliminarProveedorDialog(event: Event, _id: number, _clave: string): void {
    event.stopPropagation();

    if (_clave.trim().length > 5) {
        const dialogRef = this.dialog.open(EliminarDialogComponent, {
            width: '450px',
            data: {id: _id, identificador: _clave, titulo: 'proveedor'},
            hasBackdrop: true
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
                        console.log('Data borrando');
                    },
                    error => {
                        console.log('Error borrando ' + id_to_del);
                    }, () => {
                        console.log('Borrado proveedor: ' + id_to_del);

                        this.loadProveedores();
                    }
                );
            }
        });
    } else {
        if (this.justificacion.proveedor_id === _id) {
            this.justificacion.proveedor_id = null;
            this.justificacion.proveedor_selected = null;
        }

        this.rest.deleteProveedor(_id).subscribe(
            data => {
                console.log('Data borrando');
            },
            error => {
                console.log('Error borrando ' + _id);
            }, () => {
                console.log('Borrado proveedor: ' + _id);

                this.loadProveedores();
            }
        );
    }
  }

  openRequisicionProveedorDialog(requisicion: string): void {
      const dialogRef = this.dialog.open(ImportarDialogComponent, {
          width: '350px',
          data: requisicion,
          hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe((inyectar: boolean) => {
          if (inyectar) {

              this.rest.searchRequisicion(requisicion).subscribe(
                  data => {

                      if (data) {
                          this.justificacion.requisicion = data.requisicion;
                          this.justificacion.proyecto = data.proyecto;
                          this.justificacion.descripcion = data.descripcion;
                          this.justificacion.autorizo_id = data.cve_responsable;
                          this.justificacion.elaboro_id = data.cve_solicitante;

                          /*
                          const partida: Partida[] = this.partidas.filter(p => p.id === data.partida);
                          if (partida && partida[0] && this.justificacion.tipo_id !== partida[0].tipo_id) {
                            this.justificacion.tipo_id = partida[0].tipo_id;
                            this.onTipoChanges(this.justificacion.tipo_id);
                          }
                          */

                          if (data.partida && this.partidas.some(p => p.id === data.partida)) {
                              this.justificacion.partida_id = data.partida;
                          } else {
                              this.msgsBar.open('Partida no encontrada', data.partida.toString(), {duration: 2000});
                          }

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

          /*
          const partida: Partida[] = this.partidas.filter(p => p.id === data.partida);
          if (partida && partida[0] && this.justificacion.tipo_id !== partida[0].tipo_id) {
            this.justificacion.tipo_id = partida[0].tipo_id;
            this.onTipoChanges(this.justificacion.tipo_id);
          }
          */

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

  /*
  canEditar(): boolean {
      const can = this.empleado.is_admin || this.justificacion.status === Estado.edicion;
      return can;
  }
  canEnviarCotiza(): boolean {
      return this.empleado.is_admin || this.justificacion.status === Estado.notificado;
  }
  isEdicion(): boolean {
      return this.justificacion.status === Estado.edicion;
  }

    statusTxt(): string {
        switch (this.justificacion.status) {
            case Estado.edicion: return 'Edición';
            case Estado.notificado: return 'Notificado';
            case Estado.aceptado: return 'Aceptado';
        }
    }
    */

  public isAdmin(): boolean {
        return this.globals.empleado && this.globals.empleado.is_admin;
  }
}

