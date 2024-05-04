import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { BehaviorSubject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { GameComponent } from './game.component';
class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('GameComponent', () => {
    let component: GameComponent;
    let fixture: ComponentFixture<GameComponent>;
    let fakeGame: Game;
    let testEqual: BehaviorSubject<string>;
    let router: Router;
    let socketClientService: SocketClientService;
    let socketServiceMock: SocketClientServiceMock;
    let gameSet: GamesService;
    let socketHelper: SocketTestHelper;

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
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        testEqual = new BehaviorSubject<string>('');
        testEqual.next('Chartreuse cest miam');
        await TestBed.configureTestingModule({
            declarations: [GameComponent],
            imports: [HttpClientModule, MatDialogModule, RouterTestingModule.withRoutes([])],
            providers: [
                MatDialog,
                { provide: GamesService, useValue: { games: [fakeGame], index: 1 } },
                { provide: SocketClientService, useValue: socketServiceMock },
            ],
        }).compileComponents();

        socketClientService = TestBed.inject(SocketClientService);
        router = TestBed.inject(Router);
        gameSet = TestBed.inject(GamesService);
        fixture = TestBed.createComponent(GameComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should initialize correctly', () => {
        const refreshGameListSpy = spyOn(component, 'refreshGameList');
        const shareDataSpy = spyOn(component, 'shareData');
        component.ngOnInit();
        expect(refreshGameListSpy).toHaveBeenCalled();
        expect(shareDataSpy).toHaveBeenCalled();
    });
    it('should initialize afterView correctly', () => {
        const serverImageSpy = spyOn(component, 'serverImage');
        component.ngAfterViewInit();
        expect(serverImageSpy).toHaveBeenCalled();
    });
    it('should clear fields correctly', () => {
        component.name = 'Amz';
        component.openOverlay = true;
        component.openOverlayMultiplayer = true;
        component.clearName();
        expect(component.name).toEqual('');
        expect(component.openOverlay).toBeFalsy();
        expect(component.openOverlayMultiplayer).toBeFalsy();
    });

    it('should update the name', () => {
        const navigateSpy = spyOn(socketClientService, 'send');
        component.updateName();
        expect(navigateSpy).toHaveBeenCalledWith('userName', component.name);
    });
    it('should call navigate of Router with the right arguments', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToDynamicRoute('/game', '2');
        expect(navigateSpy).toHaveBeenCalledWith(['/game/2']);
    });
    it('should refresh the game list', () => {
        gameSet.games[0] = fakeGame;
        component.refreshGameList();
        expect(gameSet.games).toContain(fakeGame);
    });
    it('should set the right index to gamesService', () => {
        component.shareData();
        expect(gameSet.index).toEqual(1);
    });
    it('should send the right event when joinWaitRoom gamesService', () => {
        const sendSpy = spyOn(socketClientService, 'send');
        component.joinWaitRoom('gameID');
        expect(sendSpy).toHaveBeenCalledWith('joinWaitRoom', 'waitgameID');
    });
    it('should set the right index to gamesService', () => {
        const navigateSpy = spyOn(socketClientService, 'send');
        component.joinRoom();
        expect(navigateSpy).toHaveBeenCalledWith('joinRoom');
    });
    it('should set the right index to gamesService', () => {
        const navigateSpy = spyOn(socketClientService, 'disconnect');
        component.disconnection();
        expect(navigateSpy).toHaveBeenCalled();
    });
});
