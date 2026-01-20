import type { Plan, PlanStep } from '../planner/index.js';
/**
 * Execute a capability plan
 */
export declare function executeCapability(capability: string, projectPath: string, plan: Plan): Promise<void>;
/**
 * Execute a generic plan (fallback for unknown capabilities)
 */
export declare function executeGenericPlan(projectPath: string, plan: Plan): Promise<void>;
/**
 * Execute a single plan step
 */
export declare function executeStep(projectPath: string, step: PlanStep): Promise<void>;
//# sourceMappingURL=index.d.ts.map