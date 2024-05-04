/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';
import { EIGHT, FIFTEEN, HUNDRED, NEG_UN, NINE, SEVEN } from '@common/global-constants';

@Injectable({
    providedIn: 'root',
})
export class DifferencesAlgorithmService {
    numberOfDifferences: number;
    diffMatrix: Vec2[][];

    getNeighbors(coord: Vec2, matrix: number[][]): Vec2[] {
        const row = [NEG_UN, NEG_UN, NEG_UN, 0, 0, 1, 1, 1];
        const col = [NEG_UN, 0, 1, NEG_UN, 1, NEG_UN, 0, 1];
        const neighbours: Vec2[] = [];

        for (let k = 0; k < EIGHT; k++) {
            const x = coord.x + col[k];
            const y = coord.y + row[k];
            if (x >= 0 && x < matrix[0].length && y >= 0 && y < matrix.length) {
                neighbours.push({ x, y });
            }
        }

        return neighbours;
    }

    bfsModified(m: number[][], vis: boolean[][], coord: Vec2): Vec2[] {
        const difference: Vec2[] = [];
        const queue = [coord];
        vis[coord.y][coord.x] = true;

        while (queue.length !== 0) {
            const point = queue.shift();
            difference.push(point);

            for (const neighborPoint of this.getNeighbors(point, m)) {
                const x = neighborPoint.x;
                const y = neighborPoint.y;
                if (m[y][x] === 1 && !vis[y][x]) {
                    vis[y][x] = true;
                    queue.push(neighborPoint);
                }
            }
        }

        return difference;
    }

    differencesLocationArray(matrix: number[][]) {
        const matrixRow = matrix.length;
        const matrixColumn = matrix[0].length;
        const vis = new Array(matrixRow);
        for (let y = 0; y < matrixRow; y++) {
            vis[y] = new Array(matrixColumn);
            for (let x = 0; x < matrixColumn; x++) {
                vis[y][x] = false;
            }
        }

        let differencesCount = 0;
        this.diffMatrix = [];
        for (let yy = 0; yy < matrixRow; yy++) {
            for (let xx = 0; xx < matrixColumn; xx++) {
                if (matrix[yy][xx] === 1 && !vis[yy][xx]) {
                    const point: Vec2 = { x: xx, y: yy };
                    const differencesPos = this.bfsModified(matrix, vis, point);
                    this.diffMatrix.push(differencesPos);
                    differencesCount++;
                }
            }
        }
        this.numberOfDifferences = differencesCount;
        return this.diffMatrix;
    }

    differenceSurfaces(matrix: number[][]): number {
        const list: number[] = matrix.reduce((acc, val) => acc.concat(val), []);
        const numberOfOnes = list.filter((elem) => elem === 1).length;
        const listLength: number = list.length;
        return (numberOfOnes / listLength) * HUNDRED;
    }

    difficultyLevel(matrix: number[][]): string {
        const count = this.numberOfDifferences;
        const differencesSurface = this.differenceSurfaces(matrix);
        if (count >= 3 && count <= NINE) {
            return count >= SEVEN && differencesSurface <= FIFTEEN ? 'Difficile' : 'Facile';
        } else return 'Invalide';
    }
}
