# Funcoes da biblioteca.

A ideia é relatar o funcionamento das principais funções da biblioteca.


## sky6ObjectInformation

### .Property(int num)

**Argumentos**: Um inteiro, que representa um certa informação do objeto. Há um total de 190 informações separadas nessa função. A ideia é documentar cada uma aqui.

A função em si não retorna nada, para pegar o valor desejado é necessário chamar o atributo ObjInfoPropOut;

54: Ascensão direita\
55: Declinação

Exemplo:
```javascript
// Printa a declinação.
sky6ObjectInformation.Property(55);
print(sky6ObjectInformation.ObjInfoPropOut);
```

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

### .Abort()

**Argumentos**: Nenhum.

Para qualquer ação do telescópio durante a operação em progresso.

### .SlewToRaDec(float TargetRa, float TargetDec, string targetObject)

**Argumentos**: A Ascensão direita, a declinação e o nome do objeto.

Faz o slew para a coordenada dada.

Exemplo:
```javscript
sky6RASCOMTele.Connect();

var targetObject = "Sun";
sky6StarChart.Find(targetObject);

sky6ObjectInformation.Property(54);
var targetRA = sky6ObjectInformation.ObjInfoPropOut;

sky6ObjectInformation.Property(55);
var targetDec = sky6ObjectInformation.ObjInfoPropOut;
sky6RASCOMTele.SlewToRaDec(targetRa, TargetDec, targetObject);
```

### .GetRaDec()

**Argumentos**: Nenhum.

Pega a declinação e a ascensão direita atual, e prepara os valores nas variáveis dRa e dDec.

Exemplo:
```javascript
sky6RASCOMTele.Connect();
sky6RASCOMTele.getRaDec();

// Printa: "ascensão direita | declinação"
Out = String(sky6RASCOMTele.dRa) + " | " + String(sky6RASCOMTele.dDec);
```

### .Park()

**Argumentos**: Nenhum.

Faz o slew para a posição de parking, e finaliza a conexão com o TheSky6.

### .ParkAndDoNotDisconnect()

**Argumentos**: Nenhum.

Essa função tem quase o mesmo funcionamento que a função de parking. A diferença é que essa função não finaliza a conexão entre o telescópio e o TheSky6. 
Para fazer outro Slew depois de usar é necessário chamar a função '.Unpark'.

### .Unpark()

**Argumentos**: Nenhum.

Tira o telescópio da posição de parking.

### .dRa

A ascensão direita atual.

### .dDec

A declinação atual.

### .isParked

É zero se o telescópio estiver na posição de parking.
