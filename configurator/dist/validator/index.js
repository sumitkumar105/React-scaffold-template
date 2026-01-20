import { checkDuplicates } from './checks/duplicates.js';
import { checkConflicts } from './checks/conflicts.js';
/**
 * Validate a project before applying capabilities
 */
export async function validateProject(projectPath, capabilities) {
    const warnings = [];
    const errors = [];
    // Check for duplicate installations
    const duplicateResult = await checkDuplicates(projectPath, capabilities);
    warnings.push(...duplicateResult.warnings);
    errors.push(...duplicateResult.errors);
    // Check for conflicts between capabilities
    const conflictResult = await checkConflicts(projectPath, capabilities);
    warnings.push(...conflictResult.warnings);
    errors.push(...conflictResult.errors);
    return {
        valid: errors.length === 0,
        warnings,
        errors,
    };
}
//# sourceMappingURL=index.js.map