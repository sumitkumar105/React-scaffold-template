import type { Plan, PlanStep } from '../types.js';
export declare function executeCapability(capability: string, projectPath: string, plan: Plan): Promise<void>;
export declare function executeGenericPlan(projectPath: string, plan: Plan): Promise<void>;
export declare function executeStep(projectPath: string, step: PlanStep): Promise<void>;
//# sourceMappingURL=index.d.ts.map