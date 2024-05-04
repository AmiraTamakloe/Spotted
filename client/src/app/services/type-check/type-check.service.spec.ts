import { TestBed } from '@angular/core/testing';

import { TypeCheckService } from './type-check.service';

describe('TypeCheckService', () => {
    let service: TypeCheckService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TypeCheckService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true when bitDepthCheck is called with wrong parameters', () => {
        let result = service.typeCheck('jpeg');
        expect(result).toBe(true);
        result = service.typeCheck('png');
        expect(result).toBe(true);
        result = service.typeCheck('bpm');
        expect(result).toBe(true);
        result = service.typeCheck('word');
        expect(result).toBe(true);
    });

    it('should return false when bitDepthCheck is called with right parameters', () => {
        const result = service.typeCheck('bmp');
        expect(result).toBe(false);
    });
});
