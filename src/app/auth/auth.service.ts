import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import {environment} from '../../environments/environment';

(window as any).global = window;

const options = {
    language: 'es',
    theme: {
        logo: 'http://justificaciones.cimav.edu.mx/assets/img/logo-cimav.png',
        primaryColor: '#31324F'
    },
    languageDictionary: {
        title: 'Autentificarse con cuenta de Cimav'
    }
};

@Injectable()
export class AuthService {

  auth0 = new auth0.WebAuth({
      audience: 'organize',
    clientID: 'IRPUwl406FAAq6zd4QWEZKUFAH8of29G',
    domain: 'cimav.auth0.com',
    responseType: 'token id_token',
    redirectUri: environment.redirectUri // 'http://localhost:4200'
    // redirectUri: 'http://justificador.cimav.edu.mx/v6'
  });

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken ) {
        if (authResult.idTokenPayload.email.includes('@cimav.edu.mx')) {
          this.setSession(authResult);
        } else {
          alert(`Error: Esta intentando entrar con una cuenta que no es del Cimav
            ${authResult.idTokenPayload.email}`);
        }
        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('idTokenPayload', JSON.stringify(authResult.idTokenPayload));
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('idTokenPayload');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

  public getCuenta(): string {
    return JSON.parse(localStorage.idTokenPayload)['nickname'];
  }

}
