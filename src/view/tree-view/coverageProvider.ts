import * as vscode from 'vscode';
import * as path from 'path';
import { CoverageItem } from './coverageItem';
import { CoverageData } from '@/interfaces';


export class CoverageProvider implements vscode.TreeDataProvider<CoverageItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CoverageItem | undefined | void> = new vscode.EventEmitter<CoverageItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<CoverageItem | undefined | void> = this._onDidChangeTreeData.event;

    private coverageTree: CoverageItem[] = [];

    refresh(item?): void {
        if (item) {
            this._onDidChangeTreeData.fire(item);
        } else {
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    getElement(filePath: string): CoverageItem {
        const parts = path.normalize(filePath).split(path.sep);
        let currentLevel: CoverageItem[] = this.coverageTree;
        // pega o ultimo item do array
        let element: CoverageItem = new CoverageItem('', vscode.TreeItemCollapsibleState.None);
        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            const foundItem = currentLevel.find(item => item.label === part);

            if (foundItem) {
                if (isFile) {
                    element = foundItem;
                    return element;
                } else if (foundItem.children) {
                    currentLevel = foundItem.children;
                }
            }
        });

        return element;
    }

    getTreeItem(element: CoverageItem): vscode.TreeItem {
        return element;
    }

    getParent(element: CoverageItem): vscode.ProviderResult<CoverageItem> {
        // Deve retornar o pai do elemento atual
        const parents = this.getParents(element);
        return parents ? parents[parents.length - 1] : null;
    }

    getParents(element: CoverageItem): CoverageItem[] | undefined {
        // Deve retornar uma lista contendo todos os parentes até o nível raiz
        const parents: CoverageItem[] = [];
        let parts = element.resourceUri?.fsPath!.split(path.sep);
        let currentLevel: CoverageItem[] = this.coverageTree;
        parts?.forEach((part, index) => {
            const isFile = index === parts!.length - 1;
            const foundItem = currentLevel.find(item => item.label === part);
            if (foundItem) {
                if (isFile) {
                    return;
                } else if (foundItem.children) {
                    parents.push(foundItem);
                    currentLevel = foundItem.children;
                }
            }
        });
        return parents;
        
    }

    getChildren(element?: CoverageItem): Thenable<CoverageItem[]> {
        if (!element) {
            // Retornar o nível raiz
            return Promise.resolve(this.coverageTree);
        } else {
            // Retornar os filhos (arquivos ou subpastas) do elemento atual
            return Promise.resolve(element.children || []);
        }
    }

    setCoverageFiles(data: CoverageData, selectedType?: string): void {
        // Extrai os arquivos do CoverageData
        const files: { label: string, percentages: { lines: number, functions: number, branches: number } }[] = data.files.map(file => ({
            label: file.filePath,  // Usar o filePath do CoverageFile
            percentages: {
                lines: file.linesCoveragePercentage,
                functions: file.functionsCoveragePercentage,
                branches: file.branchesCoveragePercentage
            }
        }));

        // Reiniciar a árvore
        this.coverageTree = [];

        files.forEach(file => {
            const filePath = path.normalize(file.label);  // Normalizar o caminho do arquivo
            const parts = filePath.split(path.sep);  // Dividir o caminho em partes (diretórios)

            let currentLevel = this.coverageTree;

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1;  // Verificar se é o nome do arquivo
                let existingItem = currentLevel.find(item => item.label === part);

                if (!existingItem) {
                    if (isFile) {
                        // Criar um item de arquivo com a porcentagem de cobertura
                        existingItem = new CoverageItem(
                            part,
                            vscode.TreeItemCollapsibleState.None,
                            vscode.Uri.file(file.label),
                            file.percentages
                        );
                    } else {
                        // Criar um item de diretório
                        const collapse = index < 4? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed;
                        existingItem = new CoverageItem(
                            part,
                            collapse
                        );
                        existingItem.children = [];
                    }
                    currentLevel.push(existingItem); // Adicionar o item ao nível atual da árvore
                }

                // Se não for um arquivo, continuar navegando nas subpastas
                if (!isFile) {
                    if (!existingItem.children) {
                        existingItem.children = [];
                    }
                    currentLevel = existingItem.children;
                }
            });
        });

        this.refresh();  // Atualizar a árvore
    }
}
