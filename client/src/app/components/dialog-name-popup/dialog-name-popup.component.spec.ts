import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogNamePopupComponent } from './dialog-name-popup.component';
describe('DialogNamePopupComponent', () => {
    let component: DialogNamePopupComponent;
    let fixture: ComponentFixture<DialogNamePopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
            declarations: [DialogNamePopupComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogNamePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return an error for empty name', () => {
        component.nameInput.setValue('');
        expect(component.getError('nameInput')).toEqual('Vous ne pouvez pas avoir un nom vide voyons!');
    });

    it('should return an error for empty description', () => {
        component.descriptionInput.setValue('');
        expect(component.getError('descrInput')).toEqual('Vous ne pouvez pas avoir aucune description!');
    });
    it('should return nothing when no errors occurs', () => {
        component.descriptionInput.setValue('Amira');
        expect(component.getError('descrInput')).toEqual('');
    });

    it('should close the dialog when onCancel is called', () => {
        const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        const onCancelComponent = new DialogNamePopupComponent(dialogRefSpy, null);
        onCancelComponent.onCancel();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });

    it('should append the canvas element to the canvasContainer', () => {
        const canvas = document.createElement('canvas');
        spyOn(component.canvasContainer.nativeElement, 'appendChild');
        component.data.canvas = canvas;
        fixture.detectChanges();
        component.ngAfterViewInit();
        expect(component.canvasContainer.nativeElement.appendChild).toHaveBeenCalledWith(canvas);
    });
});
