export function generateLoadOrder(schema, startPoint) {
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
