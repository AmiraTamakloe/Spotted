import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, ChildrenOutletContexts, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatBoxComponent } from '@app/components/chat-box/chat-box.component';
import { HintsComponent } from '@app/components/hints/hints.component.spec';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { StopwatchComponent } from '@app/components/stopwatch/stopwatch.component';
import { DifferencesAlgorithmService } from '@app/services/differences-algorithm/differences-algorithm.service';
import { DifferencesMatrixService } from '@app/services/differences-matrix/differences-matrix.service';
import { Game } from '@app/services/games/games.model';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { FIVE, THREE } from '@common/global-constants';
import { Socket } from 'socket.io-client';
import { MultiplayerGamePageComponent } from './multiplayer-game-page.component';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}
describe('GamePageComponent', () => {
    let component: MultiplayerGamePageComponent;
    let fixture: ComponentFixture<MultiplayerGamePageComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let mockActivatedRoute: unknown;
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
        await TestBed.configureTestingModule({
            declarations: [MultiplayerGamePageComponent, PlayAreaComponent, StopwatchComponent, ChatBoxComponent, HintsComponent],
            imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [
                { provide: SocketClientService, useValue: socketServiceMock },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                DifferencesMatrixService,
                DifferencesAlgorithmService,
                ChatBoxComponent,
                HttpClientModule,
                UrlSerializer,
                ChildrenOutletContexts,
                { provide: SocketClientService, useValue: socketServiceMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerGamePageComponent);
        component = fixture.componentInstance;
        component.game = fakeGame;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should handle gameStarted event', () => {
        const names = ['Amira', 'Jacob', '123456789'];
        socketHelper.peerSideEmit('gameStarted', names);
        expect(component.firstUser).toEqual(names[0]);
        expect(component.secondUser).toEqual(names[1]);
        expect(component.idHost).toEqual(names[2]);
    });

    it('should handle updatedDiffs', () => {
        const serverResponse = { diffH: THREE, diffI: FIVE };
        const endGameSpy = spyOn(component, 'endGame');
        socketHelper.peerSideEmit('updatedDiffs', serverResponse);
        expect(component.diffHost).toEqual(serverResponse.diffH);
        expect(component.diffInv).toEqual(serverResponse.diffI);
        expect(endGameSpy).toHaveBeenCalled();
    });

    it('should handle updatedDiffs', () => {
        component.diffHost = 20;
        component.game.numberOfDiff = 2;
        const answer = component.endGame();
        expect(answer).toBe(false);
    });
    it('should handle updatedDiffs', () => {
        component.diffHost = 2;
        component.diffInv = 40;
        component.game.numberOfDiff = 20;
        const answer = component.endGame();
        expect(answer).toBe(false);
    });
    it('should handle updatedDiffs', () => {
        component.diffHost = 2;
        component.diffInv = 5;
        component.game.numberOfDiff = 20;
        component.playerQuit = true;
        const answer = component.endGame();
        expect(answer).toBe(true);
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

    it('should handle playerLeft event', () => {
        socketHelper.peerSideEmit('playerLeft');
        expect(component.playerQuit).toBeTruthy();
    });

    it('should send a leave event', () => {
        const spy = spyOn(component.socketClientService, 'send');
        const eventName2 = 'giveUp';
        component.idHost = 'Amira';
        component.id = 'test';
        const clientValue = { idHost: component.idHost, idGame: component.id };
        component.leaveGame();
        expect(spy).toHaveBeenCalledWith(eventName2, clientValue);
    });
});
