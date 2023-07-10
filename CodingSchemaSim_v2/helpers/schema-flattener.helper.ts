import { ISchema } from "../interfaces/schema.interface";
import { Frame } from "../models/frame.model";

export function getFlattenedSchema(schema: ISchema): number[][] {
    const frames = schema.frames.sort((a, b) => a.index - b.index);

    const output: number[][] = [];

    for(let frame of frames) {
        const frameDependencies = getDependecies(frame);
        output.push(frameDependencies)
    }

    return output;
}

export function logFlattenedSchema(flattenedFrames: number[][]) {
    console.log('FLATTENED_SCHEMA_START');
    for(let i = 0; i < flattenedFrames.length; i++) {
        const rowHeader = `F_${i}:`;
        const padding = ' '.repeat(7 - rowHeader.length);

        const dependeciesString = flattenedFrames[i].join(', ');

        console.log(`${rowHeader}${padding}${dependeciesString}`);
    }
    console.log('FLATTENED_SCHEMA_END');
}

function getDependecies(frame: Frame): number[] {
    const dependecies: number[] = [];

    dependecies.push(frame.index);
    for(let parent of frame.parents) {
        dependecies.push(parent.index);

        const subDependencies = getDependecies(parent);
        dependecies.push(...subDependencies);
    }

    return [... new Set(dependecies)].sort((a, b) => a - b);
}
