import { FrameType } from "../enums/frame-type.enum.js";

export class DecodeTimeMapper {
    public static getTime(frameType: FrameType) {
        switch(frameType) {
            case FrameType.I: 
                return 0;
            case FrameType.B:
                return 1;
            case FrameType.P:
                return 1;
        }
    }
}