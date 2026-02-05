import type { ProjectAnalysis, Plan } from '../types.js';
export type { PlanStep, Plan } from '../types.js';
/**
 * Create an execution plan for a capability.
 * Pure lookup — no AI integration.
 */
export declare function createPlan(capability: string, _analysis: ProjectAnalysis): Promise<Plan>;
//# sourceMappingURL=index.d.ts.map