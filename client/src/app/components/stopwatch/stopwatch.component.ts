import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Constants } from '@app/interfaces/constants';
import { ConstantInitialiserService } from '@app/services/constantInitialiser/constant-initialiser.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { MINUTE_IN_SEC, NINE, NINETY_NINE, TEN, THOUSAND_MILLISECONDS } from '@common/global-constants';
@Component({
    selector: 'app-stopwatch',
    templateUrl: './stopwatch.component.html',
    styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit, OnDestroy {
    @Input() isTimeOut: boolean;
    @Input() speed: number;
    @Output() finalTime = new EventEmitter<string>();
    currentTime: string;
    index: number = 1;
    penalty: number = TEN;
    minutes: string = '0';
    seconds: string = '0';
    stopwatchValue: string[] = [this.minutes, this.seconds];
    minInt: number = +this.minutes;
    secInt: number = +this.seconds;
    play: boolean;
    timeout: ReturnType<typeof setTimeout>;
    actStart: number;
    whenStop: number;
    wait: number;
    constructor(private socketClientService: SocketClientService, private constantInitialiser: ConstantInitialiserService) {
        this.play = true;
    }

    ngOnInit(): void {
        this.constantInitialiser.getConstants().subscribe((data: Constants) => {
            this.penalty = data.timePenalty;
        });
        this.chronoForClient();
        this.socketClientService.on('playPause', () => {
            this.play = !this.play;
            this.whenStop = Date.now();
            this.wait = THOUSAND_MILLISECONDS - (this.whenStop - this.actStart) / this.speed;

            if (!this.play) {
                clearTimeout(this.timeout);
            } else {
                setTimeout(() => {
                    this.chronoForClient();
                }, this.wait);
            }
        });
        this.socketClientService.on('penaltyTime', () => {
            this.secInt += this.penalty;
            this.verifTimeNeg(this.minInt, this.secInt);
            this.verifTime(this.minInt, this.secInt);
            this.formatingTime(this.minInt, this.secInt);
            this.stopwatchValue[1] = this.seconds;
            this.stopwatchValue[0] = this.minutes;
        });
    }

    ngOnDestroy(): void {
        this.finalTime.emit(`${this.stopwatchValue[0]}:${this.stopwatchValue[1]}`);
        return;
    }

    chronoForClient() {
        if (this.isTimeOut) {
            this.finalTime.emit(`${this.stopwatchValue[0]}:${this.stopwatchValue[1]}`);
            return;
        }
        this.secInt += 1;
        this.verifTime(this.minInt, this.secInt);
        this.formatingTime(this.minInt, this.secInt);
        this.stopwatchValue[1] = this.seconds;
        this.stopwatchValue[0] = this.minutes;
        this.currentTime = `${this.stopwatchValue[0]}:${this.stopwatchValue[1]}`;
        if (this.currentTime === '01:00') {
            this.socketClientService.send('help', 'utiliser la lettre t pour activer le mode triche ou  le lettre i pour utiliser un indice');
        }

        this.timeout = setTimeout(() => {
            this.chronoForClient();
        }, THOUSAND_MILLISECONDS / this.speed);
    }

    verifTime(min: number, sec: number) {
        if (sec > MINUTE_IN_SEC) {
            this.secInt = 0;
            this.minInt += 1;
        }
        if (min > NINETY_NINE) {
            this.minInt = 0;
            this.secInt = 0;
        }
    }

    verifTimeNeg(min: number, sec: number) {
        if (sec < 0 && min === 0) {
            this.minInt = 0;
            this.secInt = 0;
        } else if (sec < 0) {
            this.secInt = MINUTE_IN_SEC + sec + 1;
            this.minInt -= 1;
        }
    }

    formatingTime(min: number, sec: number) {
        this.minutes = min <= NINE ? '0' + min : min.toString();
        this.seconds = sec <= NINE ? '0' + sec : sec.toString();
    }
}
