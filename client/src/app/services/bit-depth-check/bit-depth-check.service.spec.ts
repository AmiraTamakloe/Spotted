/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';

import { BitDepthCheckService } from './bit-depth-check.service';

describe('BitDepthCheckService', () => {
    let service: BitDepthCheckService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BitDepthCheckService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true when bitDepthCheck is called with wrong parameters', () => {
        let result = service.bitDepthCheck(921599);
        expect(result).toBe(true);
        result = service.bitDepthCheck(921701);
        expect(result).toBe(true);
    });

    it('should return false when bitDepthCheck is called with right parameters', () => {
        let result = service.bitDepthCheck(921601);
        expect(result).toBe(false);
        result = service.bitDepthCheck(921699);
        expect(result).toBe(false);
    });
});
