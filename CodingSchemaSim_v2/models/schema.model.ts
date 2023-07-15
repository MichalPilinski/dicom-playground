import { ISchema } from "../interfaces/schema.interface.js";
import { Frame } from "./frame.model.js";

export class Schema implements ISchema {
    public frames: Frame[];

    constructor() {
    }

    public log() {
        console.log('SCHEMA_START');

        for(let i = 0; i < this.frames.length; i++) {
            const rowHeader = `F_${i}:`;
            const sortedBGroup = this.frames[i].parents.map(frame => frame.index);

            const padding = ' '.repeat(7 - rowHeader.length);

            console.log(`${rowHeader}${padding}${sortedBGroup}`);
        }

        console.log('SCHEMA_END');
    }
}