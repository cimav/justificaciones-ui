import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MAT_DATE_LOCALE, MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule, MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSlideToggleModule, MatProgressBarModule
} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, MatIconModule, MatCardModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSidenavModule, MatSelectModule, MatRadioModule, MatDatepickerModule, MatListModule,
    MatNativeDateModule, MatMomentDateModule, MatDividerModule, MatStepperModule, MatTooltipModule, MatGridListModule, MatDialogModule,
    MatChipsModule, MatProgressSpinnerModule, MatTabsModule, MatCheckboxModule, MatSnackBarModule, MatSortModule, MatBadgeModule,
    MatSlideToggleModule, MatProgressBarModule
  ],
  exports: [
    MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule, MatCardModule, MatTableModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatSidenavModule, MatSelectModule, MatRadioModule, MatDatepickerModule, MatNativeDateModule,
    MatMomentDateModule, MatDividerModule, MatStepperModule, MatTooltipModule, MatGridListModule, MatDialogModule, MatListModule,
    MatChipsModule, MatProgressSpinnerModule, MatTabsModule, MatCheckboxModule, MatSnackBarModule, MatSortModule, MatBadgeModule,
    MatSlideToggleModule, MatProgressBarModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    CurrencyPipe
  ],
  bootstrap: []
})
export class MaterialModule { }

