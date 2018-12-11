import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CallbackComponent} from './auth/callback.component';
import {AuthService} from './auth/auth.service';
import {RouterModule} from '@angular/router';
import {ROUTES} from './app.routes';
import {HttpClientModule} from '@angular/common/http';
import {HighlightSearch, TableComponent} from './table.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {CrearDialogComponent} from './dialogs/crear.dialog.component';
import {EliminarDialogComponent} from './dialogs/eliminar.dialog.component';
import {ReplicarDialogComponent} from './dialogs/replicar.dialog.component';
import {SearchProveedorDialogComponent} from './dialogs/search-proveedor-dialog.component';
import {EditComponent} from './edit.component';
import {ProveedorDialogComponent} from './dialogs/proveedor.dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    SearchProveedorDialogComponent, CrearDialogComponent, EliminarDialogComponent, ReplicarDialogComponent, ProveedorDialogComponent,
    EditComponent,
    CallbackComponent,
    HighlightSearch
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    CurrencyMaskModule
  ],
  entryComponents: [SearchProveedorDialogComponent, CrearDialogComponent, EliminarDialogComponent, ReplicarDialogComponent, ProveedorDialogComponent],

  providers: [
    AuthService,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }