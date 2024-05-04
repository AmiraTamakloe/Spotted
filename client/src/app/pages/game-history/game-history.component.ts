/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '@app/components/confirmation-popup/confirmation-popup.component';
import { History } from '@app/services/games-history/games-history.model';
import { HistoryService } from '@app/services/games-history/games-history.service';

@Component({
    selector: 'app-game-history',
    templateUrl: './game-history.component.html',
    styleUrls: ['./game-history.component.scss'],
    providers: [HistoryService],
})
export class GameHistoryComponent implements OnInit {
    quitIndex = 0;
    winnerIndex = 1;
    constructor(public historyService: HistoryService, private dialog: MatDialog) {}

    async ngOnInit(): Promise<void> {
        this.refreshHistoryList();
    }

    refreshHistoryList() {
        this.historyService.historyList.subscribe((res) => {
            this.historyService.history = res as History[];
        });
    }

    deleteHistory() {
        const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
            data: { title: 'Confirmation', message: "Êtes vous sûre de vouloir supprimer l'historique des parties ? " },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.historyService.removeHistory().subscribe(() => {});
                location.reload();
            }
        });
    }
}
