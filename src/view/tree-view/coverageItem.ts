import * as vscode from 'vscode';
import path from 'path';

export class CoverageItem extends vscode.TreeItem {
    children: CoverageItem[] | undefined;

    Uri: vscode.Uri | undefined;
    
    constructor(
        public label: string,
        public collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly resourceUri?: vscode.Uri,
        public readonly percentages?:  { lines: number, functions: number, branches: number },
        public readonly typeCov?: string
    ) {
        super(label, collapsibleState);
        this.id = label;

        this.setTooltipAndDescription();
        this.openFile();
        
    }

    private setTooltipAndDescription() {
        if (this.percentages !== undefined) {
            this.description = `${this.percentages.lines.toFixed(0)}% | ${this.percentages.functions.toFixed(0)}% | ${this.percentages.branches.toFixed(0)}%`;
            // Markdown para exibir a porcentagem de cobertura para todos os tipos
            this.tooltip = new vscode.MarkdownString(`
                Linhas: ${this.percentages.lines.toFixed(0)+'%'} | Funções: ${this.percentages.functions.toFixed(0)+'%'} | Branches: ${this.percentages.branches.toFixed(0)+'%'}`);
            // Define o ícone do arquivo com base na cobertura
            this.iconPath = this.getIconForCoverage(this.percentages.lines!);
        } else {
            // Ícone de pasta
            this.iconPath = new vscode.ThemeIcon('folder');
        };
    }

    private openFile() {
        if (this.resourceUri) {
            // Deve pegar o caminho completo do arquivo para abrir no editor
            const fullPathUri =  vscode.Uri.file(path.join(vscode.workspace.rootPath || '', this.resourceUri.fsPath))
            this.command = {
                command: 'auto-test-coverage-ai.openFile',
                title: 'Open File',
                arguments: [fullPathUri]
            };
        }
    }

    // Método para definir um ícone com base na porcentagem de cobertura
    private getIconForCoverage(coverage: number): vscode.ThemeIcon {
        if (coverage >= 75) {
            return new vscode.ThemeIcon('check'); // Ícone de check
        } else if (coverage >= 50) {
            return new vscode.ThemeIcon('warning'); // Ícone de alerta
        } else {
            return new vscode.ThemeIcon('error'); // Ícone de erro
        }
    }

    // Método para definir o nome do objeto
    public toString(): string {
        return this.label;
    }
}