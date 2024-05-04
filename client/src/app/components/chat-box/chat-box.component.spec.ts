import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Socket } from 'socket.io-client';
import { ChatBoxComponent } from './chat-box.component';

class SocketClientServiceMock extends SocketClientService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    override connect() {}
}

describe('ChatBoxComponent', () => {
    let component: ChatBoxComponent;
    let fixture: ComponentFixture<ChatBoxComponent>;
    let clickCheat: KeyboardEvent;
    let clickHint: KeyboardEvent;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;

    beforeEach(async () => {
        clickCheat = new KeyboardEvent('t', { key: 't' });
        clickHint = new KeyboardEvent('i', { key: 'i' });
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        await TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ChatBoxComponent],
            providers: [{ provide: SocketClientService, useValue: socketServiceMock }],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should push the new text', () => {
        component.addMessage();
    });

    it('should call onChatBoxKeyDownCheat when the right function is called', () => {
        component.onChatBoxKeyDownCheat(clickCheat);
        expect(clickCheat.key).toEqual('t');
    });

    it('should call onChatBoxKeyDownHint when the right function is called', () => {
        component.onChatBoxKeyDownHint(clickHint);
        expect(clickHint.key).toEqual('i');
    });

    it('should handle roomMessage event to send message in the chat', () => {
        const message = '';
        socketHelper.peerSideEmit('roomMessage', message);
    });
    it('should handle replayTimeMessage event to send message in the chat', () => {
        const message = { text: 'Amira', color: 'pink' };
        socketHelper.peerSideEmit('replayTimeMessage', message);
        expect(component.roomMessages[0].text).toContain(message.text);
        expect(component.roomMessages[0].color).toBe(message.color);
    });

    it('should not update serverClock property when time parameter is null', () => {
        component.serverClock = new Date();
        socketHelper.peerSideEmit('clock', null);
        expect(component.serverClock).toBeNull();
    });

    it('should handle errorFound event and add message to roomMessages', () => {
        const error = 'testError';
        const expectedMessage = { text: 'undefined - testError', color: 'testError' };
        socketHelper.peerSideEmit('errorFound', error);
        fixture.detectChanges();
        expect(component.roomMessages).toContain(expectedMessage);
    });
    it('should handle differenceFound event and add message to roomMessages', () => {
        const found = 'test';
        component.serverClock = new Date();
        const expectedMessage = { text: component.serverClock + ' - ' + found, color: found };
        socketHelper.peerSideEmit('differenceFound', found);
        fixture.detectChanges();
        expect(component.roomMessages).toContain(expectedMessage);
    });
    it('should handle restarVideo event', () => {
        socketHelper.peerSideEmit('restartVideo');
        fixture.detectChanges();
        expect(component.roomMessages.length).toEqual(0);
    });

    it('should handle roomBroadcastMessage event and add message to roomMessages', () => {
        const messageEmit = 'User joined the room';
        socketHelper.peerSideEmit('roomBroadcastMessage', messageEmit);
        expect(component.roomMessages[0].text).toContain(messageEmit);
        expect(component.roomMessages[0].color).toBe(messageEmit);
    });

    it('should update roomSize when receiving roomSize event', () => {
        const testRoomSize = 5;
        socketHelper.peerSideEmit('roomSize', testRoomSize);
        expect(component.roomSize).toEqual(testRoomSize);
    });
    it('should handle gameStarted event to set host and guest names', () => {
        const names = ['John', 'Jane'];
        socketHelper.peerSideEmit('gameStarted', names);
        expect(component.host).toBe(names[0]);
        expect(component.guest).toBe(names[1]);
    });
});
