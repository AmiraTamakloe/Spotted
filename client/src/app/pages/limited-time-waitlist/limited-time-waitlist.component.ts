/* eslint-disable max-params */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { FIVE_THOUSAND } from '@common/global-constants';
import { take } from 'rxjs';

@Component({
    selector: 'app-limited-time-waitlist',
    templateUrl: './limited-time-waitlist.component.html',
    styleUrls: ['./limited-time-waitlist.component.scss'],
})
export class LimitedTimeWaitlistComponent implements OnInit {
    games: Game[];
    indexShuffled: number[];
    users: string[] = [];
    idUsers: string[] = [];
    timeout: ReturnType<typeof setTimeout>;

    constructor(
        public gamesService: GamesService,
        public socketClientService: SocketClientService,
        private router: Router,
        private dialog: MatDialog,
    ) {}

    async ngOnInit(): Promise<void> {
        this.gamesService.gameListLimitedTime.pipe(take(1)).subscribe((res) => {
            this.games = res as Game[];
        });
        this.socketClientService.send('joinLTWaitlist');
        this.socketClientService.on('listUsers', (val: string[][]) => {
            this.users = val[0];
            this.idUsers = val[1];
        });
        this.socketClientService.on('LTGame', () => {
            this.timeout = setTimeout(() => {
                this.acceptedUser();
            }, FIVE_THOUSAND);
        });
        this.socketClientService.on('stopStartLt', () => {
            clearTimeout(this.timeout);
        });
    }

    acceptedUser() {
        if (this.idUsers.length === 2) {
            if (this.socketClientService.socket.id === this.idUsers[1]) {
                this.socketClientService.send('joinLTGameRoom', {
                    room: `${this.idUsers[0]}LTGame`,
                    invId: this.idUsers[1],
                    hostId: this.idUsers[0],
                    gameId: 'LTGame',
                });
            } else if (this.socketClientService.socket.id === this.idUsers[0]) {
                this.indexShuffled = this.random(this.games.length);
                this.socketClientService.send('hostJoinLTGameRoom', {
                    room: `${this.idUsers[0]}LTGame`,
                    hostId: this.idUsers[0],
                    invId: this.idUsers[1],
                    array: this.indexShuffled,
                    gameId: 'LTGame',
                });
            }
            this.router.navigate([`LimitedTimeMultiplayerGame/${this.idUsers[0]}/LTGame`]);
        }
    }

    random(len: number): number[] {
        const indexArray = Array.from({ length: len }, (_, i) => i);
        for (let i = indexArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indexArray[i], indexArray[j]] = [indexArray[j], indexArray[i]];
        }
        return indexArray;
    }

    leaveWaitRoom() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: "Êtes vous sûre de vouloir quit la salle d'attente du mode temps limité ? " },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.socketClientService.send('leaveWaitRoomLT');
                this.idUsers.length = 0;
                this.router.navigate(['home']);
            }
        });
    }
}
