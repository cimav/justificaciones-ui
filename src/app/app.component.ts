import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Justificacion} from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  justificacion_id: number;

  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

  justificacionIdChanged(justificacion_id) {
    this.justificacion_id = justificacion_id;
  }

}
