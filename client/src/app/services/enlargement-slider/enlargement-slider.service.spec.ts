import { TestBed } from '@angular/core/testing';

import { EnlargementSliderService } from './enlargement-slider.service';

describe('EnlargementSliderService', () => {
    let service: EnlargementSliderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EnlargementSliderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should be initialized to 3 at first', () => {
        expect(service.enlargementValue).toBe(3);
    });

    it('should correctly decrement the enlargement value', () => {
        const startingVal = service.enlargementValue;
        const expectedValue = 0;
        const result = service.decrement();
        expect(result).toBe(expectedValue);
        expect(service.enlargementValue).not.toBe(startingVal);
        expect(service.enlargementValue).toBe(expectedValue);
    });

    it('should correctly increment the enlargement value', () => {
        const startingVal = service.enlargementValue;
        const expectedValue = 9;
        const result = service.increment();
        expect(result).toBe(expectedValue);
        expect(service.enlargementValue).not.toBe(startingVal);
        expect(service.enlargementValue).toBe(expectedValue);
    });

    it('should not go above 15', () => {
        service.enlargementValue = 15;
        const maxValue = 15;
        const result = service.increment();
        expect(result).toBe(maxValue);
        const result2 = service.increment();
        expect(result2).toBe(maxValue);
    });

    it('should not go below 0', () => {
        service.enlargementValue = 0;
        const minValue = 0;
        const result = service.decrement();
        expect(result).toBe(minValue);
        const result2 = service.decrement();
        expect(result2).toBe(minValue);
    });

    it('should correctly increment and decrement', () => {
        const startingVal = service.enlargementValue;
        let result = service.increment();
        result = service.decrement();
        expect(result).toBe(startingVal);
        result = service.increment();
        result = service.increment();
        const expectedVal = 15;
        expect(result).toBe(expectedVal);
        result = service.decrement();
        const secondVal = 9;
        expect(result).toBe(secondVal);
    });
});
