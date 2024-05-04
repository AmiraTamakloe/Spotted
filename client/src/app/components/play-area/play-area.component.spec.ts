/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { Vec2 } from '@app/interfaces/vec2';
import { DrawService } from '@app/services/draw/draw.service';
import { GamesService } from '@app/services/games/games.service';
// import { GamesService } from '@app/services/games/games.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { of } from 'rxjs';
// import { Observable } from 'rxjs';
import { Socket } from 'socket.io-client';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let mouseEvent: MouseEvent;
    // let gamesService: GamesService;
    let mockAudio: HTMLAudioElement;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [HttpClientModule],
            providers: [HttpClient, { provide: SocketClientService, useValue: socketServiceMock }, DrawService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        // gamesService = jasmine.createSpyObj('GameService', ['postVecteur']);
        mockAudio = jasmine.createSpyObj('HTMLAudioElement', ['play']);
        spyOn(window, 'Audio').and.returnValue(mockAudio);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should switch canvas', () => {
        component.showCanvas = true;
        component.switchCanvas();

        expect(component.showCanvas).toBeFalsy();
    });

    it('should blockclick', fakeAsync(() => {
        component.isError = true;
        component.blockClick1Sec();
        jasmine.clock().tick(1002);
        expect(component.isError).toBeFalsy();
    }));

    // it('should blinkdiff call', () => {
    //     const position = 1;
    //     const idSender = 'abc123';
    //     const expectedDiffArray = [
    //         [
    //             { x: 1, y: 2 },
    //             { x: 3, y: 4 },
    //         ],
    //         [
    //             { x: 5, y: 6 },
    //             { x: 7, y: 8 },
    //         ],
    //     ];
    //     component.diffArray = expectedDiffArray;
    //     spyOn(component, 'blinkDiff');
    //     spyOn(component.videoService, 'addAction');
    //     const eventPayload = { position, idSender };
    //     component.isReplay = false;
    //     socketHelper.peerSideEmit('blinkDiff', eventPayload);
    //     expect(component.blinkDiff).toHaveBeenCalled();
    // });

    // it('should playSpy', () => {
    //     component.wantToPlay = false;
    //     const playSpy = spyOn(component, 'blinkDiff');
    //     component.isSolo = true;
    //     component.isCheatMode = true;
    //     component.isDiff = true;
    //     const expectedPosition: Vec2 = { x: 2, y: 1 };
    //     component.diffArray = [
    //         [expectedPosition, expectedPosition],
    //         [expectedPosition, expectedPosition],
    //     ];
    //     component.isDifference({ x: 2, y: 1 });
    //     expect(playSpy).not.toHaveBeenCalled();
    // });

    // it('should playSpy1', () => {
    //     component.wantToPlay = false;
    //     const playSpy = spyOn(component, 'blinkDiff');
    //     component.isSolo = true;
    //     component.isCheatMode = true;
    //     component.isDiff = true;
    //     const expectedPosition: Vec2 = { x: 2, y: 1 };
    //     component.diffArray = [
    //         [expectedPosition, expectedPosition],
    //         [expectedPosition, expectedPosition],
    //     ];
    //     component.isDifference({ x: 2, y: 1 });

    //     expect(playSpy).not.toHaveBeenCalled();
    // });

    // it('should playSpy2', () => {
    //     component.wantToPlay = false;
    //     const playSpy = spyOn(component, 'blinkDiff');
    //     component.isSolo = true;
    //     component.isCheatMode = false;
    //     const expectedPosition: Vec2 = { x: 2, y: 1 };
    //     component.diffArray = [
    //         [expectedPosition, expectedPosition],
    //         [expectedPosition, expectedPosition],
    //     ];
    //     component.isDifference({ x: 2, y: 1 });

    //     expect(playSpy).not.toHaveBeenCalled();
    // });

    // it('should playSpy3', () => {
    //     component.wantToPlay = false;
    //     const playSpy = spyOn(component, 'blinkDiff');
    //     component.isSolo = true;
    //     component.isCheatMode = true;
    //     component.isDiff = false;
    //     const expectedPosition: Vec2 = { x: 0, y: 1 };
    //     component.diffArray = [
    //         [expectedPosition, expectedPosition],
    //         [expectedPosition, expectedPosition],
    //     ];
    //     component.isDifference({ x: 2, y: 1 });
    //     expect(playSpy).not.toHaveBeenCalled();
    // });

    // it('should diffblink', fakeAsync(() => {
    //     component.wantToPlay = false;
    //     const drawSpy = spyOn(component.drawService, 'drawPixel');
    //     component.blinkDiff([{ x: 2, y: 1 }]);
    //     jasmine.clock().tick(7002);

    //     expect(drawSpy).toHaveBeenCalled();
    // }));

    it('should not finderrposs', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        component.diffArray = [
            [expectedPosition, expectedPosition],
            [expectedPosition, expectedPosition],
        ];
        const result = component.findErrorPos({ x: 2, y: 1 }, component.diffArray);

        expect(result).toEqual(-1);
    });

    it('should finderrposs', () => {
        const expectedPosition: Vec2 = { x: 2, y: 1 };
        component.diffArray = [
            [expectedPosition, expectedPosition],
            [expectedPosition, expectedPosition],
        ];
        const result = component.findErrorPos({ x: 2, y: 1 }, component.diffArray);

        expect(result).toEqual(0);
    });

    it('should call hintMode', () => {
        component.isSolo = true;
        spyOn(component, 'hintMode');
        const event = new KeyboardEvent('keydown', { key: 'i' });
        component.detectKey(event);
        expect(component.hintMode).toHaveBeenCalled();
    });

    it('should call cheatMode', () => {
        spyOn(component, 'cheatMode');
        const event = new KeyboardEvent('keydown', { key: 't' });
        component.detectKey(event);
        expect(component.cheatMode).toHaveBeenCalled();
    });

    it('should not call hintMode', () => {
        spyOn(component, 'hintMode');
        component.isSolo = false;
        const event = new KeyboardEvent('keydown', { key: 'i' });
        component.detectKey(event);
        expect(component.hintMode).not.toHaveBeenCalled();
    });

    it('should giveHint of hinstsService', () => {
        const spyHint = spyOn(component.hintsService, 'giveHint');
        component.hintMode();
        expect(spyHint).toHaveBeenCalled();
    });

    // it('should call cancel error twice', () => {
    //     const drawSpy = spyOn(component.drawService, 'cancelBlinking');
    //     component.isCheatMode = true;
    //     component.diffArray = [[], []];
    //     component.cheatMode();
    //     expect(drawSpy).toHaveBeenCalledTimes(2);
    // });

    // it('should call blink 4 times', () => {
    //     component.isReplay = true;
    //     const expectedPosition: Vec2 = { x: 0, y: 0 };
    //     const drawSpy = spyOn(component.drawService, 'blinkCheat');
    //     component.isCheatMode = true;
    //     component.diffArray = [
    //         [expectedPosition, expectedPosition],
    //         [expectedPosition, expectedPosition],
    //     ];
    //     component.cheatMode();
    //     expect(drawSpy).toHaveBeenCalledTimes(4);
    // });

    it('should have default canva size of 640*480', () => {
        const expectedHeight = 480;
        const expectedWidth = 640;
        expect(component.height).toEqual(expectedHeight);
        expect(component.width).toEqual(expectedWidth);
    });

    it('checkIsClicked should not change the mouse position if it is not a left click', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        const adder = 10;
        mouseEvent = {
            offsetX: expectedPosition.x + adder,
            offsetY: expectedPosition.y + adder,
            button: 1,
        } as MouseEvent;
        component.findClickPos(mouseEvent);
        expect(component.mousePosition).not.toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(component.mousePosition).toEqual(expectedPosition);
    });

    it('findClickPos should call isDifference', () => {
        mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;
        spyOn(component, 'isDifference');
        component.findClickPos(mouseEvent);
        expect(component.isDifference).toHaveBeenCalled();
    });
});

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    // let gamesService: GamesService;
    let mockAudio: HTMLAudioElement;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let gameServiceMock: GamesService;

    beforeEach(async () => {
        gameServiceMock = jasmine.createSpyObj(['getGameImage']);
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [HttpClientTestingModule],
            providers: [
                HttpClient,
                { provide: GamesService, useValue: gameServiceMock },
                { provide: SocketClientService, useValue: socketServiceMock },
                DrawService,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        mockAudio = jasmine.createSpyObj('HTMLAudioElement', ['play']);
        spyOn(window, 'Audio').and.returnValue(mockAudio);
        fixture.detectChanges();
    });

    it('should draw the left image on the canvas', () => {
        const mockResponse = 'mock base64 image data';
        spyOn(CanvasRenderingContext2D.prototype, 'drawImage').and.callThrough();
        spyOn(component.gamesService, 'getGameImage').and.returnValue(of(mockResponse));
        component.serverImageLeft();
        fixture.detectChanges();
        expect(component.imageOriginal).toEqual(component.imageServerArray[0]);
    });

    it('should draw the right image on the canvas', () => {
        const mockResponse = 'mock base64 image data';
        spyOn(CanvasRenderingContext2D.prototype, 'drawImage').and.callThrough();
        spyOn(component.gamesService, 'getGameImage').and.returnValue(of(mockResponse));

        component.serverImageRight();

        fixture.detectChanges();
        expect(component.imageOriginal).toEqual(component.imageServerArray[1]);
    });
});
