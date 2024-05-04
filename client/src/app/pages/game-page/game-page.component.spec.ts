/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-types */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, ChildrenOutletContexts, Router, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { HintsComponent } from '@app/components/hints/hints.component.spec';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { StopwatchComponent } from '@app/components/stopwatch/stopwatch.component';
import { DifferencesAlgorithmService } from '@app/services/differences-algorithm/differences-algorithm.service';
import { DifferencesMatrixService } from '@app/services/differences-matrix/differences-matrix.service';
import { Game } from '@app/services/games/games.model';
import { ModeSoloService } from '@app/services/mode-solo/mode-solo.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { SEVEN } from '@common/global-constants';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { GamePageComponent, GamesService } from './game-page.component';

class SocketClientServiceMock extends SocketClientService {
    override connect() {}
}

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let mockActivatedRoute: unknown;
    let fakeGamesService: unknown;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let router: Router;
    let fakeGame: Game;
    let event: Event;

    beforeEach(async () => {
        fakeGame = {
            _id: 'patate',
            title: 'patate',
            difficulty: 'patate',
            description: 'patate',
            solo: [
                { name: 'patate', score: 'patate' },
                { name: 'patate', score: 'patate' },
                { name: 'patate', score: 'patate' },
            ],
            multiplayer: [
                { name: 'patate', score: 'patate' },
                { name: 'patate', score: 'patate' },
                { name: 'patate', score: 'patate' },
            ],
            srcClickable: 'patate',
            srcModified: 'patate',
            srcOriginal: 'patate',
            numberOfDiff: 7,
            arrDiff: [][1],
        };
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: () => '1',
                },
            },
        };

        fakeGamesService = {
            index: 1,
            getGameById: jasmine.createSpy().and.returnValue(
                of({
                    id: '1',
                    srcOriginal: 'image1.jpg',
                    srcModified: 'image2.jpg',
                    differences: '7',
                }),
            ),
        };

        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, PlayAreaComponent, StopwatchComponent, ChatBoxComponent, HintsComponent],
            imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: GamesService, useValue: fakeGamesService },
                DifferencesMatrixService,
                DifferencesAlgorithmService,
                ModeSoloService,
                HttpClientModule,
                UrlSerializer,
                ChildrenOutletContexts,
                { provide: SocketClientService, useValue: socketServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        component.game = fakeGame;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call navigate of route with good things', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToDynamicRoute('Mellon');
        expect(navigateSpy).toHaveBeenCalledWith(['Mellon']);
    });

    it('should initialize game on init', () => {
        expect(component.game).not.toBeUndefined();
        expect(component.game._id).not.toBeUndefined();
        expect(component.game._id).toEqual('patate');
        expect(component.game.srcOriginal).toEqual('patate');
        expect(component.game.srcModified).toEqual('patate');
    });

    it('should return false when game is defined and number of differences found is equal to total number of differences', () => {
        component.game = fakeGame;
        spyOn(component.modeSoloService, 'getNumberOfDifferences').and.returnValue(SEVEN);
        expect(component.endGame()).toBeFalse();
    });

    it('should return false when game is not defined', () => {
        component.game = undefined;
        expect(component.endGame()).toBeFalse();
    });

    it('should return false when finalTime is not defined', () => {
        component.finalTime = undefined;
        expect(component.endGame()).toBeFalse();
    });

    it('should call receiveTime', () => {
        component.receiveTime('ok');
        expect(component.finalTime).toBe((event.target as HTMLInputElement).value);
    });

    it('should call receiveBestTime and enter first loop', () => {
        const arrayTest = ['test', '2'];
        component.finalArray = [['0', '2'], arrayTest];
        component.receiveBestTime(arrayTest);
        component.finalArray[0] = arrayTest;
        expect(component.finalArray[0]).toBe(arrayTest);
    });

    it('should call receiveBestTime and enter second loop', () => {
        const arrayTest = ['test', '2'];
        component.finalArray = [['1', '2'], arrayTest];
        component.receiveBestTime(arrayTest);
        expect(component.finalArray[1]).toBe(arrayTest);
    });

    it('should navigate to selection route and send leave message to socket', () => {
        spyOn(component.socketClientService, 'send');
        spyOn(component, 'navigateToDynamicRoute');
        component.leaveGame();
        expect(component.navigateToDynamicRoute).toHaveBeenCalledWith('selection');
    });

    it('should navigate to home route and send leave message to socket', () => {
        spyOn(component.socketClientService, 'send');
        spyOn(component, 'navigateToDynamicRoute');
        component.goHome();
        expect(component.navigateToDynamicRoute).toHaveBeenCalledWith('home');
    });

    it('should initialize game on init', () => {
        spyOn(component.gamesService, 'gameById').and.returnValue(of(fakeGame));
        component.ngOnInit();
        expect(component.game).toEqual(fakeGame);
    });

    it('should get game on after view init', () => {
        spyOn(component.gamesService, 'gameById').and.returnValue(of(fakeGame));
        component.gettingGame();
        expect(component.game).toEqual(fakeGame);
        expect(component.arrayDiff).toEqual(fakeGame.arrDiff);
        expect(component.differences).toEqual(fakeGame.numberOfDiff);
    });
    it('should set the userName property', () => {
        const mockUserName = 'mock_user_name';
        spyOn(component.socketClientService, 'on').and.callFake((eventName: string, callback: Function) => {
            if (eventName === 'userNameCreated') {
                callback(mockUserName);
            }
        });
        component.ngOnInit();
        expect(component.userName).toBe('mock_');
    });
});
