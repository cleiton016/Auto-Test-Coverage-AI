import * as vscode from 'vscode';
import * as path from 'path';
import { CoverageItem } from './coverageItem';
import { CoverageData, CoverageFile } from '../interfaces';



export class CoverageProvider implements vscode.TreeDataProvider<CoverageItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CoverageItem | undefined | void> = new vscode.EventEmitter<CoverageItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<CoverageItem | undefined | void> = this._onDidChangeTreeData.event;

    private coverageTree: CoverageItem[] = [];

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CoverageItem): vscode.TreeItem {
        return element;
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

    setCoverageFiles(data: CoverageData) {
        // Extrai os arquivos do CoverageData
        const files: { label: string, percentage: number }[] = data.files.map(file => ({
            label: file.filePath,  // Usar o filePath do CoverageFile
            percentage: file.coveragePercentage  // Calcular a porcentagem de cobertura para o arquivo
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
                            file.percentage
                        );
                    } else {
                        // Criar um item de diretório
                        existingItem = new CoverageItem(
                            part, 
                            vscode.TreeItemCollapsibleState.Collapsed
                        );
                        existingItem.children = [];
                    }
                    currentLevel.push(existingItem);  // Adicionar o item ao nível atual da árvore
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

    calculateCoveragePercentage(file: any): number {
        const totalLines = file.lines.found;
        const coveredLines = file.lines.hit;
        return (coveredLines / totalLines) * 100;
    }
}

