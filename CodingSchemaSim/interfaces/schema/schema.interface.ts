import { Frame } from "../../models/frame/frame.model.js";

export interface ISchema {
    frames: Set<Frame>[];
}