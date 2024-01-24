Olá Analistas, desenvolvedores e recrutadores. Este readme irá apresentar a estrutura deste projeto de testes performance de API utilizando apache JMeter.

### Setup necessário ###

* Certifique-se de ter JAVA instalado
  ```
  - Acesse o terminal e execute o comando 'java -version'
  ```

  * Certifique-se de ter JMeter instalado
  ```
  - Acesse a url https://jmeter.apache.org/download_jmeter.cgi
  - Baixe o arquivo tipo 'Binaries'
  ```

* Clone este repositório.


* Execute `npm install` para instalar as dependências.

  ```
  npm install
  ```

### Estrutura do projeto ###

* thread group - Representação de grupo de número de usuários
* samplers - Representação do tipo de requisições que os usuários virtuais podem enviar
* node_modules - Representação dos reports dos testes, resultados.
* configuration elements - Representação geralmente em variáveis que podemos utilizar dentro das samples(requisições)
* .jmx - extensão do arquivo do projeto Jmeter.

### Rodando o projeto ###

* Acessa a pasta do projeto
* Rode todas as suites de testes:

```
npm run test
```

### Repositório github ###

* Consulte meu repositório de diversos projetos no github através da url

```
https://github.com/israfaioli?tab=repositories
```

### Medium ###

* Consulte meu medium onde posto semanalmente novos artigos para compartilhar conhecimento aos QAS através da url

```
https://medium.com/@israfaioli
```