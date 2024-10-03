import * as fs from 'fs';
import { CoverageData } from "./interfaces";

export class CoverageCache {
    private cache: Map<string, { coverage: CoverageData, modifiedTime: number }>;

    constructor() {
        this.cache = new Map();
    }

    // Verifica se o arquivo LCOV foi modificado
    public isCacheValid(filePath: string): boolean {
        const cacheEntry = this.cache.get(filePath);
        if (!cacheEntry) return false;

        const stats = fs.statSync(filePath);
        return stats.mtimeMs === cacheEntry.modifiedTime;
    }

    // Obtém os dados da cobertura do cache
    public getCoverage(filePath: string): CoverageData | null {
        const cacheEntry = this.cache.get(filePath);
        return cacheEntry ? cacheEntry.coverage : null;
    }

    // Atualiza o cache com novos dados
    public updateCache(filePath: string, coverage: CoverageData) {
        const stats = fs.statSync(filePath);
        this.cache.set(filePath, {
            coverage,
            modifiedTime: stats.mtimeMs
        });
    }
}