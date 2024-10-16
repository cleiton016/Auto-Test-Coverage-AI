import * as vscode from 'vscode';
import { CoverageProvider } from '@view/tree-view/coverageProvider';
import { highlightCoverage, LCOV_FILE_PATH, getCoverageFromLcov, watchLcovFile, $selectedCoverageType, onSelectedCoverageTypeChanged } from '@/utils';
import { CoverageData, CoverageFile } from '@/interfaces';
import { SelectTypeCoverageProvider } from './view/select-type-coverage/selectTypeCoverageProvider';

export class CodeCoverageProvider {
    private coverageProvider: CoverageProvider = new CoverageProvider();
    private selectTypeCoverageProvider: SelectTypeCoverageProvider = new SelectTypeCoverageProvider();
    private selectedType: string | undefined;
    constructor() {
        this.selectTypeCoverageProvider.setCoverageTypes(['Lines', 'Functions', 'Branches']);
        vscode.window.registerTreeDataProvider('coverageView', this.coverageProvider);
        vscode.window.registerTreeDataProvider('typeCoverage', this.selectTypeCoverageProvider);
        onSelectedCoverageTypeChanged((type) => {
            this.selectedType = type;
            this.selectTypeCoverageProvider.refresh();
        });
        
        this.refreshCoverage();
    }

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
        console.log('Refreshing coverage data...');
        const lcovData = await getCoverageFromLcov(LCOV_FILE_PATH);

        this.coverageProvider.setCoverageFiles(lcovData as CoverageData, this.selectedType);
        watchLcovFile(LCOV_FILE_PATH);
    }

    public refreshTree(): void {
        this.coverageProvider.refresh();
    }
    // Expor o método locateAndExpandFile
    public locateAndExpandFile(filePath: string): void {
        this.coverageProvider.locateAndExpandFile(filePath);
    }

    public getParent(file): void {
        console.log('File: ', file);
        
        const element = this.coverageProvider.getElement(file);
        console.log('Element: ', element);
        console.log('Parent: ', this.coverageProvider.getParents(element));
    }

    get selectedCoverageType(): string {
        return this.selectedType!;
    }
}