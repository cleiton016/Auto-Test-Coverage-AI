export interface CoverageData {
    files: CoverageFile[];
}

export interface CoverageFile {
    filePath: string; // Caminho do arquivo
    totalLines: number; // Total de linhas no arquivo
    coveredLines: number[]; // Quantidade de linhas cobertas por testes
    uncoveredLines: number[]; // Números das linhas não cobertas
    coveragePercentage: number; // Porcentagem de cobertura
}
