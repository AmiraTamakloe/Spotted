import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildrenOutletContexts, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '@app/services/games/games.service';
import { LimitedTimeMultiplayerGameComponent } from './limited-time-multiplayer-game.component';

describe('LimiteTimeMultiplayerGameComponent', () => {
    let component: LimitedTimeMultiplayerGameComponent;
    let fixture: ComponentFixture<LimitedTimeMultiplayerGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LimitedTimeMultiplayerGameComponent],
            providers: [GamesService, UrlSerializer, ChildrenOutletContexts],
            imports: [HttpClientModule, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(LimitedTimeMultiplayerGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
