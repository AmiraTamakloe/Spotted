import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { HeaderComponent } from '@app/components/header/header.component';
import { Game } from '@app/services/games/games.model';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';
import { WaitingRoomPageComponent } from './waiting-room-page.component';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}
describe('WaitingRoomComponent', () => {
    let component: WaitingRoomPageComponent;
    let fixture: ComponentFixture<WaitingRoomPageComponent>;
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
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomPageComponent, HeaderComponent],
            imports: [MatDialogModule, HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [{ provide: SocketClientService, useValue: socketServiceMock }],
        }).compileComponents();
    });

    beforeEach(() => {
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(WaitingRoomPageComponent);
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

    // it('should shoud call the acceptance component when two people are in a room', () => {
    //     const userName = 2;
    //     socketHelper.peerSideEmit('roomSize', userName);
    //     expect(component.dialog).toHaveBeenCalled();
    // });

    // it('should shoud not call the accpetance component when less then two people are in a room', () => {
    //     const userName = 1;
    //     socketHelper.peerSideEmit('roomSize', userName);
    //     expect(component.dialog).not.toHaveBeenCalled();
    // });

    // it('should shoud call the variable first user when the name countains', () => {
    //     const userName = 'cedr1';
    //     socketHelper.peerSideEmit('userNameCreated', userName);
    //     expect(component.firstUser).not.toHaveBeenCalled();
    // });
});
