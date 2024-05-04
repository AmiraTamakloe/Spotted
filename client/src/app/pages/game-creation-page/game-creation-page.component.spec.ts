import { Overlay } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_SCROLL_STRATEGY, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GameCreationAreaComponent } from '@app/components/game-creation-area/game-creation-area.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { GamesService } from '@app/pages/game-page/game-page.component';
import { GameCreationPageComponent } from './game-creation-page.component';

describe('GameCreationPageComponent', () => {
    let component: GameCreationPageComponent;
    let fixture: ComponentFixture<GameCreationPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatDialogModule],
            declarations: [GameCreationPageComponent, PlayAreaComponent, GameCreationAreaComponent],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            providers: [MatDialog, Overlay, GamesService, HttpClient, HttpHandler, { provide: MAT_DIALOG_SCROLL_STRATEGY, useValue: () => {} }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameCreationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
