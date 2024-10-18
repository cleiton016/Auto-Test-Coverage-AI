import * as fs from 'fs';
import { CoverageData, CoverageFile } from "@/interfaces";
import { LCOV_FILE_PATH } from './utils';

export class CoverageCache {
    private cache: Map<string, { coverage: CoverageData, modifiedTime: number }>;
    private cacheOpenFile: CoverageFile;
    constructor() {
        this.cache = new Map();
        this.cacheOpenFile = {} as CoverageFile;
    }

    // Verifica se o arquivo LCOV foi modificado
    public isCacheValid(filePath: string): boolean {
        const cacheEntry = this.cache.get(filePath);
        if (!cacheEntry) { return false; }
        const stats = fs.statSync(filePath);
        return stats.mtimeMs === cacheEntry.modifiedTime;
    }

    // Obtém os dados da cobertura do cache
    public getCoverage(filePath: string): CoverageData | null {
        const cacheEntry = this.cache.get(filePath);
        return cacheEntry ? cacheEntry.coverage : null;
    }

    public getCoverageFile(filePath: string): CoverageFile | null {
        if (filePath.includes(this.cacheOpenFile.filePath)) {
            return this.cacheOpenFile;
        }

        const temp = this.getCoverage(LCOV_FILE_PATH);
        if (temp) {
            this.cacheOpenFile = temp.files.find(file => filePath.includes(file.filePath))!;
            return this.cacheOpenFile;
        }
        return null;


    }

    // Atualiza o cache com novos dados
    public updateCache(filePath: string, coverage: CoverageData) {
        //vscode.window.showInformationMessage('Cache atualizado!');
        const stats = fs.statSync(filePath);
        this.cache.set(filePath, {
            coverage,
            modifiedTime: stats.mtimeMs
        });
    }

    public updateCacheFile(coverage: CoverageFile) {
        this.cacheOpenFile = coverage;
    }

    // Limpa o cache
    public clearCache(filePath: string) {
        this.cache.delete(filePath);
    }
}