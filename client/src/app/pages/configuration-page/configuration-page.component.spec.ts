/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { HeaderComponent } from '@app/components/header/header.component';
import { ConstantInitialiserService } from '@app/services/constantInitialiser/constant-initialiser.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { THIRTY } from '@common/global-constants';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { ConfigurationPageComponent } from './configuration-page.component';
class SocketClientServiceMock extends SocketClientService {
    override connect() {}
}

describe('ConfigurationPageComponent', () => {
    let component: ConfigurationPageComponent;
    let fixture: ComponentFixture<ConfigurationPageComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            imports: [MatMenuModule, FormsModule, HttpClientTestingModule],
            declarations: [ConfigurationPageComponent, MatMenu, HeaderComponent],
            providers: [ConstantInitialiserService, MatMenuTrigger, { provide: SocketClientService, useValue: socketServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfigurationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.indexComponent1 = 7;
        component.indexComponent2 = 7;
        component.indexComponent3 = 7;
        component.indexComponent4 = 7;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('leftNav should modify indexComponents', () => {
        component.indexComponent1 = 6;
        component.indexComponent2 = 6;
        component.indexComponent3 = 6;
        component.indexComponent4 = 6;
        component.leftNav();
        expect(component.indexComponent1).toEqual(2);
        expect(component.indexComponent2).toEqual(2);
        expect(component.indexComponent3).toEqual(2);
        expect(component.indexComponent4).toEqual(2);
    });
    it('isRightDisabled should block rightNav', () => {
        component.numberOfElement = 8;
        expect(component.isRightDisabled()).toEqual(true);
    });
    it('rightNav should modify indexComponents', () => {
        component.numberOfElement = 7;
        component.rightNav();
        fixture.detectChanges();
        expect(component.indexComponent1).toEqual(11);
        expect(component.indexComponent2).toEqual(11);
        expect(component.indexComponent3).toEqual(11);
        expect(component.indexComponent4).toEqual(11);
    });

    it('should toggle the menu corretcly', () => {
        const menuTrigger = jasmine.createSpyObj('MatMenuTrigger', ['toggleMenu']);

        component.toggle(menuTrigger);

        expect(menuTrigger.toggleMenu).toHaveBeenCalled();
    });

    it('should initiliaze the correct numberOfElement on init', () => {
        const numberOfElem = 10;

        spyOnProperty(component.gamesService, 'numberOfGames', 'get').and.returnValue(of(numberOfElem));

        component.ngOnInit();

        expect(component.numberOfElement).toEqual(numberOfElem);
    });
    it('should call the update of the service', () => {
        component.initialTime = 10;
        component.penalty = 10;
        component.gain = 10;
        const callSpy = spyOn(component.constantInitialiser, 'updateConstants');

        component.updateConst();

        expect(callSpy).toHaveBeenCalled();
    });
    it('should call the update of the service', () => {
        component.initialTime = 10;
        component.penalty = 10;
        component.gain = 10;
        component.resetConstant();

        expect(component.initialTime).toEqual(THIRTY);
    });

    it('should change tempInitial correctxly', () => {
        const event = new Event('input');
        Object.defineProperty(event, 'target', {
            value: { value: '5' },
            writable: false,
        });

        component.changeInitialTime(event);

        expect(component.gain).toEqual(5);
    });

    it('should change penalty correctly', () => {
        const event = new Event('input');
        Object.defineProperty(event, 'target', {
            value: { value: '5' },
            writable: false,
        });

        component.changePenalty(event);

        expect(component.gain).toEqual(5);
    });

    it('should change gain correctly', () => {
        const event = new Event('input');
        Object.defineProperty(event, 'target', {
            value: { value: '7' },
            writable: false,
        });

        component.changeGain(event);

        expect(component.gain).toEqual(7);
    });
});
