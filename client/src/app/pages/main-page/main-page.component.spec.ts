import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { HeaderComponent } from '@app/components/header/header.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';
class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}
describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [MainPageComponent, HeaderComponent],
            providers: [{ provide: SocketClientService, useValue: socketServiceMock }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
