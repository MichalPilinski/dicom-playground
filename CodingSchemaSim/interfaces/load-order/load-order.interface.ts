import { Frame } from "../../models/frame/frame.model.js";

export interface ILoadOrder {
    order: number;
    toLoad: Frame[];
}