/* eslint-disable @typescript-eslint/ban-types */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, ChildrenOutletContexts, Router, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { HintsComponent } from '@app/components/hints/hints.component';
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
import { GamesService, ReplayPageComponent } from './replay-page.component';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('ReplayPageComponent', () => {
    let component: ReplayPageComponent;
    let fixture: ComponentFixture<ReplayPageComponent>;
    let mockActivatedRoute: unknown;
    let fakeGamesService: unknown;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let router: Router;
    let fakeGame: Game;

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
            declarations: [ReplayPageComponent, PlayAreaComponent, StopwatchComponent, ChatBoxComponent, HintsComponent],
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
        fixture = TestBed.createComponent(ReplayPageComponent);
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
        // eslint-disable-next-line no-underscore-dangle
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

    it('should navigate to selection route and send leave message to socket', () => {
        spyOn(component.socketClientService, 'send');
        spyOn(component, 'navigateToDynamicRoute');
        component.leaveGame();
        expect(component.socketClientService.send).toHaveBeenCalledWith('leave');
        expect(component.navigateToDynamicRoute).toHaveBeenCalledWith('selection');
    });

    it('should navigate to home route and send leave message to socket', () => {
        spyOn(component.socketClientService, 'send');
        spyOn(component, 'navigateToDynamicRoute');
        component.goHome();
        expect(component.socketClientService.send).toHaveBeenCalledWith('leave');
        expect(component.navigateToDynamicRoute).toHaveBeenCalledWith('home');
    });

    it('should initialize game on init', () => {
        spyOn(component.gamesService, 'gameById').and.returnValue(of(fakeGame));
        component.ngOnInit();
        expect(component.game).toEqual(fakeGame);
    });

    it('should set the userName property', () => {
        const mockUserName = 'mock_user_name';
        spyOn(component.socketClientService, 'on').and.callFake((eventName: string, callback: Function) => {
            if (eventName === 'userNameCreated') {
                callback(mockUserName);
            }
        });
        component.ngOnInit();
        expect(component.userName1).toBe('mock_');
    });
});
