import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { History } from './games-history.model';

@Injectable()
export class HistoryService {
    history: History[];

    readonly baseURL = environment.serverUrl;
    constructor(private http: HttpClient) {}

    get historyList() {
        return this.http.get<History[]>(this.baseURL + '/history').pipe(
            tap((history) => {
                this.history = history;
            }),
        );
    }

    postHistory(history: History) {
        return this.http.post(this.baseURL + '/history', history);
    }

    removeHistory() {
        return this.http.delete(`${this.baseURL}/history`);
    }
}
