import { BSchema } from "./classes/b-schema/b-schema.class.js";
import { generateLinearLoadOrder, logLinearLoadOrder } from "./classes/linear-simulator/ linear-simulator.js";

const bGroup = new BSchema(4);
bGroup.log();

const sim = generateLinearLoadOrder(bGroup, 0);
logLinearLoadOrder(sim);