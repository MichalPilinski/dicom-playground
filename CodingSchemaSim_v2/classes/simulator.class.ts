import { FrameType } from "../enums/frame-type.enum.js";
import { DecodeInfo, addDecodeInfos } from "../models/decode-info.model.js";
import { ISchema } from "../interfaces/schema.interface.js";
import { Frame } from "../models/frame.model.js";

export class Simulator {
    private cachedFrames: Set<number>;
    private frames: Frame[];

    constructor(schema: ISchema) {
        this.frames = schema.frames;
        
        this.cachedFrames = new Set<number>();
    }

    decodeFrame(sourceIndex: number) {
        const decodeInfo = new DecodeInfo();

        const subDecodeFrame = (index: number): DecodeInfo => {
            if(this.cachedFrames.has(index)) return;

            const frame = this.frames.find((item: Frame) => item.index === index);
            decodeInfo.dependencies.push(index);

            switch(frame.type) {
                case FrameType.I: 
                    this.cachedFrames.add(index); 
                    decodeInfo.iCount++;

                    return;
                case FrameType.P:
                    decodeInfo.pCount++;
                    break;
                case FrameType.B:
                    decodeInfo.bCount++;
                    break;
            }

            for(let parent of frame.parents) {
                const parentInfo = this.decodeFrame(parent.index);
                addDecodeInfos(decodeInfo, parentInfo);
            }
            
            decodeInfo.decodingsCount++;

            this.cachedFrames.add(index);

            return decodeInfo;
        }

        subDecodeFrame(sourceIndex);
        decodeInfo.dependencies = [...new Set(decodeInfo.dependencies)].sort((a, b) => a - b);

        return decodeInfo;
    }
}