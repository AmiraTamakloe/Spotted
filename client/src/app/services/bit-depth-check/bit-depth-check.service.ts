import { Injectable } from '@angular/core';
import { IMAGE_SIZE_HIGHER_INTERVAL, IMAGE_SIZE_LOWER_INTERVAL } from '@common/global-constants';

@Injectable({
    providedIn: 'root',
})
export class BitDepthCheckService {
    bitDepthCheck(size: number): boolean {
        if (size <= IMAGE_SIZE_LOWER_INTERVAL || size >= IMAGE_SIZE_HIGHER_INTERVAL) {
            return true;
        } else {
            return false;
        }
    }
}
