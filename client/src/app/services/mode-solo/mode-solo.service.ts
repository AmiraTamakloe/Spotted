import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModeSoloService {
    foundDifferences: number = 0;
    nbHints: number = 0;
    foundDifferencesChanged = new EventEmitter<number>();

    getNumberOfDifferences(): number {
        return this.foundDifferences;
    }

    restart(): void {
        this.nbHints = 0;
        this.foundDifferences = 0;
    }

    incrementNumberOfDifferences() {
        this.foundDifferences++;
        this.foundDifferencesChanged.emit(this.foundDifferences);
        return this.foundDifferences;
    }
}
