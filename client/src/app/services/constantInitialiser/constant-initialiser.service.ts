/* eslint-disable @typescript-eslint/no-empty-function */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@app/interfaces/constants';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConstantInitialiserService {
    baseUrl = environment.serverUrl;
    constructor(public http: HttpClient) {}

    getConstants() {
        return this.http.get<Constants>(`${this.baseUrl}/constants`);
    }

    updateConstants(limit: number, penalty: number, gain: number): void {
        const newConsts = { timeLimit: limit, timePenalty: penalty, timeGain: gain };
        newConsts.toString();
        this.http.patch(`${this.baseUrl}/constants`, newConsts).subscribe(() => {});
    }
}
