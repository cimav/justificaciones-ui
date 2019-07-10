import { Injectable } from '@angular/core';
import {Empleado} from './model';

@Injectable()
export class Globals {
    empleado: Empleado = null;
}