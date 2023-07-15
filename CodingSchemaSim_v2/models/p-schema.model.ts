import { DecodeTimeMapper } from "../classes/decode-time.mapper.js";
import { FrameSizeMapper } from "../classes/frame-size.mapper.js";
import { FrameType } from "../enums/frame-type.enum.js";
import { Frame } from "./frame.model.js";
import { Schema } from "./schema.model.js";

export class PSchema extends Schema {
    public frames: Frame[];

    private length: number;

    constructor(generation: number) {
        super();

        this.frames = [];

        this.length = generation + 1;
        this.generateSchema();
    }

    private generateSchema() {
        const firstFrame = this.getFirstFrame();
        this.frames.push(firstFrame);
        
        let previousFrame = firstFrame;
        for(let i = 1; i < this.length; i++) {
            const currentFrame = this.getNthFrame(i);
            currentFrame.parents.push(previousFrame);
            this.frames.push(currentFrame);

            previousFrame = currentFrame;
        }
    }

    private getFirstFrame(): Frame {
        return {
            index: 0,
            type: FrameType.I,
            size: FrameSizeMapper.getSize(FrameType.I),
            decodeTime: DecodeTimeMapper.getTime(FrameType.I),
            parents: []
        }
    }

    private getNthFrame(index: number): Frame {
        return {
            index,
            type: FrameType.P,
            size: FrameSizeMapper.getSize(FrameType.P),
            decodeTime: DecodeTimeMapper.getTime(FrameType.P),
            parents: []
        }
    }
}