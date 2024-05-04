import { Injectable } from '@angular/core';
import { FIFTEEN, NINE } from '@common/global-constants';
@Injectable({
    providedIn: 'root',
})
export class EnlargementSliderService {
    enlargementValue: number = 3;
    readonly allowedValues = [0, 3, NINE, FIFTEEN];

    decrement(): number {
        const currentIndex = this.allowedValues.indexOf(this.enlargementValue);
        if (currentIndex > 0) {
            this.enlargementValue = this.allowedValues[currentIndex - 1];
        }
        return this.enlargementValue;
    }

    increment(): number {
        const currentIndex = this.allowedValues.indexOf(this.enlargementValue);
        if (currentIndex < this.allowedValues.length - 1) {
            this.enlargementValue = this.allowedValues[currentIndex + 1];
        }
        return this.enlargementValue;
    }
}
