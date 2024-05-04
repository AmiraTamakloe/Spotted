import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildrenOutletContexts, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GamesService } from '@app/services/games/games.service';
import { LimitedTimeWaitlistComponent } from './limited-time-waitlist.component';

describe('LimitedTimeWaitlistComponent', () => {
    let component: LimitedTimeWaitlistComponent;
    let fixture: ComponentFixture<LimitedTimeWaitlistComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LimitedTimeWaitlistComponent],
            providers: [GamesService, UrlSerializer, ChildrenOutletContexts],
            imports: [HttpClientModule, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(LimitedTimeWaitlistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
