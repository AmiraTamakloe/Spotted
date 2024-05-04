import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';
import { THOUSAND_MILLISECONDS, THREE } from 'src/global-constants/global-constants';
import { StopwatchComponent } from './stopwatch.component';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('StopwatchComponent', () => {
    let component: StopwatchComponent;
    let fixture: ComponentFixture<StopwatchComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            declarations: [StopwatchComponent],
            providers: [{ provide: SocketClientService, useValue: socketServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(StopwatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should correctly adapt the time', () => {
        component.secInt = -THREE;
        component.minInt = 1;

        const expectSec = 57;
        const expectMin = 0;

        component.verifTimeNeg(component.minInt, component.secInt);
        expect(component.secInt).toBe(expectSec);
        expect(component.minInt).toBe(expectMin);
    });

    it('should restart if time is too low', () => {
        component.secInt = -THREE;
        component.minInt = 0;

        const expectSec = 0;
        const expectMin = 0;

        component.verifTimeNeg(component.minInt, component.secInt);
        expect(component.secInt).toBe(expectSec);
        expect(component.minInt).toBe(expectMin);
    });

    it('On load it should call chronoForClient', () => {
        const spy = spyOn(component, 'chronoForClient');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('verifTime should add a minute and restart the second after XX:59', () => {
        component.minInt = 2;
        component.secInt = 60;
        const expMin = 3;
        const expSec = 0;
        component.verifTime(component.minInt, component.secInt);
        expect(component.minInt).toBe(expMin);
        expect(component.secInt).toBe(expSec);
    });

    it('chrono should start over after 99:59', () => {
        component.minInt = 100;
        component.secInt = 0;
        const expMin = 0;
        const expSec = 0;
        component.verifTime(component.minInt, component.secInt);
        expect(component.minInt).toBe(expMin);
        expect(component.secInt).toBe(expSec);
    });

    it('formattingTime should add a zero to single digit only', () => {
        const singleDigitOne = 1;
        const singleDigitTwo = 2;
        const expDigitOne = '01';
        const expDigitTwo = '02';
        const doubleDigitsOne = 11;
        const doubleDigitsTwo = 12;
        const expdoubleDigitsOne = '11';
        const expdoubleDigitsTwo = '12';
        component.formatingTime(singleDigitOne, singleDigitTwo);
        expect(component.minutes).toBe(expDigitOne);
        expect(component.seconds).toBe(expDigitTwo);
        component.formatingTime(doubleDigitsOne, doubleDigitsTwo);
        expect(component.minutes).toBe(expdoubleDigitsOne);
        expect(component.seconds).toBe(expdoubleDigitsTwo);
    });

    it('chronoForClient should be call every second', fakeAsync(() => {
        const spy1 = spyOn(component, 'chronoForClient');
        component.chronoForClient();
        tick(THOUSAND_MILLISECONDS);
        expect(spy1).toHaveBeenCalled();
    }));

    it('should stop when isTimeOut is true', (done) => {
        component.isTimeOut = true;
        component.chronoForClient();
        setTimeout(() => {
            expect(component.secInt).toBe(1);
            expect(component.minutes).toBe('00');
            expect(component.seconds).toBe('01');
            done();
        }, THOUSAND_MILLISECONDS);
    });

    it('should handle restarVideo event when play is set to false', () => {
        component.play = true;
        const lastPlayStatus = component.play;
        const spyClearTimeOut = spyOn(window, 'clearTimeout');
        socketHelper.peerSideEmit('playPause');
        fixture.detectChanges();
        expect(component.play).not.toEqual(lastPlayStatus);
        expect(spyClearTimeOut).toHaveBeenCalled();
    });
    it('should handle restarVideo event when play is set to true', () => {
        component.play = false;
        const lastPlayStatus = component.play;
        const spyChronoForClient = spyOn(component, 'chronoForClient');
        socketHelper.peerSideEmit('playPause');
        fixture.detectChanges();
        expect(component.play).not.toEqual(lastPlayStatus);
        expect(spyChronoForClient).not.toHaveBeenCalled();
    });
});
