// Cria o provider para selecionar o tipo de cobertura a ser exibido
import * as vscode from 'vscode';
import { SelectTypeCoverageItem } from './selectTypeCoverageItem';

export class SelectTypeCoverageProvider implements vscode.TreeDataProvider<SelectTypeCoverageItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<SelectTypeCoverageItem | undefined | void> = new vscode.EventEmitter<SelectTypeCoverageItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<SelectTypeCoverageItem | undefined | void> = this._onDidChangeTreeData.event;

    private coverageTree: SelectTypeCoverageItem[] = [];

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: SelectTypeCoverageItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: SelectTypeCoverageItem | undefined): vscode.ProviderResult<SelectTypeCoverageItem[]> {
        if (!element) {
            // Retornar o nível raiz
            return Promise.resolve(this.coverageTree);
        } else {
            // Retornar os filhos (arquivos ou subpastas) do elemento atual
            return Promise.resolve(element.children || []);
        }
    }

    setCoverageTypes(types: string[]): void {
        // Reiniciar a árvore
        this.coverageTree = [];
        const title = new SelectTypeCoverageItem('Selecione o tipo de cobertura', vscode.TreeItemCollapsibleState.Expanded);
        title.children = types.map(type => new SelectTypeCoverageItem(type, vscode.TreeItemCollapsibleState.None, type.toLocaleLowerCase()));
        this.coverageTree.push(title);
        this.refresh();
    }

}