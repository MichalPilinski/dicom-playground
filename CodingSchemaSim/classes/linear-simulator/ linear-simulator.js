export function generateLinearLoadOrder(schema, startPoint) {
    const frames = schema.frames;
    const loadedSet = new Set();
    const output = [];
    let order = 0;
    for (let i = startPoint; i < frames.length; i++) {
        const notSeen = [];
        for (let item of frames[i]) {
            if (loadedSet.has(item))
                continue;
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
export function logLinearLoadOrder(loadOrder) {
    loadOrder.sort((a, b) => a.order - b.order);
    console.log('LOAD_ORDER_START');
    for (let loadOrderItem of loadOrder) {
        const rowHeader = `C_${loadOrderItem.order}:`;
        const body = loadOrderItem.toLoad.map(frame => frame.index).sort((a, b) => a - b);
        const padding = ' '.repeat(7 - rowHeader.length);
        console.log(`${rowHeader}${padding}${body}`);
    }
    console.log('LOAD_ORDER_END');
}
