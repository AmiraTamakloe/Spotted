/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketClientService {
    socket: Socket;

    constructor() {
        this.connect();
    }

    get socketId() {
        return this.socket;
    }

    set socketId(socket: Socket) {
        this.socket = socket;
    }

    isSocketAlive() {
        return this.socket && this.socket.connected;
    }

    connect() {
        this.socket = io(environment.serverUrl, { transports: ['websocket'], upgrade: false });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    on<T>(event: string, action: (data: T) => void, dataToSend?: T): void {
        if (this.socket) {
            if (dataToSend) {
                this.socket.emit(event, dataToSend);
            }
            this.socket.on(event, action);
        } else {
            console.error('Error: Socket not initialized.');
        }
    }

    onMultipleParam<T, U>(event: string, action: (data: T, secondData: U) => void): void {
        if (this.socket) {
            this.socket.on(event, action);
        } else {
            console.error('Error: Socket not initialized.');
        }
    }

    send<T>(event: string, data?: T): void {
        if (this.socket) {
            if (data) {
                this.socket.emit(event, data);
            } else {
                this.socket.emit(event);
            }
        } else {
            console.error('Error: Socket not initialized.');
        }
    }
}
