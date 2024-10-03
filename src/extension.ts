import * as vscode from 'vscode';
import { getCoverageFromLcov, highlightCoverage, LCOV_FILE_PATH } from './utils';
import { CodeCoverageProvider } from './codeCoverageProvider';
import { CoverageFile } from './interfaces';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const codeCoverageProvider = new CodeCoverageProvider();

	const disposable = vscode.commands.registerCommand('auto-test-coverage-ai.showCoverage', () => {
        codeCoverageProvider.showCoverage();
    });
    context.subscriptions.push(disposable);

    // Refresh the coverage view when the lcov.info file changes
    const covRefresh = vscode.commands.registerCommand('auto-test-coverage-ai.refreshCoverage', () => {
        codeCoverageProvider.refreshCoverage();
    });
    context.subscriptions.push(covRefresh);

    // Open file in editor when clicking on the coverage item
    const openFile = vscode.commands.registerCommand('auto-test-coverage-ai.openFile', (resourceUri: vscode.Uri) => {
        vscode.window.showTextDocument(resourceUri).then(async editor => {
            const data = await getCoverageFromLcov(LCOV_FILE_PATH , editor.document.uri.fsPath) as CoverageFile
            highlightCoverage(editor, data.coveredLines, data.uncoveredLines); // Aplica as decorações
        });
    });
    context.subscriptions.push(openFile);
    
}

// This method is called when your extension is deactivated
export function deactivate() {}


