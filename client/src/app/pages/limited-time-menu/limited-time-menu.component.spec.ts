import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { LimitedTimeMenuComponent } from './limited-time-menu.component';

describe('LimitedTimeMenuComponent', () => {
    let component: LimitedTimeMenuComponent;
    let fixture: ComponentFixture<LimitedTimeMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, MatDialogModule],
            declarations: [LimitedTimeMenuComponent],
            providers: [{ provide: MatDialogRef, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(LimitedTimeMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
