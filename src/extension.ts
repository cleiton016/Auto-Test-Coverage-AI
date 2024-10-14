import * as vscode from 'vscode';
import { CodeCoverageProvider } from '@/codeCoverageProvider';
import { $selectedCoverageType, showCoverageReport } from './utils';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    const codeCoverageProvider = new CodeCoverageProvider();
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            codeCoverageProvider.refreshCoverage();
        }
    });
    const showCoverage = vscode.commands.registerCommand('auto-test-coverage-ai.showCoverage', () => {
        codeCoverageProvider.showCoverage();
    });
    context.subscriptions.push(showCoverage);

    // Refresh the coverage view when the lcov.info file changes
    const covRefresh = vscode.commands.registerCommand('auto-test-coverage-ai.refreshCoverage', () => {
        codeCoverageProvider.refreshCoverage();
    });
    context.subscriptions.push(covRefresh);

    // Open file in editor when clicking on the coverage item
    const openFile = vscode.commands.registerCommand('auto-test-coverage-ai.openFile', (resourceUri: vscode.Uri) => {
        vscode.window.showTextDocument(resourceUri).then(async editor => {
            showCoverageReport(editor, codeCoverageProvider.selectedCoverageType);
        });
    });
    context.subscriptions.push(openFile);


    // Select coverage type
    const selectCoverageType = vscode.commands.registerCommand('auto-test-coverage-ai.selectCoverageType', async (select: string) => {
        $selectedCoverageType.fire(select);
    })

    context.subscriptions.push(selectCoverageType);   

    $selectedCoverageType.fire('lines');
}

// This method is called when your extension is deactivated
export function deactivate() { }