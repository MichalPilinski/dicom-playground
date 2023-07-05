import { ILoadOrder } from "../../interfaces/load-order/load-order.interface.js";
import { ISchema } from "../../interfaces/schema/schema.interface.js";
import { Frame } from "../../models/frame/frame.model.js";

export function generateLoadOrder(schema: ISchema, startPoint: number) {
    const frames = schema.frames;
    
    const loadedSet = new Set<Frame>();
    const output: ILoadOrder[] = [];

    let order = 0;

    for(let i = startPoint; i < frames.length; i++) {
        const notSeen: Frame[] = [];

        for(let item of frames[i]) {
            if(loadedSet.has(item)) continue;

            notSeen.push(item);
            loadedSet.add(item);
        }

        output.push({
            toLoad: notSeen,
            order
        });

        order++;
    }

    return output; 
}