/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ConstantInitialiserService } from '@app/services/constantInitialiser/constant-initialiser.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';
import { MINUTE_IN_SEC, TEN, THIRTY, THOUSAND_MILLISECONDS } from 'src/global-constants/global-constants';
import { StopwatchLtComponent } from './stopwatch-lt.component';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('StopwatchLtComponent', () => {
    let component: StopwatchLtComponent;
    let fixture: ComponentFixture<StopwatchLtComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            declarations: [StopwatchLtComponent],
            providers: [ConstantInitialiserService, { provide: SocketClientService, useValue: socketServiceMock }],
            imports: [HttpClientModule],
        }).compileComponents();

        fixture = TestBed.createComponent(StopwatchLtComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should return the correct value when verifTime is called with sec exceeding 59', () => {
        component.minInt = 1;
        const min = 2;
        const sec = 60;
        component.verifTime(min, sec);
        expect(component.secInt).toEqual(0);
        expect(component.minInt).toEqual(2);
    });
    it('should return the correct value when verifTime is called with min exceeding 99', () => {
        component.minInt = 1;
        const min = 100;
        const sec = 48;
        component.verifTime(min, sec);
        expect(component.secInt).toEqual(0);
        expect(component.minInt).toEqual(0);
    });

    it('should set the correct values when time is negatif', () => {
        const min = 0;
        const sec = -10;
        component.verifTimeNeg(min, sec);
        expect(component.minInt).toEqual(0);
        expect(component.secInt).toEqual(0);
    });

    it('should set the correct values when sec is negatif but not minutes', () => {
        component.minInt = 3;
        const min = 3;
        const sec = -10;
        const expectedSecValue = MINUTE_IN_SEC + sec + 1;
        component.verifTimeNeg(min, sec);
        expect(component.minInt).toEqual(2);
        expect(component.secInt).toEqual(expectedSecValue);
    });

    it('should initialize the timer values', () => {
        const formattingTimeSpy = spyOn(component, 'formattingTime');
        const countdownForClientSpy = spyOn(component, 'countdownForClient');
        component.countdownDuration = THIRTY;
        component.penalty = TEN;
        component.bonus = THIRTY;
        component.initiateTimer();
        expect(component.minInt).toBe(0);
        expect(component.secInt).toBe(THIRTY);
        expect(formattingTimeSpy).toHaveBeenCalled();
        expect(component.stopwatchValue[0]).toBe('0');
        expect(component.stopwatchValue[1]).toBe('0');
        expect(countdownForClientSpy).toHaveBeenCalled();
    });

    it('should countdown the timer correctly', () => {
        component.isTimeOut = false;
        const timeOutEventSpy = spyOn(component.timeOutEvent, 'emit');
        spyOn(window, 'setTimeout');
        component.minInt = 1;
        component.secInt = 30;
        component.countdownForClient();
        expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), THOUSAND_MILLISECONDS);
        expect(component.minInt).toEqual(1);
        expect(component.secInt).toEqual(29);
        component.minInt = 0;
        component.secInt = 0;
        component.countdownForClient();
        expect(timeOutEventSpy).toHaveBeenCalled();
    });
    it('should countdown the timer correctly when timeOut is true', () => {
        component.isTimeOut = false;
        component.minInt = 1;
        const timeOutEventSpy = spyOn(component, 'formattingTime');
        spyOn(component, 'countdownForClient').and.callThrough();
        component.countdownForClient();
        expect(timeOutEventSpy).toHaveBeenCalled();
    });

    it('should handle bonusTime event', () => {
        component.secInt = 35;
        component.minInt = 1;
        component.bonus = 5;
        const expectedSec = 40;
        const spyVerifTime = spyOn(component, 'verifTime');
        const spyVerifTimeNeg = spyOn(component, 'verifTimeNeg');
        const spyFormattingTime = spyOn(component, 'formattingTime');
        socketHelper.peerSideEmit('bonusTime');
        fixture.detectChanges();
        expect(component.secInt).toEqual(expectedSec);
        expect(spyVerifTime).toHaveBeenCalled();
        expect(spyVerifTimeNeg).toHaveBeenCalled();
        expect(spyFormattingTime).toHaveBeenCalled();
    });
    it('should handle penltyTime event', () => {
        component.secInt = 35;
        component.minInt = 1;
        component.penalty = 10;
        const expectedSec = 25;
        const spyVerifTime = spyOn(component, 'verifTime');
        const spyVerifTimeNeg = spyOn(component, 'verifTimeNeg');
        const spyFormattingTime = spyOn(component, 'formattingTime');
        socketHelper.peerSideEmit('penaltyTime');
        fixture.detectChanges();
        expect(component.secInt).toEqual(expectedSec);
        expect(spyVerifTime).toHaveBeenCalled();
        expect(spyVerifTimeNeg).toHaveBeenCalled();
        expect(spyFormattingTime).toHaveBeenCalled();
    });
});
