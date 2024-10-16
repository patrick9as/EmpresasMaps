# EmpresasMaps

* Este é um bot de navegação nas páginas do Google Maps, trazendo dados de pesquisa de empresas na região selecionada.
* Por enquanto é necessário passar um body com o link da página do Google Maps. Por exemplo:
```
  {
    "urlBase": "https://www.google.com.br/search?sa=X&sca_esv=ec0a7266f41121fb&tbs=lf:1,lf_ui:9&tbm=lcl&sxsrf=ADLYWILJQ3jhO_JdnkU4RqsYkROkJlWFJQ:1729062023577&q=padarias+em+ca%C3%A7apava&rflfq=1&num=10&ved=2ahUKEwj32Nb9qZKJAxXPrpUCHeYPCgcQjGp6BAgkEAE&biw=1920&bih=911&dpr=1#rlfi=hd:;si:;mv:[[-23.0688237,-45.6411173],[-23.120519500000004,-45.7195007]]"
}
```
* A ideia é implementar o click no botão de avançar página automaticamente.
