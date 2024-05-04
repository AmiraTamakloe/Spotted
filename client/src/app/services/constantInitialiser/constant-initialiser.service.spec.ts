import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TEN } from '@common/global-constants';
import { of } from 'rxjs';
import { ConstantInitialiserService } from './constant-initialiser.service';

describe('ConstantInitialiserService', () => {
    let service: ConstantInitialiserService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);
        TestBed.configureTestingModule({
            providers: [ConstantInitialiserService, { provide: HttpClient, useValue: httpClientSpy }],
            imports: [HttpClientModule],
        });
        service = TestBed.inject(ConstantInitialiserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should update constants', () => {
        httpClientSpy.patch.and.returnValue(of({}));
        service.updateConstants(TEN, TEN, TEN);
        expect(httpClientSpy.patch.calls.count()).toBe(1);
    });
});
