import { FrameType } from "../enums/frame-type.enum.js";

export class FrameSizeMapper {
    public static getSize(frameType: FrameType) {
        switch(frameType) {
            case FrameType.I: 
                return 1;
            case FrameType.B:
                return 0.25;
            case FrameType.P:
                return 0.25;
        }
    }
}