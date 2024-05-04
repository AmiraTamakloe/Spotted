import { ValidationService } from '@app/services/validation/validation.service';
import { Vec2 } from '@app/vec2';
import { expect } from 'chai';
import { Container } from 'typedi';

describe('Validation Service', () => {
    let validationService: ValidationService;
    const diffArray: Vec2[][] = [
        [
            { x: 342, y: 97 },
            { x: 123, y: 129 },
            { x: 222, y: 220 },
            { x: 98, y: 301 },
            { x: 456, y: 306 },
        ],
        [
            { x: 201, y: 64 },
            { x: 189, y: 184 },
            { x: 24, y: 206 },
            { x: 398, y: 321 },
            { x: 403, y: 407 },
        ],
        [
            { x: 84, y: 206 },
            { x: 111, y: 126 },
            { x: 272, y: 367 },
            { x: 623, y: 29 },
            { x: 503, y: 195 },
        ],
    ];
    beforeEach(async () => {
        validationService = Container.get(ValidationService);
    });

    it('should correctly detect differences', () => {
        const val1 = validationService.isDifference({ x: 503, y: 195 }, diffArray);
        const val2 = validationService.isDifference({ x: 189, y: 184 }, diffArray);
        const val3 = validationService.isDifference({ x: 100, y: 200 }, diffArray);
        expect(val1).to.equal(true);
        expect(val2).to.equal(true);
        expect(val3).to.equal(false);
    });
});
