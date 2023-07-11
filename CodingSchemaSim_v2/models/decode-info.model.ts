export class DecodeInfo {
    decodingsCount: number;
    pCount: number;
    iCount: number;
    bCount: number;
    dependencies: number[];

    constructor() {
        this.decodingsCount = 0;

        this.pCount = 0;
        this.iCount = 0;
        this.bCount = 0;

        this.dependencies = [];
    }
}

export function addDecodeInfos(target: DecodeInfo, source: DecodeInfo) {
    target.bCount += source.bCount;
    target.iCount += source.iCount;
    target.pCount += source.pCount;

    target.decodingsCount += source.decodingsCount;

    target.dependencies.push(...source.dependencies);
}