# Bem-vindo à sua extensão do VS Code

## O que há na pasta

* Esta pasta contém todos os arquivos necessários para sua extensão.
* `package.json` - este é o arquivo manifesto no qual você declara sua extensão e comando.
* O plugin de exemplo registra um comando e define seu título e nome de comando. Com essas informações, o VS Code pode mostrar o comando na paleta de comandos. Ele ainda não precisa carregar o plugin.
* `src/extension.ts` - este é o arquivo principal onde você fornecerá a implementação do seu comando.
* O arquivo exporta uma função, `activate`, que é chamada na primeira vez que sua extensão é ativada (neste caso, executando o comando). Dentro da função `activate`, chamamos `registerCommand`.
* Passamos a função que contém a implementação do comando como o segundo parâmetro para `registerCommand`.

## Configuração

* instale as extensões recomendadas (amodio.tsl-problem-matcher, ms-vscode.extension-test-runner e dbaeumer.vscode-eslint)

## Comece a usar imediatamente

* Pressione `F5` para abrir uma nova janela com sua extensão carregada.
* Execute seu comando na paleta de comandos pressionando (`Ctrl+Shift+P` ou `Cmd+Shift+P` no Mac) e digitando `Hello World`.
* Defina pontos de interrupção em seu código dentro de `src/extension.ts` para depurar sua extensão.
* Encontre a saída de sua extensão no console de depuração.

## Faça alterações

* Você pode reiniciar a extensão na barra de ferramentas de depuração após alterar o código em `src/extension.ts`.
* Você também pode recarregar (`Ctrl+R` ou `Cmd+R` no Mac) a janela do VS Code com sua extensão para carregar suas alterações.

## Explore a API

* Você pode abrir o conjunto completo da nossa API ao abrir o arquivo `node_modules/@types/vscode/index.d.ts`.

## Execute testes

* Instale o [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner)
* Execute a tarefa "watch" por meio do comando **Tasks: Run Task**. Certifique-se de que ele esteja em execução, ou os testes podem não ser descobertos.
* Abra a visualização de Testes na barra de atividades e clique no botão Executar Teste" ou use a tecla de atalho `Ctrl/Cmd + ; A`
* Veja a saída do resultado do teste na visualização Resultados do Teste.
* Faça alterações em `src/test/extension.test.ts` ou crie novos arquivos de teste dentro da pasta `test`.
* O executor de teste fornecido considerará apenas arquivos que correspondam ao padrão de nome `**.test.ts`.
* Você pode criar pastas dentro da pasta `test` para estruturar seus testes da maneira que desejar.

## Vá além

* Reduza o tamanho da extensão e melhore o tempo de inicialização [agrupando sua extensão](https://code.visualstudio.com/api/working-with-extensions/bundling-extension).
* [Publique sua extensão](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) no mercado de extensões do VS Code.
* Automatize compilações configurando [Continuous Integração](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).