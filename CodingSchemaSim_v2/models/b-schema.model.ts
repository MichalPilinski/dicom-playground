import { DecodeTimeMapper } from "../classes/decode-time.mapper.js";
import { FrameSizeMapper } from "../classes/frame-size.mapper.js";
import { FrameType } from "../enums/frame-type.enum.js";
import { Frame } from "./frame.model.js";
import { Schema } from "./schema.model.js";

export class BSchema extends Schema {
    public frames: Frame[];

    private length: number;

    constructor(generation: number) {
        super();
        
        this.frames = [];

        this.length = this.getNthPiramidLength(generation);
        this.generateBSchema();
    }

    private getNthPiramidLength(n: number): number {
        if(n < 1) throw new Error('There is no piramid with height smaller that 1');
    
        let nthGen = 3;
        for(let i = 1; i < n; i++) {
            nthGen = (nthGen * 2) - 1;
        }
    
        return nthGen;
    }

    private generateBSchema() {
        const [firstFrame, lastFrame] = this.getBorderFrames();

        this.frames[0] = firstFrame;
        this.frames[this.length - 1] = lastFrame;
        
        function getBFrame(index: number, parents: Frame[]): Frame {
            return {
                index,
                type: FrameType.B,
                size: FrameSizeMapper.getSize(FrameType.B),
                decodeTime: DecodeTimeMapper.getTime(FrameType.B),
                parents
            }
        }

        const generatePart = (startIdx: number, endIdx: number) => {
            const middleIdx = Math.floor((startIdx + endIdx) / 2);
            if(middleIdx === startIdx || middleIdx === endIdx) return;
            
            const parents = [this.frames[startIdx], this.frames[endIdx]];
            
            this.frames[middleIdx] = getBFrame(middleIdx, parents);

            generatePart(startIdx, middleIdx);
            generatePart(middleIdx, endIdx);
        }
    
        generatePart(0, this.length - 1);
    }

    private getBorderFrames(): [Frame, Frame] {
        const getBaseFrame = (idx: number) => ({
            index: idx,
            type: FrameType.I,
            size: FrameSizeMapper.getSize(FrameType.I),
            decodeTime: DecodeTimeMapper.getTime(FrameType.I),
            parents: []
        });

        return [getBaseFrame(0), getBaseFrame(this.length - 1)];
    }
}