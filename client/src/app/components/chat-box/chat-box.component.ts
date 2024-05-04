import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '@app/interfaces/message';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Action } from '@app/services/video/action.model';
import { VideoService } from '@app/services/video/video.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
    @ViewChild('chatInput', { static: true }) chatInput: ElementRef;
    @Input() gameId: string;
    @Input() isReplay: boolean;
    @Input() hostId: string;
    @Input() isDisabled: boolean;
    roomMessage = '';
    roomMessages: { text: string; color: string }[] = [];
    roomSize: number;
    host: string;
    guest: string;
    serverClock: Date;

    constructor(public socketClientService: SocketClientService, private videoService: VideoService) {}

    async ngOnInit(): Promise<void> {
        this.socketClientService.on('clock', (time: Date) => {
            this.serverClock = time;
        });
        this.roomMessages.push({ text: 'INFO: Les deux canvas sont clickable', color: 'black' });
        this.socketClientService.on('restartVideo', () => {
            this.roomMessages.length = 0;
        });
        this.socketClientService.on('errorFound', (error: string) => {
            this.roomMessages.push({ text: this.serverClock + ' - ' + error, color: error });
            this.addMessageArr('black', this.serverClock + ' - ' + error);
        });
        this.socketClientService.on('differenceFound', (found: string) => {
            this.roomMessages.push({ text: this.serverClock + ' - ' + found, color: found });
            this.addMessageArr('black', this.serverClock + ' - ' + found);
        });
        this.socketClientService.on('replayTimeMessage', (replayTime: { text: string; color: string }) => {
            this.roomMessages.push({ text: replayTime.text, color: replayTime.color });
            this.addMessageArr('black', replayTime.text);
        });
        this.socketClientService.on('roomMessage', (val: { text: string; color: string }) => {
            this.roomMessages.push({ text: this.serverClock + ' - ' + val.text, color: val.color });
            this.addMessageArr(val.color, this.serverClock + ' - ' + val.text);
        });
        this.socketClientService.on('roomBroadcastMessage', (messageEmit: string) => {
            this.roomMessages.push({ text: this.serverClock + ' - ' + messageEmit, color: messageEmit });
            this.addMessageArr('black', this.serverClock + ' - ' + messageEmit);
        });
        this.socketClientService.on('roomSize', (roomSize: number) => {
            this.roomSize = roomSize;
        });
        this.socketClientService.on('gameStarted', (names: string[]) => {
            this.host = names[0];
            this.guest = names[1];
        });
        this.newUser();
    }

    addMessageArr(colorText: string, message: string) {
        if (!this.isReplay) {
            const msg: Message = { text: message, color: colorText, time: this.serverClock };
            const action: Action = { type: 'msg', time: Date.now(), message: msg };
            this.videoService.addAction(action);
        }
    }

    newUser() {
        const message = ' just joined the room';
        this.socketClientService.send('roomBroadcastMessage', { text: message, gameId: this.gameId, hostId: this.hostId });
        this.roomMessage = '';
    }

    addMessage() {
        this.socketClientService.send('roomMessage', { text: this.roomMessage, gameId: this.gameId, hostId: this.hostId });
        this.roomMessage = '';
    }

    onChatBoxKeyDownCheat(event: KeyboardEvent) {
        if (event.key === 't') {
            event.stopPropagation();
        }
    }

    onChatBoxKeyDownHint(event: KeyboardEvent) {
        if (event.key === 'i') {
            event.stopPropagation();
        }
    }
}
