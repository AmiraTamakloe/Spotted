import { TestBed } from '@angular/core/testing';
import { FIFTEEN } from '@common/global-constants';
import { DifferencesAlgorithmService } from './differences-algorithm.service';

describe('DifferencesAlgorithmService', () => {
    let service: DifferencesAlgorithmService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DifferencesAlgorithmService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should expect matrix level to be easy', () => {
        const matrix = [
            [1, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1],
        ];
        const value = service.differenceSurfaces(matrix);
        const percent = 30;
        expect(value).toBe(percent);
        const value2 = service.difficultyLevel(matrix);
        expect(value2).toBe('Invalide');
    });

    it('returns 0 when the matrix is empty', () => {
        const matrix = [[0]];
        const result = service.differenceSurfaces(matrix);
        expect(result).toBe(0);
    });

    it('should expect matrix level to be difficult', () => {
        const matrix = [
            [0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        ];
        const value = service.differenceSurfaces(matrix);
        const percent = 11.818181818181818;
        expect(value).toBeCloseTo(percent);
    });

    it('should return the correct percentage of one in the matrix', () => {
        const expectedMatrix = [
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        ];
        const result = service.differenceSurfaces(expectedMatrix);
        const percent = 50;
        expect(result).toEqual(percent);
        const difficultyLevel = service.difficultyLevel(expectedMatrix);
        expect(difficultyLevel).toBe('Invalide');
    });

    it('should return the correct array of locations of differences', () => {
        const matrix = [
            [0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        ];
        const expected = [
            [{ x: 1, y: 0 }],
            [
                { x: 5, y: 0 },
                { x: 6, y: 0 },
            ],
            [
                { x: 1, y: 3 },
                { x: 2, y: 4 },
            ],
            [{ x: 6, y: 5 }],
            [{ x: 9, y: 6 }],
            [{ x: 1, y: 9 }],
            [
                { x: 5, y: 10 },
                { x: 6, y: 10 },
                { x: 7, y: 10 },
                { x: 8, y: 10 },
                { x: 9, y: 10 },
            ],
        ];
        const result = service.differencesLocationArray(matrix);
        expect(result).toEqual(expected);
    });
    it('should return "Facile" when there are 3 differences and difference surface is greater than 15%', () => {
        const matrix = [
            [0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        ];
        service.numberOfDifferences = 3;
        const result = service.difficultyLevel(matrix);
        expect(result).toBe('Facile');
    });

    it('should mark all connected points as visited', () => {
        const matrix = [
            [0, 0, 0],
            [0, 1, 1],
            [0, 1, 0],
        ];
        const vis = [
            [false, false, false],
            [false, false, false],
            [false, false, false],
        ];
        const coord = { x: 1, y: 1 };
        service.bfsModified(matrix, vis, coord);
        expect(vis).toEqual([
            [false, false, false],
            [false, true, true],
            [false, true, false],
        ]);
    });

    it('should return the right neighbours', () => {
        const matrix = [
            [1, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1],
        ];
        expect(service.getNeighbors({ x: 0, y: 1 }, matrix)).toEqual([
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
        ]);
    });
    it('should return the right neighbours for a coordinates surrounded by other coordinates', () => {
        const matrix = [
            [1, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1],
        ];
        expect(service.getNeighbors({ x: 1, y: 1 }, matrix)).toEqual([
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: 1 },
            { x: 2, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
        ]);
    });
    it('should return the right neighbours for a corner point', () => {
        const matrix = [
            [1, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1],
        ];
        expect(service.getNeighbors({ x: 0, y: 0 }, matrix)).toEqual([
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
        ]);
    });
    it('should return "Difficile" when there are 7 or more differences and difference surface is 15% or less', () => {
        const matrix = [
            [1, 1, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1],
        ];
        service.numberOfDifferences = 7;
        spyOn(service, 'differenceSurfaces').and.returnValue(FIFTEEN);
        const result = service.difficultyLevel(matrix);
        expect(result).toBe('Difficile');
    });
    it('should return "Facile" when there are between 3 and 9 differences and difference surface is less than or equal to 15%', () => {
        const matrix = [
            [0, 1, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
        ];
        service.numberOfDifferences = 3;
        const result = service.difficultyLevel(matrix);
        expect(result).toBe('Facile');
    });
});
