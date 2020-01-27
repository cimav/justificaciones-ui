import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {RestService} from '../rest.service';

@Component({
    selector: 'app-agregar-anexo-dialog',
    templateUrl: './agregar.anexos.dialog.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AgregarAnexosDialogComponent {

    fileData: File = null;
    previewUrl: any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;

    constructor(public dialogRef: MatDialogRef<AgregarAnexosDialogComponent>, private http: HttpClient, private rest: RestService,
                @Inject(MAT_DIALOG_DATA) public justi_id: number) {}

    fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
    }

    agregar() {
        const formData = new FormData();
        formData.append('anexos', this.fileData);
        this.rest.agregarAnexo(this.justi_id, formData).subscribe((response: any) => {
            // setTimeout( () => { /*Your Code*/ }, 17000 );
        }, error => {
            console.log('Error agregarAnexo: ' + error);
        }, () => {
            console.log('Ok agregarAnexo:' + this.justi_id);

            this.dialogRef.close('ok');
        });
    }


    onNoClick(): void {
        this.dialogRef.close(null);
    }


}
