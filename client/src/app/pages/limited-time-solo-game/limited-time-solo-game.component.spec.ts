import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildrenOutletContexts, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '@app/services/games/games.service';
import { LimitedTimeSoloGameComponent } from './limited-time-solo-game.component';

describe('LimitedTimeSoloGameComponent', () => {
    let component: LimitedTimeSoloGameComponent;
    let fixture: ComponentFixture<LimitedTimeSoloGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LimitedTimeSoloGameComponent],
            providers: [GamesService, UrlSerializer, ChildrenOutletContexts],
            imports: [HttpClientModule, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(LimitedTimeSoloGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
