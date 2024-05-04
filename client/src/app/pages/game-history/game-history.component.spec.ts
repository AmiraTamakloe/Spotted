import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { GameHistoryComponent } from './game-history.component';

describe('GameHistoryComponent', () => {
    let component: GameHistoryComponent;
    let fixture: ComponentFixture<GameHistoryComponent>;

    const dialogMock = {
        open: jasmine.createSpy('open').and.returnValue({
            afterClosed: () => of(true),
        }),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameHistoryComponent],
            imports: [HttpClientTestingModule, MatDialogModule],
            providers: [{ provide: MatDialog, useValue: dialogMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(GameHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call refreshHistoryList on init', () => {
        const refreshHistoryListSpy = spyOn(component, 'refreshHistoryList');
        component.ngOnInit();
        expect(refreshHistoryListSpy).toHaveBeenCalled();
    });
});
