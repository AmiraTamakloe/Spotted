/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { History } from '@app/services/games-history/games-history.model';
import { HistoryService } from '@app/services/games-history/games-history.service';
import { Game } from '@app/services/games/games.model';
import { GamesService } from '@app/services/games/games.service';
import { HintsService } from '@app/services/hints/hints.service';
import { ModeSoloService } from '@app/services/mode-solo/mode-solo.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { first, firstValueFrom, tap } from 'rxjs';

@Component({
    selector: 'app-limited-time-solo-game',
    templateUrl: './limited-time-solo-game.component.html',
    styleUrls: ['./limited-time-solo-game.component.scss'],
    providers: [GamesService, HistoryService],
})
export class LimitedTimeSoloGameComponent implements OnInit, OnDestroy {
    games: Game[];
    gamesShuffle: Game[];
    isEndGame: boolean;
    userName: string;
    nbHints: number;
    history = new History();
    isQuit: boolean;
    currentDate: string;
    finalTime: string;

    readonly title: string = 'Spotted : trouve les 7 différences';
    constructor(
        public gamesService: GamesService,
        public modeSoloService: ModeSoloService,
        public socketClientService: SocketClientService,
        public historyService: HistoryService,
        private router: Router,
        private hintService: HintsService,
        private dialog: MatDialog,
    ) {
        this.nbHints = 0;
    }

    async ngOnInit(): Promise<void> {
        this.isEndGame = false;
        this.hintService.status = false;
        firstValueFrom(
            this.gamesService.gameListLimitedTime.pipe(
                first(),
                tap(async (res) => {
                    this.games = res as Game[];
                    this.gamesShuffle = this.random(this.games);
                    if (this.games.length === 0) {
                        this.socketClientService.send('leave');
                        this.router.navigate(['config']);
                        window.alert('Aucune jeu disponible');
                    }
                }),
            ),
        );
        this.socketClientService.on('userNameSolo', (userName: string) => {
            this.userName = userName;
        });
        this.socketClientService.on('updateHintCounter', (nbHints: number) => {
            this.nbHints = nbHints;
        });
        this.modeSoloService.foundDifferencesChanged.subscribe(() => {
            this.gamesShuffle.shift();
            if (this.gamesShuffle.length === 0) this.isEndGame = true;
        });
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        this.currentDate = `${day}-${month}-${year}`;
    }

    async ngOnDestroy() {
        this.modeSoloService.foundDifferences = 0;
        await this.createHistory();
    }

    createHistory() {
        this.history.type = 'solo temps limité';
        this.history.hostName = this.userName;
        this.history.winner = this.isQuit ? 0 : 1;
        this.history.time = this.finalTime;
        this.history.gaveUp = this.isQuit ? 1 : 0;
        this.history.date = this.currentDate;
        this.historyService.postHistory(this.history).subscribe(() => {});
    }

    timeOut() {
        this.isEndGame = true;
    }

    receiveTime(time: string) {
        this.finalTime = time;
    }

    endGame() {
        if (this.isEndGame) {
            this.isEndGame = true;
            return true;
        } else {
            return false;
        }
    }

    leaveGame() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir quit la partie ? ' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.socketClientService.send('leave');
                this.router.navigate(['selection']);
            }
        });
    }

    goHome() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir quit la partie? ' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.socketClientService.send('leave');
                this.router.navigate(['home']);
            }
        });
    }

    random(game: Game[]): Game[] {
        for (let i = game.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [game[i], game[j]] = [game[j], game[i]];
        }
        return game;
    }
}
