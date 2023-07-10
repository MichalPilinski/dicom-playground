import { FrameType } from "../enums/frame-type.enum.js";

export class Frame {
    index: number;
    type: FrameType;
    size: number;
    decodeTime: number;
    parents: Frame[];
}