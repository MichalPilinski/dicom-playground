import { Frame } from "../../models/frame/frame.model";
import { ISchema } from "../schema/schema.interface";

export interface ISimulator {
    loadData(data: ISchema): void;
    getCachedFrames(): Frame[];
    getFramePrerequisites(frameNumber: number): Frame[];
}