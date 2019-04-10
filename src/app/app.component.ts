import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Empleado} from './model';
import {RestService} from './rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  justificacion_id: number;

  constructor(public auth: AuthService, private rest: RestService) {
    auth.handleAuthentication();
  }

  justificacionIdChanged(justificacion_id) {
    this.justificacion_id = justificacion_id;
  }

  ngOnInit() {
      /*
      console.log('3> Init');
      this.empleado = null;
      this.rest.getEmpleado(this.auth.getCuenta()).subscribe((response: Empleado) => {
          this.empleado = response;
      }, error => {
          console.log('DB NO CONECTADA ' + this.auth.getCuenta() + ' :::  ' + error);
      }, () => {
          console.log('Get Single Empleado:' + this.empleado.cuenta_cimav + ' > ' + this.empleado.is_admin);
      });
      */
  }

  /*
  subtitle(): string {
      if (this.empleado) {
          if (this.empleado.is_admin) {
              return 'Administrador';
          } else if (this.empleado.is_asistente) {
              return 'Asistente';
          } else {
              return '';
          }
      } else {
          return '...';
      }
  }
  */

}
