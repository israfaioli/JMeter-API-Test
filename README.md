Olá Analistas, desenvolvedores e recrutadores. Este readme irá apresentar a estrutura deste projeto de testes performance de API utilizando apache JMeter.

### Setup necessário ###

* Certifique-se de ter JAVA instalado
  ```
  - Acesse o terminal e execute o comando 'java -version'
  ```

* Clone este repositório.

### Estrutura do projeto ###

* thread group - Representação de grupo de número de usuários
* samplers - Representação do tipo de requisições que os usuários virtuais podem enviar
* node_modules - Representação dos reports dos testes, resultados.
* configuration elements - Representação geralmente em variáveis que podemos utilizar dentro das samples(requisições)
* .jmx - extensão do arquivo do projeto Jmeter.


* Comando para executar os testes sem GUI mode gravando resultados em .jtl tendo baixado o repositório:

  ```
  jmeter -n -t ./plans/api.jmx -l ./plans/results.jtl
  ```

* Comando para executar os testes sem GUI mode gravando resultados em .csv tendo baixado o repositório:

  ```
  jmeter -n -t ./plans/api.jmx -l ./plans/results.csv
  ```  

* Comando para executar os testes sem GUI mode gerando HTML report tendo baixado o repositório:

  ```
  jmeter -n -t ./plans/api.jmx -l ./plans/results.csv -e -o .\plans\htmlReports
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