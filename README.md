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

### Linha de comandos ###
* Sintaxe:
  ```
  jmeter -n -t meu_teste.jmx
  ```
Opções:
-n: Essa opção diz para o JMeter ser executado apenas por linha de comando (sem a interface gráfica)

-t: Seu script plano de teste (arquivo JMX)

-l: Arquivo log de resultados do seu teste (arquivo JTL)

-j: Arquivo log de execução do JMeter.

-r: opção para execução remota, usando os servidores especificados na propriedade "remote_hosts"

-R: executa em um servidor específico

-g: Arquivo CSV file, para geração do dashboard

-o: Pasta de saída onde será gerado o dashboard. Pasta não pode existir ou deve estar vazia

-H: proxy server hostname

-P: proxy server porta


* Exemplo 1 - Apenas executar o teste:
  ```
  jmeter -n - t meu_plano.jmx
  ```
* Exemplo 2 - Executar o teste e salvar o log de resultados:
  ```
  jmeter -n -t meu_plano.jmx -l resultado.jtl
  ```
* Exemplo 3 - Executar o teste e gerar a dashboard quando o teste finalizar:
  ```
  jmeter -n -t meu_plano.jmx -l resultado.jtl -e -o nomeMinhaDashboard
  ```
* Exemplo 4 - Apenas gerar a dashboard (é necessário ter o arquivo de resultado de testes):
  ```
  jmeter -g resultado.jtl -o nomeMinhaDashBoard
  ```
* Exemplo 5 - Executar um teste usando proxy:
  ```
  jmeter -n -t meu_plano.jmx -l resultado.jtl -H my.proxy.server -P 8080
  ```      


### Execução dos testes ###

* Comando para executar os testes sem GUI mode gravando resultados em .jtl tendo baixado o repositório:
  - Estar no diretório apache-jmeter-5.6.3\bin

  ```
  jmeter -n -t ./plans/api.jmx -l ./plans/results.jtl
  ```

* Comando para executar os testes sem GUI mode gravando resultados em .csv tendo baixado o repositório:
  - Estar no diretório apache-jmeter-5.6.3\bin

  ```
  jmeter -n -t ./plans/api.jmx -l ./plans/results.csv
  ```  

* Comando para executar os testes sem GUI mode gerando HTML report tendo baixado o repositório:
  - Estar no diretório apache-jmeter-5.6.3\bin

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

### Linkedin ###

* Consulte meu linkedin para acompanhamento da minha área profissional.

```
https://www.linkedin.com/in/israel-faioli-4485a889/
```