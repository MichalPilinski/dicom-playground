import { DecodeTimeMapper } from "../classes/decode-time.mapper.js";
import { FrameSizeMapper } from "../classes/frame-size.mapper.js";
import { FrameType } from "../enums/frame-type.enum.js";
import { Frame } from "./frame.model.js";
import { Schema } from "./schema.model.js";

export class NoSchema extends Schema {
    public frames: Frame[];

    private length: number;

    constructor(generation: number) {
        super();

        this.frames = [];

        this.length = generation;
        this.generateSchema();
    }

    private generateSchema() {
        for(let i = 0; i < this.length; i++) {
            this.frames.push({
                index: i,
                type: FrameType.I,
                size: FrameSizeMapper.getSize(FrameType.I),
                decodeTime: DecodeTimeMapper.getTime(FrameType.I),
                parents: []
            })
        }
    }
}