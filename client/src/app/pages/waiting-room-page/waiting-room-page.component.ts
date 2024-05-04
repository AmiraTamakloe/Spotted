/* eslint-disable max-params */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';

@Component({
    selector: 'app-waiting-room-page',
    templateUrl: './waiting-room-page.component.html',
    styleUrls: ['./waiting-room-page.component.scss'],
    providers: [GamesService],
})
export class WaitingRoomPageComponent implements OnInit {
    @ViewChild('htmlId') htmlId: ElementRef;
    game: Game;
    firstUser: string;
    users: string[] = [];
    idUsers: string[] = [];
    secondUser: string;
    id: string;
    isHost: boolean;
    isEndGame: boolean;

    constructor(
        public gamesService: GamesService,
        private route: ActivatedRoute,
        public socketClientService: SocketClientService,
        private router: Router,
        private dialog: MatDialog,
    ) {}

    async ngOnInit(): Promise<void> {
        this.isEndGame = false;
        this.id = this.route.snapshot.paramMap.get('id');
        this.gamesService.gameById(this.id).subscribe((res) => {
            this.game = res as Game;
        });

        this.socketClientService.on('listUsers', (val: string[][]) => {
            this.users = val[0];
            this.idUsers = val[1];
            this.firstUser = val[0][0];
            if (this.users.length > 1) {
                this.secondUser = this.users[1];
            }
        });
        this.socketClientService.on('youreHost', () => {
            this.isHost = true;
        });
        this.socketClientService.on('joinGame', (ids: { gameId: string; hostId: string }) => {
            this.socketClientService.send('leaveRoom', ids.gameId);
            this.navigateToDynamicRoute('multiplayerGame/' + `${ids.hostId}/` + ids.gameId);
        });
        this.socketClientService.on('notPicked', (waitRoom: { gameId: string; msg: string }) => {
            this.socketClientService.send('leaveWaitRoom', waitRoom.gameId);
            alert(waitRoom.msg);
            this.navigateToDynamicRoute('selection/');
        });
    }
    acceptedUser(idx: number) {
        this.socketClientService.send('joinGameRoom', {
            room: `${this.idUsers[0]}${this.id}`,
            invId: this.idUsers[idx],
            gameId: this.id,
            hostId: this.idUsers[0],
        });
        this.socketClientService.send('hostJoinGameRoom', {
            room: `${this.idUsers[0]}${this.id}`,
            hostId: this.idUsers[0],
            invId: this.idUsers[idx],
            hostName: this.users[0],
            invName: this.users[idx],
            gameId: this.id,
        });
        this.navigateToDynamicRoute('multiplayerGame/' + `${this.idUsers[0]}/` + this.id);
    }
    refusedUser(idx: number) {
        this.socketClientService.send('refused', {
            invId: this.idUsers[idx],
            gameId: this.id,
        });
    }
    navigateToDynamicRoute(url: string) {
        this.router.navigate([url]);
    }

    leaveWaitRoom() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: "Êtes vous sûre de vouloir quit la salle d'attente ? " },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.socketClientService.send('leaveWaitRoom', this.id);
                this.navigateToDynamicRoute('selection');
            }
        });
    }
}
export { GamesService };
