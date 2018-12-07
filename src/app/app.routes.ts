import { Routes } from '@angular/router';
import {CallbackComponent} from './auth/callback.component';
import {TableComponent} from './table.component';

export const ROUTES: Routes = [
  { path: '', component: TableComponent },
  /*
  { path: 'table', component: TableComponent },
  { path: 'edit/:id', component: EditComponent },*/
  { path: 'callback', component: CallbackComponent },
  { path: '**', redirectTo: '' }
];
