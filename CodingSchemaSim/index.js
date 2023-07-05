import { BSchema } from "./classes/b-schema/b-schema.class.js";
import { generateLoadOrder } from "./classes/simulator/simulator.js";
const bGroup = new BSchema(5);
bGroup.log();
const sim = generateLoadOrder(bGroup, 1);
function logSim(sim) {
    for (let i = 0; i < sim.length; i++)
        console.log(sim[i].toLoad.map(frame => 1).reduce((a, b) => a + b, 0));
}
logSim(sim);
