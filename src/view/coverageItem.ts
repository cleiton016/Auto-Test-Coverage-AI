import * as vscode from 'vscode';
import path from 'path';

export class CoverageItem extends vscode.TreeItem {
    children: CoverageItem[] | undefined;

    Uri: vscode.Uri | undefined;
    
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly resourceUri?: vscode.Uri,
        public readonly percentage?: number,
    ) {
        super(label, collapsibleState);

        this.Uri = resourceUri;
        // Exibe a porcentagem de cobertura apenas para arquivos
        if (this.percentage !== undefined) {
            this.description = `${this.percentage.toFixed(0)}%`;
            
            this.tooltip = `${this.label} - ${this.percentage}% covered`;
            // Define o ícone do arquivo com base na cobertura
            //this.iconPath = this.getIconForCoverage(this.percentage!);
        } else {
            // Ícone de pasta
            this.iconPath = new vscode.ThemeIcon('folder');
        };

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
}