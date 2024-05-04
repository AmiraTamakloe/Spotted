/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '@app/components/header/header.component';
import { of } from 'rxjs';
// eslint-disable-next-line no-restricted-imports
import { GamesService } from '../game-page/game-page.component';
import { SelectionPageComponent } from './selection-page.component';
describe('SelectionPageComponent', () => {
    let component: SelectionPageComponent;
    let fixture: ComponentFixture<SelectionPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, FormsModule],
            declarations: [SelectionPageComponent, HeaderComponent],
            providers: [HttpClientModule, GamesService],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectionPageComponent);
        component = fixture.componentInstance;
        component.indexGame1 = 7;
        component.indexGame2 = 7;
        component.indexGame3 = 7;
        component.indexGame4 = 7;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should initiliaze the correct numberOfElement on init', () => {
        const numberOfElem = 10;

        spyOnProperty(component.gamesService, 'numberOfGames', 'get').and.returnValue(of(numberOfElem));

        component.ngOnInit();

        expect(component.numberOfElement).toEqual(numberOfElem);
    });

    it('leftNav should modify indexGames', () => {
        component.indexGame1 = 6;
        component.indexGame2 = 6;
        component.indexGame3 = 6;
        component.indexGame4 = 6;
        component.leftNav();
        expect(component.indexGame1).toEqual(2);
        expect(component.indexGame2).toEqual(2);
        expect(component.indexGame3).toEqual(2);
        expect(component.indexGame4).toEqual(2);
    });
    it('isRightDisabled should block rightNav', () => {
        component.numberOfElement = 8;
        expect(component.isRightDisabled()).toEqual(true);
    });
    it('rightNav should modify indexGames', () => {
        component.numberOfElement = 7;
        component.rightNav();
        fixture.detectChanges();
        expect(component.indexGame1).toEqual(11);
        expect(component.indexGame2).toEqual(11);
        expect(component.indexGame3).toEqual(11);
        expect(component.indexGame4).toEqual(11);
    });
});
