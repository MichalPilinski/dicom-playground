import { Simulator } from "./classes/simulator.class.js";
import { getFlattenedSchema, logFlattenedSchema } from "./helpers/schema-flattener.helper.js";
import { BSchema } from "./models/b-schema.model.js";

const bSchema = new BSchema(6);
//bSchema.log();

const flattenedSchema = getFlattenedSchema(bSchema);
//logFlattenedSchema(flattenedSchema);

const sim = new Simulator(bSchema);

let averageEfford = 0;
for(let i = 0; i < flattenedSchema.length; i++) {
    const simOutput = sim.decodeFrame(i);

    const efford = simOutput.decodingsCount * 0.25 + simOutput.bCount * 0.25 + simOutput.iCount;
    averageEfford += efford;
}

console.log('Avg: ', averageEfford / flattenedSchema.length);