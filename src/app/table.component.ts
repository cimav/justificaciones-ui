import {Component, EventEmitter, OnInit, Output, Pipe, PipeTransform, ViewChild} from '@angular/core';
import { AuthService } from './auth/auth.service';
import {RestService} from './rest.service';
import {Empleado, Justificacion, Moneda, Partida, Proveedor, Tipo} from './model';
import {MatDialog, MatProgressBar, MatSort, MatTableDataSource} from '@angular/material';
import {CrearDialogComponent} from './dialogs/crear.dialog.component';
import {EliminarDialogComponent} from './dialogs/eliminar.dialog.component';
import {ReplicarDialogComponent} from './dialogs/replicar.dialog.component';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Output() justificacionIdChange = new EventEmitter();

  empleado: Empleado;
  dataSource: MatTableDataSource<Justificacion>;
  displayedColumns: string[] = []; // 'identificador', 'requisicion', 'creador_cuenta_cimav', 'descripcion', 'acciones'];
  row_hover = 0;
  filterValue = '';

  @ViewChild(MatSort) sort: MatSort;

  valueBuffer = 0;
  esAsistente = false;

  // public router: Router,
  constructor(public auth: AuthService, public rest: RestService, public dialog: MatDialog) { }

  ngOnInit() {
    this.empleado = null;
    this.rest.getEmpleado(this.auth.getCuenta()).subscribe( (response: Empleado) => {
      this.empleado = response;
      this.getJustificaciones();
    }, error => {
      console.log('DB NO CONECTADA ' + this.auth.getCuenta() + ' :::  ' + error);
    }, () => {
      console.log('Get Single Empleado:' + this.empleado.cuenta_cimav);
    });
  }

  private getJustificaciones() {
    this.rest.getJustificaciones(this.empleado.id).subscribe((response: Justificacion[]) => {

      this.valueBuffer = 0;

      const justificaciones: Justificacion[] = response;

      this.esAsistente = justificaciones.filter(jus => jus.creador_id !== this.empleado.id).length > 0;
      if (this.esAsistente) {
        this.displayedColumns = ['identificador', 'requisicion', 'creador_cuenta_cimav', 'fecha_elaboracion', 'descripcion', 'acciones'];
      } else {
        this.displayedColumns = ['identificador', 'requisicion', 'fecha_elaboracion', 'descripcion', 'acciones'];
      }

      this.dataSource = new MatTableDataSource(justificaciones); // .slice(0, 2)
      this.dataSource.filterPredicate = function(data, filter: string): boolean {
        const str = data.identificador + ' ' + data.creador_cuenta_cimav + ' '  + data.requisicion + ' ' + data.descripcion;
        const terms = filter.trim();

        // para OR
        // filter = filter.split(/\W+/).join('|');
        // const rex = new RegExp('(?:' + filter + ')', 'gi');

        // para AND
        let expre = '';
        for (const term of terms.split(/\W+/)) {
          expre = expre + '(?=.*' + term + ')';
        }
        const rex = new RegExp('^' + expre + '.+', 'mgi');

        const result = str.match(rex);

        /*
        const expre = '(' + terms.split(/\W+/).join(')|(') + ')';
        const rex = new RegExp('' + expre + '', 'gi');
        const result = str.match(rex);
        */
        /*
        console.log('---------------');
        console.log('expre> ', expre);
        console.log('  rex> ', rex);
        console.log('  str> ', str);
        console.log('  res> ', result);
        */
        return result != null;
      };
      this.dataSource.sort = this.sort;
    }, error => {
      console.log('DB NO CONECTADA ' + this.auth.getCuenta() + ' :::  ' + error);
    }, () => {
      console.log('Get Justificaciones:' + this.dataSource.data.length);

      this.valueBuffer = 100;
    });
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  justificacionChanged(event: Event, justificadorId: number) {
    if (event) {
        event.stopPropagation();
    }

    // this.router.navigate(['/edit', justificadorId]);
    this.justificacionIdChange.emit(justificadorId);
  }

  truncate(desc: string, n: number): string {
    return (desc.length > n) ? desc.substr(0, n - 1) + '...' : desc;
  }

  rowHover(num: number) {
    this.row_hover = num;
  }

  openCrearDialog(): void {
    const dialogRef = this.dialog.open(CrearDialogComponent, {
      width: '300px', hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const nuevaJustificacion: Justificacion = new Justificacion();

        nuevaJustificacion.identificador = result;

        nuevaJustificacion.creador = this.empleado;
        nuevaJustificacion.creador_id = this.empleado.id;

        nuevaJustificacion.elaboro = this.empleado;
        nuevaJustificacion.elaboro_id = this.empleado.id;

        nuevaJustificacion.autorizo = this.empleado;
        nuevaJustificacion.autorizo_id = this.empleado.id;

        const tipo1: Tipo = new Tipo();
        tipo1.id = 1 ;
        nuevaJustificacion.tipo = tipo1;
        nuevaJustificacion.tipo_id = tipo1.id;

        const mon1: Moneda = new Moneda();
        mon1.id = 1;
        nuevaJustificacion.moneda = mon1;
        nuevaJustificacion.moneda_id = mon1.id;

        const partida22104: Partida =  new Partida();
        partida22104.id = 22104;
        nuevaJustificacion.partida = partida22104;
        nuevaJustificacion.partida_id = partida22104.id;

        nuevaJustificacion.autoriza_cargo = 'RESPONSABLE DEL PROYECTO';

        /*
        nuevaJustificacion.prov1_fuente = 0;
        nuevaJustificacion.prov1_monto = 0.00;
        nuevaJustificacion.prov1_es_nacional = true;

        nuevaJustificacion.prov2_fuente = 0;
        nuevaJustificacion.prov2_monto = 0.00;
        nuevaJustificacion.prov2_es_nacional = true;

        nuevaJustificacion.prov3_fuente = 1;
        nuevaJustificacion.prov3_monto = 0.00;
        nuevaJustificacion.prov3_es_nacional = true;
        */

        let id_creada = 0;
        this.rest.addJustificacion(nuevaJustificacion).subscribe((responseCreada: Justificacion) => {
            id_creada = responseCreada.id;

            this.getJustificaciones();
          },
          error => console.log('Error agregando! ' + error),
          () => {
            console.log('Add Single Justificacion: ' + id_creada);

              this.justificacionChanged(null, id_creada);

            // this.router.navigate(['/edit', id_creada]);
          }
        );
      }
    });
  }

  openEliminarDialog(event: Event, _id: number, _identificador: string): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(EliminarDialogComponent, {
      width: '400px',
      data: {id: _id, identificador: _identificador, titulo: 'justificación'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Eliminar: ', result);
        this.rest.deleteJustificacion(result).subscribe(
          data => {
            console.log ('Data borrando');
          },
          error => { console.log ('Error borrando');
          }, () => {
            console.log('Borrado');

            this.getJustificaciones();
          }
        );
      }
    });
  }

  openReplicarDialog(event: Event, justi: Justificacion): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ReplicarDialogComponent, {
      width: '450px',
      data: {'id': justi.id, 'identificador': justi.identificador}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Replicar: ', result);

        let replica_id = 0;
        this.rest.getReplica(justi.id, result).subscribe((response: Justificacion) => {
            this.getJustificaciones();
            replica_id = response.id;
          },
          error => console.log('Error replicando! ' + error),
          () => {

            this.justificacionChanged(null, replica_id);

            console.log('Replicar Justificacion: ' + replica_id);

            // this.router.navigate(['/edit', replica_id]);
          }
        );
        /*
          const replicada: Justificacion = Object.assign({}, result);
          replicada.id = null;

          this.rest.addJustificacion(replicada).subscribe((responseCreada: Justificacion) => {
              this.getJustificaciones();
              this.router.navigate(['/edit', responseCreada.id]);
            },
            error => console.log('Error agregando! ' + error),
            () => {
              console.log('Add Single Justificacion: ' );
            }
          );
        */
      }
    });
  }

  showCreador() {
    if (this.esAsistente) {
      return 'display';
    } else {
      return 'none';
    }
  }

}

@Pipe({
  name: 'highlight'
})

export class HighlightSearch implements PipeTransform {
  public ch = true;
  constructor(private domSanitizer: DomSanitizer) {}
  transform(value: string, args: string): SafeHtml {
    if (args && value) {
      value = String(value); // make sure its a string
      args = args.trim();
      args = args.split(/\W+/).join('|');
      const rex = new RegExp('(?:' + args + ')', 'gi');
      const remp = value.replace(rex, this.markTheMatch);
      return this.domSanitizer.bypassSecurityTrustHtml(remp);
    }
    return value;
  }

  markTheMatch(match) {
    return '<strong style="background-color:Orange;">' + match  + '</strong>';
  }

}
