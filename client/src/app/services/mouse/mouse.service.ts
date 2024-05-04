import { HostListener, Injectable } from '@angular/core';
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}
@Injectable({
    providedIn: 'root',
})
export class MouseService {
    buttonPressed = '';

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    leftClickDetect(event: MouseEvent): boolean {
        return event.button === MouseButton.Left;
    }
}
