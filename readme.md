### Organização do projeto
Nas instruções foi identificado dois escopos de dados **pessoa/usuário** e **conta bancária**, será criado um micro-serviço (MS-Mini-Bank) que conterá internamente cada escopo a fim de segregar os dados.

Abaixo segue um diagrama de alto nível exemplificando o escopo dos dados.

![Architecture Overview](img/architecture-overview.jpg)

## Dependências
- [NodeJS LTS](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Instruções de execução

O projeto está configurado com um [Makefile](https://www.gnu.org/software/make/), abaixo estão listados os targets e uma breve descrição da sua funcionalidade.

- **make** ou **make all**

   - Executa `make db` e `make app`

- **make create_network**

    - Cria a rede a ser compartilhada entre as stacks do banco de dados e MS

- **make app**
    - Executa o MS simulando ambiente produtivo

- **make db**

    - Cria a estrutura de banco de dados

- **make stop**

    - Para todos os containers em execução

- **make clean**

    - Exclui todos os containers relacionados, todas as dependências e arquivos temporários


### Acessando a aplicação

Para instruções de execução da aplicação em ambiente local consultar o `readme.md` incluso no diretório da mesma ou executar o comando `make app`.

Por padrão a aplicação é executada na porta `3000` e a documentação da api pode ser acessada por `http://localhost:3000/docs`. 

O comando de criação do banco de dados cria apenas a estrutura, a entidade Pessoa (que é requerida nas instruções) pode ser inserida por lá. 

A maioria dos endpoints requer um token jwt, o mesmo pode ser gerado na documentação com as credenciais utilizadas ao criar a pessoa.

Endpoints que retornam informações sensíveis estão protegidas por um segundo nível de autorização, onde o `person_id` enviado é comparado com o `sub` do token, após o token ser validado.