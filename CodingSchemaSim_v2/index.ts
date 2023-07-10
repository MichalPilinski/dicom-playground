import { Simulator } from "./classes/simulator.class.js";
import { getFlattenedSchema, logFlattenedSchema } from "./helpers/schema-flattener.helper.js";
import { BSchema } from "./models/b-schema.model.js";

const bSchema = new BSchema(3);
bSchema.log();

const flattenedSchema = getFlattenedSchema(bSchema);
logFlattenedSchema(flattenedSchema);

const sim = new Simulator(bSchema);
const decodeInfo = sim.decodeFrame(3);
console.log(decodeInfo);