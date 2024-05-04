import { Vec2 } from '@app/vec2';
import { Service } from 'typedi';

@Service()
export class ValidationService {
    isDifference(mousePosition: Vec2, diffArray: Vec2[][]): boolean {
        const clickedCoord = JSON.stringify(mousePosition);
        for (const error of diffArray) {
            for (const position of error) {
                if (JSON.stringify(position) === clickedCoord) {
                    return true;
                }
            }
        }
        return false;
    }
}
