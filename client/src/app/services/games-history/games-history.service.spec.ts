import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { History } from './games-history.model';
import { HistoryService } from './games-history.service';

describe('HistoryService', () => {
    let service: HistoryService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    const history1 = new History();
    const history2 = new History();
    const newHistory = new History();
    const baseURL = environment.serverUrl;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'delete']);
        TestBed.configureTestingModule({
            providers: [HistoryService, { provide: HttpClient, useValue: httpClientSpy }],
            imports: [HttpClientModule],
        });
        service = TestBed.inject(HistoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('postHistory should post a history', (done) => {
        const mockNewHistory: History = newHistory;
        httpClientSpy.post.and.returnValue(of(mockNewHistory));
        service.postHistory(mockNewHistory).subscribe({
            next: (history) => {
                expect(history).toEqual(mockNewHistory);
                done();
            },
        });
    });

    it('removeHistory should remove all history', () => {
        httpClientSpy.delete.and.returnValue(of({}));
        service.history = [history1, history2];
        service.removeHistory();
        expect(httpClientSpy.delete.calls.count()).toBe(1);
        expect(httpClientSpy.delete.calls.argsFor(0)).toEqual([baseURL + '/history']);
    });

    it('should get history list and update the history property', (done) => {
        const mockHistoryList: History[] = [history1, history2];
        httpClientSpy.get = jasmine.createSpy('get').and.returnValue(of(mockHistoryList));

        service.historyList.subscribe({
            next: (historyList) => {
                expect(historyList).toEqual(mockHistoryList);
                expect(service.history).toEqual(mockHistoryList);
                done();
            },
        });

        expect(httpClientSpy.get.calls.count()).toBe(1);
        expect(httpClientSpy.get.calls.argsFor(0)).toEqual([baseURL + '/history']);
    });
});
