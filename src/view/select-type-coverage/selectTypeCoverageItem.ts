import { onSelectedCoverageTypeChanged } from '@/utils';
import * as vscode from 'vscode';

export class SelectTypeCoverageItem extends vscode.TreeItem {
    children: SelectTypeCoverageItem[] | undefined;

    Uri: vscode.Uri | undefined;
    
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly slug?: string,
    ) {
        super(label, collapsibleState);

        if (slug) {
            this.command = {
                title: 'Selecionar tipo de cobertura',
                command: 'auto-test-coverage-ai.selectCoverageType',
                arguments: [slug]
            };
        }

        onSelectedCoverageTypeChanged((type) => {
            console.log('Type:', type, 'Slug:', slug);
            
            if (type === slug) {
                this.iconPath = new vscode.ThemeIcon('check');
            } else {
                this.iconPath = undefined;
            }
        });
    }

}