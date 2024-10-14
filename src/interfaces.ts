export interface CoverageData {
    files: CoverageFile[];
}

export interface CoverageFile {
    filePath: string; // Caminho do arquivo
    totalLines: number; // Total de linhas no arquivo
    linesCoveragePercentage: number; // Porcentagem de cobertura
    functionsCoveragePercentage; // Porcentagem de cobertura de funções
    branchesCoveragePercentage; // Porcentagem de cobertura de branches
    coveredLines: number[]; // Quantidade de linhas cobertas por testes
    uncoveredLines: number[]; // Números das linhas não cobertas
    coveredFunctions: number[]; // Funções cobertas
    uncoveredFunctions: number[]; // Funções não cobertas
    coveredBranches: number[]; // Branches cobertos
    uncoveredBranches: number[]; // Branches não cobertos

}


export interface CoverageSelectType {
    label: string;
}