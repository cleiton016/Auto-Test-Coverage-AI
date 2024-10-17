import * as vscode from 'vscode';
import { CoverageProvider } from '@view/tree-view/coverageProvider';
import { highlightCoverage, LCOV_FILE_PATH, getCoverageFromLcov, watchLcovFile, $selectedCoverageType, onSelectedCoverageTypeChanged } from '@/utils';
import { CoverageData, CoverageFile } from '@/interfaces';
import { SelectTypeCoverageProvider } from './view/select-type-coverage/selectTypeCoverageProvider';
import { CoverageItem } from './view/tree-view/coverageItem';

export class CodeCoverageProvider {
    private coverageProvider: CoverageProvider = new CoverageProvider();
    private selectTypeCoverageProvider: SelectTypeCoverageProvider = new SelectTypeCoverageProvider();
    private selectedType: string | undefined;
    private treeView: vscode.TreeView<CoverageItem>;

    constructor() {
        this.selectTypeCoverageProvider.setCoverageTypes(['Lines', 'Functions', 'Branches']);

        // Use createTreeView para a cobertura
        this.treeView = vscode.window.createTreeView('coverageView', {
            treeDataProvider: this.coverageProvider
        });
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
        const fileOpened = vscode.window.activeTextEditor?.document.uri.fsPath;
        if (fileOpened) {
            this.locateAndExpandFile(fileOpened);
        }
        watchLcovFile(LCOV_FILE_PATH);
    }

    // Método para localizar e expandir o arquivo
    public locateAndExpandFile(filePath: string): void {
        const item = this.coverageProvider.getElement(filePath);
        this.treeView.reveal(item, { select: true, focus: true, expand: true });
    }

    get selectedCoverageType(): string {
        return this.selectedType!;
    }
}
