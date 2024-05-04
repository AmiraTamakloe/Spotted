import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintsComponent } from './hints.component';
import { HintsService } from '@app/services/hints/hints.service';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('HintsComponent', () => {
    let component: HintsComponent;
    let fixture: ComponentFixture<HintsComponent>;
    let hintsService: HintsService;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;

        await TestBed.configureTestingModule({
            declarations: [HintsComponent],
            providers: [HintsService, { provide: SocketClientService, useValue: socketServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(HintsComponent);
        component = fixture.componentInstance;
        hintsService = TestBed.inject(HintsService);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should listen to updateHintCounter event', () => {
        socketHelper.peerSideEmit('updateHintCounter', 3);
        fixture.detectChanges();
        expect(component.colorSwitches).toEqual([false, false, false]);
    });

    it('should listen to restartVideo event', () => {
        component.colorSwitches = [false, false, false];
        socketHelper.peerSideEmit('restartVideo');
        expect(component.colorSwitches).toEqual([true, true, true]);
    });
    it('should correctly assign value when AskHint is called', () => {
        component.nbHints = 3;
        component.diffArray = [
            [
                { x: 101, y: 1 },
                { x: 234, y: 257 },
            ],
            [
                { x: 343, y: 347 },
                { x: 424, y: 443 },
            ],
        ];
        const hintServiceSpy = spyOn(hintsService, 'giveHint');
        component.askHint();
        expect(component.colorSwitches).toEqual([true, true, true]);
        expect(hintServiceSpy).toHaveBeenCalledOnceWith(3);
    });
});
export { HintsComponent };
