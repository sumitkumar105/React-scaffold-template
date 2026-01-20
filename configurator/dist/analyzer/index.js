import { detectEntryPoint } from './detectors/entryPoint.js';
import { detectBuildTool } from './detectors/buildTool.js';
import { detectStyling } from './detectors/styling.js';
/**
 * Analyze a project's structure and configuration
 */
export async function analyzeProject(projectPath) {
    const [entryPoint, buildTool, styling] = await Promise.all([
        detectEntryPoint(projectPath),
        detectBuildTool(projectPath),
        detectStyling(projectPath),
    ]);
    return {
        entryPoint: entryPoint.file,
        buildTool: buildTool.tool,
        styling: styling.frameworks,
        hasTypeScript: entryPoint.hasTypeScript,
        srcDirectory: entryPoint.srcDirectory,
        configFiles: buildTool.configFiles,
    };
}
//# sourceMappingURL=index.js.map