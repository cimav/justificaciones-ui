import {Injectable, SecurityContext} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Empleado, Justificacion, Moneda, Partida, Proveedor, ProveedorNetmultix, Requisicion, Tipo} from './model';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {environment} from '../environments/environment';

const endpoint = environment.endpoint;

const httpOptions = {
  //     'Authorization': 'QURNSU5fUk9MRTphZG1pbg=='
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({providedIn: 'root'})
export class RestService {

  cachedEmpleado: Empleado;
  cachedEmpleados: Empleado[];
  cachedTipos: Tipo[];
  cachedMonedas: Moneda[];
  cachedPartidas: Partida[];
  cachedProveedoresNetmultix: ProveedorNetmultix[];

  constructor(private _http: HttpClient, public msgsBar: MatSnackBar, private router: Router) {
  }

  private extractData(res: Response) {
    const body = res;
    return body || { };
  }

  getEmpleado(cuenta: string): Observable<Empleado> {
      if (this.cachedEmpleado) {
          return of(this.cachedEmpleado);
      } else {
          return this._http.get(endpoint + 'empleados/cuenta/' + cuenta + '.json', httpOptions)
              .pipe(
                  map(this.extractData),
                  catchError(this.handleError<any>('getEmpleado'))
              );
      }
  }

  public getJustificaciones = (idEmpleado: number): Observable<Justificacion[]> => {

    return this._http.get<Justificacion[]>(endpoint + 'justificaciones/all_by_creador/' + idEmpleado + '.json',  httpOptions)
      .pipe(
        /*
        map( (response: Response) => {
          const justis = <Justificacion[]><any>response;
          return  justis;
        }),
        */
        catchError(this.handleError<any>('getJustificaciones'))
      );
  }

  getJustificacion(id: number): Observable<Justificacion> {
    // console.log('666 getJustificacion ' + ' : ' + id + ' *****************************************************************************');
    return this._http.get<Justificacion>(endpoint + 'justificaciones/' + id + '.json', httpOptions)
      .pipe(
        /*
        // map( this.extractData ),
        map((response: Response) => {
          console.log('666 Ok');
          const justi = <Justificacion><any>response;
          return  justi;
        }),
        */
        catchError((error, caught) => {
          // intercept the respons error and displace it to the console
          console.log(error);
          this.handleError<any>(error);
          return of(error);
        })

      );
  }

  public updateJustificacion = (justificacion: Justificacion): Observable<Justificacion> => {

    if (justificacion.autoriza_cargo.trim().length <= 0) {
      justificacion.autoriza_cargo = 'RESPONSABLE DEL PROYECTO';
    }

    const j =  JSON.stringify(justificacion);
    return this._http.put(endpoint + 'justificaciones/' + justificacion.id + '.json', j, httpOptions)
      .pipe(
        map( (response: Response) => {
          const justi = <Justificacion[]><any>response;
          return  justi;
        }),
        catchError(this.handleError<any>('updateJustificacion'))
      );
  }

  public getTipos = (): Observable<Tipo[]> => {
    if (this.cachedTipos) {
      return of(this.cachedTipos);
    } else {
      return this._http.get<Tipo[]>(endpoint + 'tipos.json', httpOptions)
        .pipe(
          map((response: Response) => {
            this.cachedTipos = <Tipo[]><any>response;
            return this.cachedTipos;
          }),
          catchError(this.handleError<any>('getTipos'))
        );
    }
  }

  public getMonedas = (): Observable<Moneda[]> => {
    if (this.cachedMonedas) {
      return of(this.cachedMonedas);
    } else {
      return this._http.get<Moneda[]>(endpoint + 'monedas.json', httpOptions)
        .pipe(
          map((response: Response) => {
            this.cachedMonedas = <Moneda[]><any>response;
            return this.cachedMonedas;
          }),
          catchError(this.handleError<any>('getMonedas'))
        );
    }
  }

  public getPartidas = (): Observable<Partida[]> => {
    if (this.cachedPartidas) {
      return of(this.cachedPartidas);
    } else {
      return this._http.get<Partida[]>(endpoint + 'partidas.json', httpOptions)
        .pipe(
          map((response: Response) => {
            this.cachedPartidas = <Partida[]><any>response;
            return this.cachedPartidas;
          }),
          catchError(this.handleError<any>('getPartidas'))
        );
    }
  }

  public getEmpleados = (): Observable<Empleado[]> => {
    if (this.cachedEmpleados) {
      return of(this.cachedEmpleados);
    } else {
      return this._http.get<Empleado[]>(endpoint + 'empleados.json', httpOptions)
        .pipe(
          map((response: Response) => {
            this.cachedEmpleados = <Empleado[]><any>response;
            return this.cachedEmpleados;
          }),
          catchError(this.handleError<any>('getEmpleados'))
        );
    }
  }

  public getProveedoresNetmultix = (): Observable<ProveedorNetmultix[]> => {
    if (this.cachedProveedoresNetmultix) {
      return of(this.cachedProveedoresNetmultix);
    } else {
      return this._http.get<ProveedorNetmultix[]>(endpoint + 'proveedores_netmultix.json', httpOptions)
        .pipe(
          map((response: Response) => {
            this.cachedProveedoresNetmultix = <ProveedorNetmultix[]><any>response;
            return this.cachedProveedoresNetmultix;
          }),
          catchError(
            this.handleError<any>('getProveedoresNetmultix')
          )
        );
    }
  }

  //   .shareReplay();

  public addJustificacion = (justificacion: Justificacion): Observable<Justificacion> => {
    const toAdd = JSON.stringify(justificacion);
    return this._http.post<Justificacion>(endpoint + 'justificaciones', toAdd, httpOptions)
      .pipe(
        /*
        map((response: Response) => {
          const result = <Justificacion><any>response;
          return result;
        }),
        */
        catchError(this.handleError<any>('addJustificacion'))
      );
  }

  public deleteJustificacion = (id: number): Observable<Response> => {
    return this._http.delete(endpoint + 'justificaciones/' + id + '.json', httpOptions)
      .pipe(
        map((response: Response) => {
          return response;
        }),
        catchError(this.handleError<any>('deleteJustificacion'))
      );
  }

  public getProveedoresOf = (justificacionId: number): Observable<Proveedor[]> => {

    return this._http.get<Proveedor[]>(endpoint + 'proveedores/by_justificacion/' + justificacionId + '.json',  httpOptions)
      .pipe(
        /*
        map( (response: Response) => {
          const proves = <Proveedor[]><any>response;
          return  proves;
        }),
        */
        catchError(this.handleError<any>('getProveedoresOf'))
      );
  }
  public addProveedor = (proveedor: Proveedor): Observable<Proveedor> => {
    const toAdd = JSON.stringify(proveedor);
    return this._http.post(endpoint + 'proveedores', toAdd, httpOptions)
      .pipe(
        map((response: Response) => {
          const result = <Proveedor><any>response;
          return result;
        }),
        catchError(this.handleError<any>('addProveedor'))
      );
  }
  public updateProveedor = (proveedor: Proveedor): Observable<Proveedor> => {

    return this._http.put(endpoint + 'proveedores/' + proveedor.id + '.json', JSON.stringify(proveedor), httpOptions)
      .pipe(
        map( (response: Response) => {
          const result = <Proveedor[]><any>response;
          return result;
        }),
        catchError(this.handleError<any>('updateProveedor'))
      );
  }
  public deleteProveedor = (id: number): Observable<Response> => {
    return this._http.delete(endpoint + 'proveedores/' + id + '', httpOptions)
      .pipe(
        map((response: Response) => {
          return response;
        }),
        catchError(this.handleError<any>('deleteProveedor'))
      );
  }

  getReplica(id: number, identificador: string): Observable<Justificacion> {

    return this._http.get(endpoint + 'justificaciones/replicar/' + id + '/' + identificador + '.json', httpOptions)
      .pipe(
        map( (response: Response) => {
          const replicada = <Justificacion[]><any>response;
          return  replicada;
        }),
        catchError(
          this.handleError<any>('getReplica')
        )
      );
  }

  searchRequisicion(requisicion: string): Observable<Requisicion> {
    requisicion = requisicion.replace(/[^0-9]/g, '0');
    return this._http.get<Requisicion>(endpoint + 'requisiciones_netmultix/search/' + requisicion + '.json', httpOptions)
      .pipe(
        // map( this.extractData ),
        catchError(this.handleError<any>('getRequisicion'))
      );
  }

  /*
  replacer(key, value) {
    if (key === 'type') {
      return undefined;
    }
    return value;
  }
  */

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      this.msgsBar.open(error.message, operation, {
        duration: 5000,
      });

      this.router.navigate(['/table']);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public getEndPoint(): string {
    return endpoint;
  }

}
