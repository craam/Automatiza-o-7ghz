# Funcoes da biblioteca.

A ideia é relatar o funcionamento das principais funções da biblioteca.


## sky6ObjectInformation

### .Property(int num)

**Argumentos**: Um inteiro, que representa um certa informação do objeto. Há um total de 190 informações separadas nessa função. A ideia é documentar cada uma aqui.

A função em si não retorna nada, para pegar o valor desejado é necessário chamar o atributo ObjInfoPropOut;

54: Ascensão direita\
55: Declinação

## sky6StarChart

### .Find(string nomeDoObjeto)

**Argumentos**: O nome do objeto a ser procurado.

Procura pelo objeto dado.

Exemplo:
```javascript
sky6StarChart.Find("Sun");
```
Exemplo com o sky6ObjectInformation.Property():

```javascript
// Procura pelo sol.
sky6StarChart.Find("Sun");
// Prepara a função para retornar a declinação.
sky6ObjectInformation.Property(55);

// Printa a declinação.
Out = sky6ObjectInfomation.ObjInfoPropOut + "\n";
```

## sky6RASCOMTele

### .Connect()

**Argumentos**: Nenhum.

Faz a conexão entre esse objeto do telescópio (RASCOMTele) e o TheSky6.

### .Disconnect()

**Argumentos**: Nenhum.

Termina a conexão entre esse objeto do telescópio (RASCOMTele) e o TheSky6.

### .SlewToRaDec(float TargetRa, float TargetDec, string "TODO")

**Argumentos**: A Ascensão direita, a declinação e o string(TODO) da localização.

Faz o slew para a coordenada dada.

Exemplo:
```javscript
sky6RASCOMTele.Connect();
```

### .GetRaDec()

**Argumentos**: Nenhum.

Pega a declinação e a ascensão direita, e prepara os valores nos atributos dRa e dDec.

Exemplo:
```javascript
sky6RASCOMTele.Connect();
sky6RASCOMTele.getRaDec();

// Printa "ascensão direita | declinação"
Out = String(sky6RASCOMTele.dRa) + " | " + String(sky6RASCOMTele.dDec);
```

### .dRa

A ascensão direita atual.

### .dDec

A declinação atual.
