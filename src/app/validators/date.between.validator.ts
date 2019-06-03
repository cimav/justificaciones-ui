import {AbstractControl, ValidatorFn} from '@angular/forms';
import {Justificacion} from '../model';
import * as moment from 'moment';

// https://dzone.com/articles/how-to-create-custom-validators-in-angular

export function ageRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value !== undefined && (isNaN(control.value) || control.value < 18 || control.value > 45)) {
        return { 'ageRange': true };
    }
    return null;
}

export function dateBetweenValidator(control: AbstractControl): { [key: string]: boolean } | null {
    // control.value.isBetween('2019-04-09', '2019-04-09', null, '[]')
    /*
    if (control.value !== undefined && isNaN(control.value)) {
        return { 'dateBetween': true };
    }
    */
    if (control) {
        const isValid = control.get('fCotizarCtrl').value >= control.get('fMercadoCtrl').value;
        if (isValid) {
            return null;
        } else {
            return  { 'dateBetween': true };
        }
    }    return null;
}

export function dateBetweenValidator3(controlStart: AbstractControl, controlEnd: AbstractControl): ValidatorFn {
    return (control: AbstractControl): {[key: string]: boolean} | null => {
        /*
        if (control.value === undefined || !control.value.isValid
            || controlStart.value === undefined || !controlStart.value.isValid
            || controlEnd.value === undefined || !controlEnd.value.isValid) {
            return { 'dateWrong': true };
        }
        if (!control.value.isBetween(controlStart.value, controlEnd.value, null, '[)')) {
            return  { 'dateBetween': true };
        }
        */
        return null;
    };
}

export function dateBetweenValidator4(justificacion: Justificacion): ValidatorFn {
    return (control: AbstractControl): {[key: string]: boolean} | null => {
        if (justificacion === undefined) {
            return null;
        }
        if (justificacion.fecha_cotizar === undefined || !moment.isDate(justificacion.fecha_cotizar)) {
            return { 'fechaCotizarWrong': true };
        }
        if (justificacion.fecha_mercado === undefined || !moment.isDate(justificacion.fecha_mercado)) {
            return { 'fechaMercadoWrong': true };
        }
        if (justificacion.fecha_elaboracion === undefined || !moment.isDate(justificacion.fecha_elaboracion)) {
            return { 'fechaEmisionWrong': true };
        }
        /*
        if (!control.value.isBetween(justificacion., controlEnd.value, null, '[)')) {
            return  { 'dateBetween': true };
        }
        */
        return null;
    };
}

export function dateBetweenValidator2(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: boolean} | null => {
        if (control) {
            const isValid = control.get('fCotizarCtrl').value >= control.get('fMercadoCtrl').value;
            if (isValid) {
                return null;
            } else {
                return  { 'dateBetween': true };
            }
        }
        /*
        if (!control.value.isBetween(justificacion., controlEnd.value, null, '[)')) {
            return  { 'dateBetween': true };
        }
        */
        return null;
    };
}