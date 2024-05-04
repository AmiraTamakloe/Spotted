/* eslint-disable max-params */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { Constants } from '@app/interfaces/constants';
import { ConstantInitialiserService } from '@app/services/constantInitialiser/constant-initialiser.service';
import { GamesService } from '@app/services/games/games.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { FIVE, THIRTY } from '@common/global-constants';

@Component({
    selector: 'app-configuration-page',
    templateUrl: './configuration-page.component.html',
    styleUrls: ['./configuration-page.component.scss'],
    providers: [GamesService],
})
export class ConfigurationPageComponent implements OnInit, OnDestroy {
    indexComponent1 = 0;
    indexComponent2 = 1;
    indexComponent3 = 2;
    indexComponent4 = 3;
    initialTime: number = THIRTY;
    penalty: number = FIVE;
    gain: number = FIVE;
    numberOfElement: number;

    disabled = false;

    constructor(
        public gamesService: GamesService,
        public socketClientService: SocketClientService,
        public constantInitialiser: ConstantInitialiserService,
        private dialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.socketClientService.connect();
        this.gamesService.numberOfGames.subscribe((numberOfElem) => {
            this.numberOfElement = numberOfElem;
        });
        this.constantInitialiser.getConstants().subscribe((data: Constants) => {
            this.initialTime = data.timeLimit;
            this.penalty = data.timePenalty;
            this.gain = data.timeGain;
        });
    }
    ngOnDestroy(): void {
        this.socketClientService.disconnect();
    }

    leftNav() {
        this.indexComponent1 -= 4;
        this.indexComponent2 -= 4;
        this.indexComponent3 -= 4;
        this.indexComponent4 -= 4;
    }
    rightNav() {
        this.indexComponent1 += 4;
        this.indexComponent2 += 4;
        this.indexComponent3 += 4;
        this.indexComponent4 += 4;
    }

    isLeftDisabled() {
        return this.indexComponent1 === 0;
    }

    isRightDisabled() {
        if (
            this.indexComponent1 === this.numberOfElement - 1 ||
            this.indexComponent2 === this.numberOfElement - 1 ||
            this.indexComponent3 === this.numberOfElement - 1 ||
            this.indexComponent4 === this.numberOfElement - 1
        ) {
            return true;
        } else return false;
    }

    toggle(menuTrigger: MatMenuTrigger) {
        menuTrigger.toggleMenu();
    }

    changeInitialTime(event: Event) {
        this.initialTime = parseInt((event.target as HTMLInputElement).value, 10);
    }

    changePenalty(event: Event) {
        this.penalty = parseInt((event.target as HTMLInputElement).value, 10);
    }

    changeGain(event: Event) {
        this.gain = parseInt((event.target as HTMLInputElement).value, 10);
    }
    updateConst() {
        this.constantInitialiser.updateConstants(this.initialTime, this.penalty, this.gain);
    }
    deleteAll() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir supprimer tous les jeux ?' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.gamesService.removeGames().subscribe(() => {});
                location.reload();
            }
        });
    }
    resetAll() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir réinitialiser les scores de tous les jeux ?' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.gamesService.resetGames().subscribe(() => {});
                location.reload();
            }
        });
    }
    resetConstant() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: 'Êtes vous sûre de vouloir réinitialiser les constantes de jeux pour vos parties?' },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.initialTime = THIRTY;
                this.penalty = FIVE;
                this.gain = FIVE;
            }
        });
    }
}
