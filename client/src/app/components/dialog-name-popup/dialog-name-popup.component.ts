import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
@Component({
    selector: 'app-dialog-name-popup',
    templateUrl: './dialog-name-popup.component.html',
    styleUrls: ['./dialog-name-popup.component.scss'],
})
export class DialogNamePopupComponent implements AfterViewInit {
    @ViewChild('canvasContainer', { static: false }) canvasContainer: ElementRef;
    descriptionInput = new FormControl('', [Validators.required]);
    nameInput = new FormControl('', [Validators.required]);
    diff: number;
    gameName = '';
    forbiddenName = ['undefine', 'none', 'delete', 'new'];
    constructor(public dialogRef: MatDialogRef<DialogNamePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: Data) {}

    ngAfterViewInit(): void {
        if (this.data.canvas instanceof Node) {
            this.canvasContainer.nativeElement.appendChild(this.data.canvas);
        }
        this.diff = this.data.numDiff;
    }

    getError(field: string) {
        if (field === 'descriptionInput' && this.descriptionInput.hasError('required')) {
            return 'Vous ne pouvez pas avoir aucune description!';
        }
        if (field === 'nameInput' && this.nameInput.hasError('required')) {
            return 'Vous ne pouvez pas avoir un nom vide voyons!';
        }
        return '';
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
