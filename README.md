
# Auto Test Coverage AI

**Auto Test Coverage AI** é uma extensão poderosa para o Visual Studio Code, projetada para ajudar desenvolvedores a visualizar a cobertura de código de maneira prática e intuitiva. A extensão oferece insights valiosos sobre a qualidade dos testes, permitindo que você identifique áreas que precisam de mais atenção.

## 🚀 Funcionalidades Principais

- **Visualização da cobertura de código**: Oferece uma interface clara para ver quais partes do seu código estão cobertas pelos testes.
- **Suporte a diferentes tipos de cobertura**: Linhas, Funções e Branches.
- **Compatibilidade com JavaScript e TypeScript**: Funciona com projetos que utilizam frameworks de teste que geram arquivos de cobertura no formato LCOV.
- **Suporte para frameworks de teste populares**: Funciona com frameworks como **Jest**, **Mocha**, **Karma**, e outros que geram arquivos de cobertura LCOV.

## 🛠️ Instalação

1. Abra o Visual Studio Code.
2. Acesse a aba de **Extensões** e busque por **Auto Test Coverage AI**.
3. Clique em **Instalar** e siga as instruções.
   
   Alternativamente, você pode instalar a extensão diretamente do [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=cleiton-dev.auto-test-coverage-ai).

## 📖 Como Usar

1. **Execute o script de teste do seu projeto**: Para que a extensão funcione, você deve rodar seus testes de unidade para gerar o arquivo de cobertura (geralmente um arquivo no formato LCOV).
   
   ```bash
   npm test -- --coverage
   ```

   Esse comando depende do framework de testes utilizado no seu projeto. Frameworks como **Jest**, **Mocha** e **Karma** geralmente geram arquivos de cobertura LCOV por padrão.

2. **Abra o Visual Studio Code**: A extensão automaticamente detectará o arquivo LCOV gerado e exibirá a cobertura de código correspondente.

3. **Visualize a cobertura**: A cobertura de código será exibida diretamente no editor, destacando as linhas cobertas e não cobertas.

4. **Visualize detalhes da Cobertura**: Coloque o ponteiro do mouse em um arquivo da arvore e será exibido um tolltip com detalhes da cobertura.

## 💡 O que está por vir?

- Integração com LLM para geração automática de testes.
- Definição de contexto para gerar os testes.
- Melhorias no desempenho e na acessibilidade.

## 🧑‍💻 Contribuições e Feedback

Contribuições são bem-vindas! Se você tem alguma sugestão ou encontrou um problema, deixe seu comentario ou sinta-se à vontade para abrir [issues e pull requests](https://github.com/cleiton016/Auto-Test-Coverage-AI/issues) no repositório do projeto.

## 💖 Doações

Se você gostou da extensão e deseja apoiar o desenvolvimento contínuo, considere fazer uma doação: [biolivre.com.br/cleitondev](http://biolivre.com.br/cleitondev).

## 📜 Licença
Esta extensão está licenciada sob a Creative Commons Attribution-NonCommercial 4.0 International. Isso significa que você pode usar e colaborar com o código livremente, mas não pode utilizá-lo para fins comerciais sem permissão prévia.

Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
