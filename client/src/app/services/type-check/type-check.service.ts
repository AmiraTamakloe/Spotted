import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TypeCheckService {
    typeCheck(notBMP: string): boolean {
        if (notBMP !== 'bmp') {
            return true;
        } else {
            return false;
        }
    }
}
