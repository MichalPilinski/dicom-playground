import { FrameType } from "../enums/frame-type.enum.js";
import { DecodeInfo } from "../interfaces/decode-info.interface.js";
import { ISchema } from "../interfaces/schema.interface.js";
import { Frame } from "../models/frame.model.js";

export class Simulator {
    private cachedFrames: Set<number>;
    private frames: Frame[];

    constructor(schema: ISchema) {
        this.frames = schema.frames;
        
        this.cachedFrames = new Set<number>();
    }

    decodeFrame(index: number): DecodeInfo {
        if(this.cachedFrames.has(index)) return {time: 0, size: 0, dependencies: []};

        const frame = this.frames.find(item => item.index === index);
        if(frame.type === FrameType.I) return {time: 0, size: frame.size, dependencies: [index]}

        let decodeInfo: DecodeInfo = {time: frame.decodeTime, size: frame.size, dependencies: [index]};
        for(let parent of frame.parents) {
            const parentInfo = this.decodeFrame(parent.index);

            decodeInfo.size += parentInfo.size;
            decodeInfo.time += parentInfo.time;
            decodeInfo.dependencies.push(...parentInfo.dependencies);
        }
        
        decodeInfo.dependencies = [...new Set(decodeInfo.dependencies)].sort((a, b) => a - b);
        return decodeInfo;
    }
}