/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-underscore-dangle */
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    providers: [GamesService],
})
export class GameComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() index: number;
    @Input() isConfig: boolean;
    @Input() isConfigMultiplayer: boolean;
    openOverlay = false;
    openOverlayMultiplayer = false;
    name = '';
    multiplayerButtonIndicator: string = '1 V 1 : Créer';
    image: string;

    constructor(
        public gamesService: GamesService,
        private socketClientService: SocketClientService,
        private router: Router,
        private dialog: MatDialog,
    ) {}

    async ngOnInit(): Promise<void> {
        this.refreshGameList();
        this.shareData();
    }

    ngAfterViewInit(): void {
        this.serverImage();
    }

    ngOnChanges(change: SimpleChanges) {
        if (change.index) {
            this.serverImage();
        }
    }

    updateName() {
        this.socketClientService.send('userName', this.name);
    }

    navigateToDynamicRoute(buttonRouting: string, gameId: string) {
        this.router.navigate([buttonRouting + '/' + gameId]);
    }

    refreshGameList() {
        this.gamesService.gameList.subscribe((res) => {
            this.gamesService.games = res as Game[];
        });
    }
    clearName() {
        this.name = '';
        this.openOverlay = false;
        this.openOverlayMultiplayer = false;
    }
    submitName() {
        this.updateName();
        this.joinRoom();
        this.navigateToDynamicRoute(this.isConfig ? '' : '/game', this.gamesService.games[this.index]._id);
    }
    submitNameMultiplayer() {
        this.updateName();
        this.joinWaitRoom(this.gamesService.games[this.index]._id);
        this.navigateToDynamicRoute(this.isConfig ? '' : '/waitingRoom', this.gamesService.games[this.index]._id);
    }

    shareData() {
        this.gamesService.indexSetter = this.index;
    }

    joinRoom() {
        this.socketClientService.send('joinRoom');
    }

    joinWaitRoom(id: string) {
        this.socketClientService.send('joinWaitRoom', `wait${id}`);
    }
    serverImage() {
        const imageName = this.gamesService.games[this.index].srcOriginal;
        this.gamesService.getGameImage(imageName).subscribe((res) => {
            this.image = 'data:image/bmp;base64,' + res;
        });
    }

    disconnection() {
        this.socketClientService.disconnect();
    }

    deleteGame(index: number): void {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir supprimer ce jeu ?' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.gamesService.removeImage(this.gamesService.games[this.index].srcOriginal).subscribe(() => {});
                this.gamesService.removeImage(this.gamesService.games[this.index].srcModified).subscribe(() => {});
                this.gamesService.removeGame(index);
            }
        });
    }

    resetScore() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir réinitialiser les scores de ce jeu ?' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.gamesService.resetGame(this.gamesService.games[this.index]._id).subscribe(() => {});
                location.reload();
            }
        });
    }
}
