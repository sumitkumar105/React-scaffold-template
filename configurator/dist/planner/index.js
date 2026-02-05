import { TAILWIND_PLAN } from './prompts/tailwind.js';
import { FORMS_PLAN } from './prompts/forms.js';
import { REACT_QUERY_PLAN } from './prompts/reactQuery.js';
import { REDUX_PLAN } from './prompts/redux.js';
/**
 * Create an execution plan for a capability.
 * Pure lookup — no AI integration.
 */
export async function createPlan(capability, _analysis) {
    let steps;
    switch (capability) {
        case 'tailwind':
            steps = TAILWIND_PLAN.steps;
            break;
        case 'redux':
            steps = REDUX_PLAN.steps;
            break;
        case 'reactQuery':
            steps = REACT_QUERY_PLAN.steps;
            break;
        case 'forms':
            steps = FORMS_PLAN.steps;
            break;
        default:
            throw new Error(`Unknown capability: ${capability}`);
    }
    return {
        capability,
        steps,
    };
}
//# sourceMappingURL=index.js.map