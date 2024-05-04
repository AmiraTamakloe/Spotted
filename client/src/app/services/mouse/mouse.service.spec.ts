import { TestBed } from '@angular/core/testing';
import { MouseButton, MouseService } from './mouse.service';

describe('MouseService', () => {
    let service: MouseService;
    const leftMouseEvent = new MouseEvent('click', { button: MouseButton.Left });
    const rightMouseEvent = new MouseEvent('click', { button: MouseButton.Right });
    const keyboardEvent = new KeyboardEvent('keydown', { key: 'test' });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseService);
    });

    it('should return true when left mouse button is clicked', () => {
        expect(service.leftClickDetect(leftMouseEvent)).toBe(true);
    });

    it('should return false when non-left mouse button is clicked', () => {
        expect(service.leftClickDetect(rightMouseEvent)).toBe(false);
    });

    it('should update buttonPressed with the key of the pressed button', () => {
        service.buttonDetect(keyboardEvent);
        expect(service.buttonPressed).toBe('test');
    });
});
