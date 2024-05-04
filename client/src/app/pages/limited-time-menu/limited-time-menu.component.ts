import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';

@Component({
    selector: 'app-limited-time-menu',
    templateUrl: './limited-time-menu.component.html',
    styleUrls: ['./limited-time-menu.component.scss'],
})
export class LimitedTimeMenuComponent {
    openOverlay = false;
    openOverlayMultiplayer = false;
    name = '';

    constructor(private socketClientService: SocketClientService, private router: Router, public dialog: MatDialog) {}

    updateName() {
        this.socketClientService.send('userName', this.name);
    }

    navigateToDynamicRoute(buttonRouting: string, gameId: string) {
        this.router.navigate([buttonRouting + '/' + gameId]);
    }

    clearName() {
        this.name = '';
        this.openOverlay = false;
        this.openOverlayMultiplayer = false;
    }
    submitName() {
        this.navigateToDynamicRoute('/limitedTimeSoloGame', this.socketClientService.socket.id);
        this.updateName();
        this.socketClientService.send('joinRoom');
    }

    submitNameMultiplayer() {
        this.router.navigate(['/limitedTimeWaitingRoom']);
        this.updateName();
        this.socketClientService.send('limitedTimeMultiplayerWaitRoom');
    }

    disconnection() {
        this.socketClientService.disconnect();
    }
}
