import { Injectable } from '@angular/core';
import { THREE } from '@common/global-constants';
@Injectable({
    providedIn: 'root',
})
export class SpeedSliderService {
    speed: number = 1;
    readonly allowedValues = [1, 2, THREE];

    decrement(): number {
        const currentIndex = this.allowedValues.indexOf(this.speed);
        if (currentIndex > 0) {
            this.speed = this.allowedValues[currentIndex - 1];
        }
        return this.speed;
    }

    increment(): number {
        const currentIndex = this.allowedValues.indexOf(this.speed);
        if (currentIndex < this.allowedValues.length - 1) {
            this.speed = this.allowedValues[currentIndex + 1];
        }
        return this.speed;
    }
}
