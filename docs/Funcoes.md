# Funcoes da biblioteca.

A ideia é relatar o funcionamento das principais funções da biblioteca.


## sky6ObjectInformation

### .Property(int num)

Argumentos: Um inteiro, que representa um certa informação do objeto. Há um total de 190 informações separadas nessa função. A ideia é documentar cada uma aqui.

A função em si não retorna nada, para pegar o valor desejado é necessário chamar o atributo ObjInfoPropOut;

54: Ra\
55: Declinação

## sky6StarChart

### .Find(string nomeDoObjeto)

Argumentos: O nome do objeto a ser procurado.

Procura pelo objeto dado.

Exemplo:
```javascript
sky6.StarChart.Find("Sun");
```
Exemplo com o sky6ObjectInformation.Property():

```javascript
// Procura pelo sol.
sky6.StarChart.Find("Sun");
// Prepara a função para retornar a declinação.
sky6ObjectInformation.Property(55);

// Printa a declinação.
Out += sky6ObjectInfomation.ObjInfoPropOut + "\n";
```

Procura 

## sky6RASCOMTele


### .GetRaDec()
