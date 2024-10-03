import * as vscode from 'vscode';
import { CoverageProvider } from './view/coverageProvider';
import { highlightCoverage, LCOV_FILE_PATH, getCoverageFromLcov, watchLcovFile } from './utils';
import { CoverageData, CoverageFile } from './interfaces';

export class CodeCoverageProvider {
    public async showCoverage(): Promise<void> {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Nenhum arquivo aberto no editor.');
            return;
        }

        try {
            const filePath = editor.document.uri.fsPath;
            const coverageFile = await getCoverageFromLcov(filePath) as CoverageFile;  
            highlightCoverage(editor, coverageFile!.coveredLines, coverageFile!.uncoveredLines);
        } catch (error) {
            console.error(error);
            vscode.window.showErrorMessage('Erro ao processar o arquivo de cobertura.');
        }
    }

    public async refreshCoverage(): Promise<void> {
        const coverageProvider = new CoverageProvider();
        vscode.window.registerTreeDataProvider('coverageView', coverageProvider);

        const lcovData = await getCoverageFromLcov(LCOV_FILE_PATH);

        coverageProvider.setCoverageFiles(lcovData as CoverageData);
        watchLcovFile(LCOV_FILE_PATH);
    }
}