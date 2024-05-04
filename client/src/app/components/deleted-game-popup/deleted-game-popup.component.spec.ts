import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedGamePopupComponent } from './deleted-game-popup.component';

describe('DeletedGamePopupComponent', () => {
    let component: DeletedGamePopupComponent;
    let fixture: ComponentFixture<DeletedGamePopupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeletedGamePopupComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DeletedGamePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
