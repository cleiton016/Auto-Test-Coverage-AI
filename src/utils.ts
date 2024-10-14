// importações
import * as vscode from "vscode";
import * as fs from 'fs';
import * as util from 'util';
import * as chokidar from 'chokidar';
import path from "path";
import { CoverageCache } from "@/coverageCache";
import { CoverageData, CoverageFile } from "@/interfaces";
const parse = require('lcov-parse');

// Codigo 
export const LCOV_FILE_PATH = path.join(vscode.workspace.rootPath || '', 'coverage/lcov.info');

export let CACHE =  new CoverageCache();

export const COVERED_DECORATION_TYPE = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgb(67 92 67)',  // Verde claro para linhas cobertas
    isWholeLine: true
});

export const UNCOVERED_DECORATION_TYPE = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(255,0,0,0.3)',  // Vermelho claro para linhas não cobertas
    isWholeLine: true
});

export const parseLcov = util.promisify(parse);

// Obsevable para monitorar a seleção do tipo de cobertura
export const $selectedCoverageType = new vscode.EventEmitter<string | undefined>();
export const onSelectedCoverageTypeChanged = $selectedCoverageType.event
onSelectedCoverageTypeChanged((type) => {
    vscode.window.showInformationMessage(`Cobertura trocada para: ${type}`);
    showCoverageReport(vscode.window.activeTextEditor, type);
});



export function highlightCoverage(editor: vscode.TextEditor, coveredLines: number[], uncoveredLines: number[]) {


    
    const coveredDecorations: vscode.DecorationOptions[] = [];
    const uncoveredDecorations: vscode.DecorationOptions[] = [];

    if (!coveredLines || !uncoveredLines) {
        return;
    }
    coveredLines!.forEach(line => {
        const range = new vscode.Range(line - 1, 0, line - 1, 0);
        coveredDecorations.push({ range });
    });

    uncoveredLines!.forEach(line => {
        const range = new vscode.Range(line - 1, 0, line - 1, 0);
        uncoveredDecorations.push({ range });
    });

    editor.setDecorations(COVERED_DECORATION_TYPE, coveredDecorations);
    editor.setDecorations(UNCOVERED_DECORATION_TYPE, uncoveredDecorations);
}

function clearDecorations(editor: vscode.TextEditor) {
    editor.setDecorations(COVERED_DECORATION_TYPE, []);
    editor.setDecorations(UNCOVERED_DECORATION_TYPE, []);
}

export function getCoverageAndUncoveredLines(filePath: string, lcovData: any) {
    const coverageData = lcovData.find((entry: any) => entry.file === path.relative(vscode.workspace.rootPath || '', filePath));
    
    if (!coverageData) {
        vscode.window.showErrorMessage('Cobertura de código não encontrada para este arquivo.');
        return { coveredLines: [], uncoveredLines: [] };
    }

    const coveredLines: number[] = [];
    const uncoveredLines: number[] = [];

    coverageData.lines.details.forEach((lineDetail: any) => {
        if (lineDetail.hit > 0) {
            coveredLines.push(lineDetail.line);
        } else {
            uncoveredLines.push(lineDetail.line);
        }
    });

    return { coveredLines, uncoveredLines };
}

async function parseLcovFile(LCOV_FILE_PATH: string): Promise<CoverageData> {
    if (!fs.existsSync(LCOV_FILE_PATH)) {
        vscode.window.showErrorMessage('Arquivo de cobertura lcov.info não encontrado.');
        return Promise.reject('Arquivo de cobertura lcov.info não encontrado.');
    }

    return new Promise((resolve, reject) => {
        fs.readFile(LCOV_FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            // Faz o parse de toda a string do arquivo lcov
            parseLcov(data, (err, lcovData) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Mapeia os dados lidos para a estrutura CoverageData
                const coverageData: CoverageData = {
                    files: lcovData.map((entry: any) => (
                        {
                        filePath: entry.file,
                        totalLines: entry.lines.found,
                        linesCoveragePercentage: entry.lines.found > 0 ? (entry.lines.hit / entry.lines.found) * 100 : 100,
                        functionsCoveragePercentage: entry.functions.found > 0? (entry.functions.hit / entry.functions.found) * 100: 100,
                        branchesCoveragePercentage: entry.branches.found > 0? (entry.branches.hit / entry.branches.found) * 100: 100,
                        coveredLines: entry.lines.details.filter((line: any) => line.hit > 0).map((line: any) => line.line),
                        uncoveredLines: entry.lines.details.filter((line: any) => line.hit === 0).map((line: any) => line.line),
                        coveredFunctions: entry.functions.details.filter((func: any) => func.hit > 0).map((func: any) => (func.line)),
                        uncoveredFunctions: entry.functions.details.filter((func: any) => func.hit === 0).map((func: any) => (func.line)),
                        coveredBranches: entry.branches.details.filter((branch: any) => branch.taken > 0).map((branch: any) => (branch.line)),
                        uncoveredBranches: entry.branches.details.filter((branch: any) => branch.taken === 0).map((branch: any) => (branch.line))
                }))};
                resolve(coverageData);
            });
        });
    });
}

export async function getCoverageFromLcov(filePathLcov: string, filePath?: string): Promise<CoverageData | CoverageFile> {
    // Verifica se o cache é válido
    if (CACHE.isCacheValid(filePathLcov)) {
        if (filePath) {
            return CACHE.getCoverageFile(filePath)!;
        }
        return CACHE.getCoverage(filePathLcov)!;
    }

    // Analisa o arquivo LCOV (se não estiver em cache ou modificado)
    const coverage = await parseLcovFile(LCOV_FILE_PATH);

    // Atualiza o cache
    CACHE.updateCache(filePathLcov, coverage);
    return coverage;
}

export function watchLcovFile(LCOV_FILE_PATH: string) {
    const watcher = chokidar.watch(LCOV_FILE_PATH, {
        persistent: true,
        ignoreInitial: true
    });

    watcher.on('change', async () => {
        vscode.commands.executeCommand('auto-test-coverage-ai.refreshCoverage');
    });
}

export async function showCoverageReport(editor, type) {
    if (!editor) {
        vscode.window.showErrorMessage('Nenhum arquivo aberto no editor.');
        return;
    }

    const data = await getCoverageFromLcov(LCOV_FILE_PATH, editor.document.uri.fsPath) as CoverageFile;
    // limpa as decorações
    clearDecorations(editor);
    switch (type) {
        case 'lines':
            highlightCoverage(editor, data.coveredLines, data.uncoveredLines);
            break;
        case 'functions':
            highlightCoverage(editor, data.coveredFunctions, data.uncoveredFunctions);
            break;
        case 'branches':
            highlightCoverage(editor, data.coveredBranches, data.uncoveredBranches);
            break;
    }
}