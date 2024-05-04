import { TestBed } from '@angular/core/testing';
import { THREE } from 'src/global-constants/global-constants';
import { SpeedSliderService } from './replay-speed.service';

describe('SpeedSliderService', () => {
    let service: SpeedSliderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SpeedSliderService],
        });
        service = TestBed.inject(SpeedSliderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('decrement', () => {
        it('should return the current speed if it is already at the minimum value', () => {
            spyOn(service.allowedValues, 'indexOf').and.returnValue(0);
            const result = service.decrement();
            expect(result).toEqual(1);
        });

        it('should decrement the speed if it is not at the minimum value', () => {
            spyOn(service.allowedValues, 'indexOf').and.returnValue(1);
            const result = service.decrement();
            expect(result).toEqual(1);
            expect(service.speed).toEqual(1);
        });
    });

    describe('increment', () => {
        it('should return the current speed if it is already at the maximum value', () => {
            spyOn(service.allowedValues, 'indexOf').and.returnValue(2);
            const result = service.increment();
            expect(result).toEqual(1);
        });

        it('should increment the speed if it is not at the maximum value', () => {
            spyOn(service.allowedValues, 'indexOf').and.returnValue(1);
            const result = service.increment();
            expect(result).toEqual(THREE);
            expect(service.speed).toEqual(THREE);
        });
    });
});
