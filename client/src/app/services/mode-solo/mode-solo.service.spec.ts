import { TestBed } from '@angular/core/testing';
import { ModeSoloService } from './mode-solo.service';

describe('ModeSoloService', () => {
    let service: ModeSoloService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ModeSoloService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the correct number of differences', () => {
        expect(service.getNumberOfDifferences()).toEqual(0);
        service.incrementNumberOfDifferences();
        expect(service.getNumberOfDifferences()).toEqual(1);
    });

    it('should restart', () => {
        service.incrementNumberOfDifferences();
        service.restart();
        expect(service.getNumberOfDifferences()).toEqual(0);
        expect(service['nbHints']).toEqual(0);
    });

    it('should increment the number of differences and emit an event', () => {
        spyOn(service.foundDifferencesChanged, 'emit');
        const incrementedDifferences = service.incrementNumberOfDifferences();
        expect(service.getNumberOfDifferences()).toEqual(1);
        expect(service.foundDifferencesChanged.emit).toHaveBeenCalledWith(incrementedDifferences);
    });
});
