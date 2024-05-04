import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { Action } from '@app/services/video/action.model';
import { VideoService } from '@app/services/video/video.service';

@Component({
    selector: 'app-endgame-modal',
    templateUrl: './endgame-modal.component.html',
    styleUrls: ['./endgame-modal.component.scss'],
})
export class EndgameModalComponent implements AfterViewInit, OnInit {
    @Input() userName: string;
    @Input() isReplay: boolean;
    @Input() isSolo: boolean;
    @Input() isLt: boolean;
    @Input() playerQuit: boolean;
    @Input() bestTimeArray: string[] = ['00:00', '00:00', '00:00'];
    @Input() finalTime: string = '00:00';
    @Input() bestTimeNameArray: string[] = ['00:00', '00:00', '00:00'];
    @Input() gameName: string;
    @Input() gameType: string;
    @Input() winnerIndicator: string;
    @Output() finalBestTimeArray = new EventEmitter<string[]>();
    @Output() finalBestTimeNameArray = new EventEmitter<string[]>();
    leftButton: string;
    rightButton: string;
    leftLink: string;
    rightLink: string;
    bestTimesSec: string;
    bestTimesMin: string;
    endGameFinalTimeSec: string;
    endGameFinalTimeMin: string;

    constructor(private videoService: VideoService, private socketClientService: SocketClientService) {}
    ngAfterViewInit(): void {
        if (this.isLt) {
            this.leftButton = 'Retour Menu';
            this.rightButton = 'Toujours menu';
            this.leftLink = '/home';
            this.rightLink = '/home';
        } else if (!this.isReplay) {
            const actEnd: Action = { type: 'endGame', time: Date.now(), winnerName: this.userName };
            this.videoService.addAction(actEnd);
            this.leftButton = 'Retour Menu';
            this.rightButton = 'Voir la vidéo';
            this.leftLink = '/home';
            this.rightLink = '/replay';
        } else if (this.playerQuit) {
            this.leftButton = 'Retour Menu';
            this.rightButton = 'Toujours home';
            this.leftLink = '/home';
            this.rightLink = '/home';
        } else {
            this.leftButton = 'Retour Menu';
            this.rightButton = 'Revoir la vidéo';
            this.leftLink = '/home';
            this.rightLink = '/replay';
        }
    }
    onClick() {
        if (this.isReplay) {
            this.socketClientService.send('restartVideo');
        }
    }

    async ngOnInit(): Promise<void> {
        if (this.gameType === 'solo' || (this.gameType === '1 vs 1' && this.userName === this.winnerIndicator)) {
            this.endGameTime();
        }
    }

    endGameTime() {
        this.endGameFinalTimeMin = this.finalTime.substring(0, 2);
        this.endGameFinalTimeSec = this.finalTime.split(':').pop();
        for (let index = 0; index < 3; index++) {
            this.bestTimesSec = this.bestTimeArray[index].split(':').pop();
            this.bestTimesMin = this.bestTimeArray[index].substring(0, 2);
            const compareResultMin = this.endGameFinalTimeMin.localeCompare(this.bestTimesMin);
            const compareResultSec = this.endGameFinalTimeSec.localeCompare(this.bestTimesSec);
            if (compareResultMin === 0) {
                if (compareResultSec < 0) {
                    switch (index) {
                        case 0: {
                            this.bestTimeArray[2] = this.bestTimeArray[1];
                            this.bestTimeNameArray[2] = this.bestTimeNameArray[1];
                            this.bestTimeArray[1] = this.bestTimeArray[0];
                            this.bestTimeNameArray[1] = this.bestTimeNameArray[0];
                            this.bestTimeArray[0] = this.finalTime;
                            this.bestTimeNameArray[0] = this.userName;

                            break;
                        }
                        case 1: {
                            this.bestTimeArray[2] = this.bestTimeArray[1];
                            this.bestTimeNameArray[2] = this.bestTimeNameArray[1];
                            this.bestTimeArray[1] = this.finalTime;
                            this.bestTimeNameArray[1] = this.userName;

                            break;
                        }
                        case 2: {
                            this.bestTimeArray[2] = this.finalTime;
                            this.bestTimeNameArray[2] = this.userName;

                            break;
                        }
                    }
                    index = 3;
                }
            } else if (compareResultMin < 0) {
                switch (index) {
                    case 0: {
                        this.bestTimeArray[2] = this.bestTimeArray[1];
                        this.bestTimeNameArray[2] = this.bestTimeNameArray[1];
                        this.bestTimeArray[1] = this.bestTimeArray[0];
                        this.bestTimeNameArray[1] = this.bestTimeNameArray[0];
                        this.bestTimeArray[0] = this.finalTime;
                        this.bestTimeNameArray[0] = this.userName;

                        break;
                    }
                    case 1: {
                        this.bestTimeArray[2] = this.bestTimeArray[1];
                        this.bestTimeNameArray[2] = this.bestTimeNameArray[1];
                        this.bestTimeArray[1] = this.finalTime;
                        this.bestTimeNameArray[1] = this.userName;

                        break;
                    }
                    case 2: {
                        this.bestTimeArray[2] = this.finalTime;
                        this.bestTimeNameArray[2] = this.userName;

                        break;
                    }
                }
                index = 3;
            }
        }
        if (this.bestTimeNameArray.includes(this.userName)) {
            this.socketClientService.send(
                'newTime',
                ` ${this.userName} obtient la ${this.bestTimeNameArray.indexOf(this.userName) + 1} place dans les meilleurs temps du jeu ${
                    this.gameName
                } en ${this.gameType}`,
            );
        }

        this.finalBestTimeArray.emit(this.bestTimeArray);
        this.finalBestTimeNameArray.emit(this.bestTimeNameArray);
    }
}
