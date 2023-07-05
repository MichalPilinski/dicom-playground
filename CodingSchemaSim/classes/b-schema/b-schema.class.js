import { FrameType } from "../../enums/frame-type.enum.js";
export class BSchema {
    constructor(generation) {
        const length = this.getNthPiramidLength(generation);
        this.frames = this.generateBSchema(length);
    }
    getNthPiramidLength(n) {
        if (n < 1)
            throw new Error('There is no piramid with height smaller that 1');
        let nthGen = 3;
        for (let i = 1; i < n; i++) {
            nthGen = (nthGen * 2) - 1;
        }
        return nthGen;
    }
    generateBSchema(length) {
        const group = [];
        const fistFrame = { index: 0, type: FrameType.I };
        const lastFrame = { index: length - 1, type: FrameType.I };
        group[0] = new Set([fistFrame]);
        group[length - 1] = new Set([lastFrame]);
        function generatePart(start, end) {
            const middle = Math.floor((start.index + end.index) / 2);
            if (middle === start.index || middle === end.index)
                return;
            const middleFrame = { index: middle, type: FrameType.B };
            const lSet = group[start.index];
            const rSet = group[end.index];
            group[middle] = new Set([...lSet, ...rSet, start, end, middleFrame]);
            generatePart(start, middleFrame);
            generatePart(middleFrame, end);
        }
        generatePart(fistFrame, lastFrame);
        return group;
    }
    log() {
        console.log('B_GROUP_START');
        for (let i = 0; i < this.frames.length; i++) {
            const rowHeader = `F_${i}:`;
            const sortedBGroup = [...this.frames[i]].map(frame => frame.index).sort((a, b) => a - b);
            const padding = ' '.repeat(7 - rowHeader.length);
            console.log(`${rowHeader}${padding}${sortedBGroup}`);
        }
        console.log('B_GROUP_END');
    }
}
