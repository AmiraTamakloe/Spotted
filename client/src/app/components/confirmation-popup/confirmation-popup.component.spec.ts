import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationPopupComponent } from './confirmation-popup.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('ConfirmationPopupComponent', () => {
    let component: ConfirmationPopupComponent;
    let fixture: ComponentFixture<ConfirmationPopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConfirmationPopupComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { title: 'titre', message: 'message' } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmationPopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should have the correct data values', () => {
        const title = 'titre';
        const message = 'message';
        expect(component.data.title).toBe(title);
        expect(component.data.message).toBe(message);
    });
});
