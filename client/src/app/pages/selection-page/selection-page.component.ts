import { Component, OnInit } from '@angular/core';
import { GamesService } from '@app/services/games/games.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';

@Component({
    selector: 'app-selection-page',
    templateUrl: './selection-page.component.html',
    styleUrls: ['./selection-page.component.scss'],
    providers: [GamesService],
})
export class SelectionPageComponent implements OnInit {
    indexGame1: number = 0;
    indexGame2: number = 1;
    indexGame3: number = 2;
    indexGame4: number = 3;
    numberOfElement: number;

    constructor(public gamesService: GamesService, public socketClientService: SocketClientService) {}

    async ngOnInit(): Promise<void> {
        await this.refresh();
        if (this.socketClientService.isSocketAlive()) {
            this.socketClientService.disconnect();
            this.socketClientService.connect();
        } else {
            this.socketClientService.connect();
        }
    }

    async refresh() {
        await this.gamesService.numberOfGames.subscribe((numberOfElem) => {
            this.numberOfElement = numberOfElem;
        });
    }
    leftNav() {
        if (!this.isLeftDisabled()) {
            this.refresh();
            this.indexGame1 -= 4;
            this.indexGame2 -= 4;
            this.indexGame3 -= 4;
            this.indexGame4 -= 4;
        }
    }
    rightNav() {
        if (!this.isRightDisabled()) {
            this.refresh();
            this.indexGame1 += 4;
            this.indexGame2 += 4;
            this.indexGame3 += 4;
            this.indexGame4 += 4;
        }
    }

    isLeftDisabled() {
        return this.indexGame1 === 0;
    }

    isRightDisabled() {
        if (
            this.indexGame1 === this.numberOfElement - 1 ||
            this.indexGame2 === this.numberOfElement - 1 ||
            this.indexGame3 === this.numberOfElement - 1 ||
            this.indexGame4 === this.numberOfElement - 1
        ) {
            return true;
        } else return false;
    }
}
