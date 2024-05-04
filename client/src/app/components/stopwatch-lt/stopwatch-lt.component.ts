import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Constants } from '@app/interfaces/constants';
import { ConstantInitialiserService } from '@app/services/constantInitialiser/constant-initialiser.service';
import { SocketClientService } from '@app/services/socket-client/socket-client.service';
import { MINUTE_IN_SEC, NINE, NINETY_NINE, TEN, THIRTY, THOUSAND_MILLISECONDS } from '@common/global-constants';

@Component({
    selector: 'app-stopwatch-lt',
    templateUrl: './stopwatch-lt.component.html',
    styleUrls: ['./stopwatch-lt.component.scss'],
})
export class StopwatchLtComponent implements OnInit, OnDestroy {
    @Input() isTimeOut: boolean;
    @Output() timeOutEvent = new EventEmitter<boolean>(false);
    @Output() finalTime = new EventEmitter<string>();
    countdownDuration = THIRTY;
    penalty: number = TEN;
    bonus: number = THIRTY;
    minutes: string = '0';
    seconds: string = '0';
    stopwatchValue: string[] = [this.minutes, this.seconds];
    minInt: number = +this.minutes;
    secInt: number = +this.seconds;
    constructor(private socketClientService: SocketClientService, private constantInitialiser: ConstantInitialiserService) {}

    ngOnInit(): void {
        this.constantInitialiser.getConstants().subscribe((data: Constants) => {
            this.countdownDuration = data.timeLimit;
            this.penalty = data.timePenalty;
            this.bonus = data.timeGain;
            this.initiateTimer();
        });
        this.socketClientService.on('bonusTime', () => {
            this.secInt += this.bonus;
            this.verifTime(this.minInt, this.secInt);
            this.verifTimeNeg(this.minInt, this.secInt);
            this.formattingTime(this.minInt, this.secInt);
            this.stopwatchValue[1] = this.seconds;
            this.stopwatchValue[0] = this.minutes;
        });
        this.socketClientService.on('penaltyTime', () => {
            this.secInt -= this.penalty;
            this.verifTimeNeg(this.minInt, this.secInt);
            this.verifTime(this.minInt, this.secInt);
            this.formattingTime(this.minInt, this.secInt);
            this.stopwatchValue[1] = this.seconds;
            this.stopwatchValue[0] = this.minutes;
        });
    }
    initiateTimer() {
        this.minInt = Math.floor(this.countdownDuration / MINUTE_IN_SEC);
        this.secInt = this.countdownDuration % MINUTE_IN_SEC;
        this.formattingTime(this.minInt, this.secInt);
        this.stopwatchValue[1] = this.seconds;
        this.stopwatchValue[0] = this.minutes;
        this.countdownForClient();
    }

    ngOnDestroy(): void {
        this.finalTime.emit(`${this.stopwatchValue[0]}:${this.stopwatchValue[1]}`);
        return;
    }

    countdownForClient() {
        if (this.isTimeOut) {
            return;
        }
        if (this.minInt === 0 && this.secInt === 0) {
            this.timeOutEvent.emit(true);
            return;
        }
        this.secInt -= 1;
        this.verifTimeNeg(this.minInt, this.secInt);
        this.formattingTime(this.minInt, this.secInt);
        this.stopwatchValue[1] = this.seconds;
        this.stopwatchValue[0] = this.minutes;
        setTimeout(() => {
            this.countdownForClient();
        }, THOUSAND_MILLISECONDS);
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

    formattingTime(min: number, sec: number) {
        this.minutes = min <= NINE ? '0' + min : min.toString();
        this.seconds = sec <= NINE ? '0' + sec : sec.toString();
    }
}
