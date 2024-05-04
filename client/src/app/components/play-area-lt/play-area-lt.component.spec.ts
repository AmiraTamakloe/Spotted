import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}
// import { Vec2 } from '@app/interfaces/vec2';
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    // let mouseEvent: MouseEvent;
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
            providers: [HttpClient, { provide: SocketClientService, useValue: socketServiceMock }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        // gamesService = jasmine.createSpyObj('GameService', ['postVector']);
        mockAudio = jasmine.createSpyObj('HTMLAudioElement', ['play']);
        spyOn(window, 'Audio').and.returnValue(mockAudio);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should have default canva size of 640*480', () => {
    //     const expectedHeight = 480;
    //     const expectedWidth = 640;
    //     expect(component.height).toEqual(expectedHeight);
    //     expect(component.width).toEqual(expectedWidth);
    // });

    // it('mouseHitDetect should assign the mouse position to mousePosition variable', () => {
    //     const expectedPosition: Vec2 = { x: 100, y: 200 };
    //     mouseEvent = {
    //         offsetX: expectedPosition.x,
    //         offsetY: expectedPosition.y,
    //         button: 0,
    //     } as MouseEvent;
    //     component.findClickPos(mouseEvent);
    //     expect(component.mousePosition).toEqual(expectedPosition);
    // });

    // it('checkIsClicked should not change the mouse position if it is not a left click', () => {
    //     const expectedPosition: Vec2 = { x: 0, y: 0 };
    //     const adder = 10;
    //     mouseEvent = {
    //         offsetX: expectedPosition.x + adder,
    //         offsetY: expectedPosition.y + adder,
    //         button: 1,
    //     } as MouseEvent;
    //     component.findClickPos(mouseEvent);
    //     expect(component.mousePosition).not.toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
    //     expect(component.mousePosition).toEqual(expectedPosition);
    // });

    // it('findClickPos should call isDifference', () => {
    //     mouseEvent = {
    //         offsetX: 0,
    //         offsetY: 0,
    //         button: 0,
    //     } as MouseEvent;
    //     spyOn(component, 'isDifference');
    //     component.findClickPos(mouseEvent);
    //     expect(component.isDifference).toHaveBeenCalled();
    // });

    // it('should call playSong with "true" as parameter when a difference is found', () => {
    //     const mousePosition = { x: 10, y: 10 };
    //     const diffArray: Vec2[][] = [[{ x: 10, y: 10 }], [{ x: 20, y: 20 }]];
    //     const condition = gamesService.postVector;

    //     spyOn(component, 'playSong');
    //     condition.and.returnValue(true);
    //     component.isDifference(mousePosition);
    //     expect(component.playSong).toHaveBeenCalledWith(true);
    // });
    // describe('cheatMode', () => {
    //     it('should toggle isCheatMode and update related properties', () => {
    //         const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 't' });
    //         component.cheatMode(event);
    //         expect(component.isCheatMode).toBeTruthy();
    //     });

    //     it('should not toggle isCheatMode if key pressed is not "t"', () => {
    //         const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'a' });
    //         component.cheatMode(event);
    //         expect(component.isCheatMode).toBeFalsy();
    //     });
    // });
});
