import { ILoadOrder } from "../../interfaces/load-order/load-order.interface.js";
import { ISchema } from "../../interfaces/schema/schema.interface.js";
import { Frame } from "../../models/frame/frame.model.js";

export function generateLinearLoadOrder(schema: ISchema, startPoint: number): ILoadOrder[] {
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

export function logLinearLoadOrder(loadOrder: ILoadOrder[]) {
    loadOrder.sort((a, b) => a.order - b.order);

    console.log('LOAD_ORDER_START');
    for(let loadOrderItem of loadOrder) {
        const rowHeader = `C_${loadOrderItem.order}:`;
        const body = loadOrderItem.toLoad.map(frame => frame.index).sort((a, b) => a - b);

        const padding = ' '.repeat(7 - rowHeader.length);

        console.log(`${rowHeader}${padding}${body}`);
    }
    console.log('LOAD_ORDER_END');
}