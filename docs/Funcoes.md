# Funções da biblioteca

A ideia é relatar o funcionamento das principais funções da biblioteca.

## sky6ObjectInformation

### .Property(int num)

**Argumentos**: Um inteiro, que representa um certa informação do objeto. Há um total de 189 informações separadas nessa função. A ideia é documentar apenas o que for necessário para o script.

A função em si não retorna nada, para pegar o valor desejado é necessário usar a variável ObjInfoPropOut, como escrito no exemplo.

54: Ascensão reta\
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
// ou
print(sky6ObjectInfomation.ObjInfoPropOut + "\n")
```

## sky6RASCOMTele

### .Connect()

**Argumentos**: Nenhum.

Faz a comunicação entre esse objeto do telescópio (RASCOMTele) e o TheSky.

### .Disconnect()

**Argumentos**: Nenhum.

Termina a conexão entre esse objeto do telescópio (RASCOMTele) e o TheSky6.

### .Abort()

**Argumentos**: Nenhum.

Para qualquer ação do telescópio durante a operação em progresso.

### .SlewToRaDec(float TargetRa, float TargetDec, string targetObject)

**Argumentos**: A ascensão reta, a declinação e o nome do objeto.

Faz o slew para a coordenada dada.

Exemplo:

```javascript
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

Pega a declinação e a ascensão reta atual, e prepara os valores nas variáveis dRa e dDec.

Exemplo:

```javascript
sky6RASCOMTele.Connect();
sky6RASCOMTele.getRaDec();

// Printa: "ascensão reta | declinação"
Out = String(sky6RASCOMTele.dRa) + " | " + String(sky6RASCOMTele.dDec);
// ou
print(String(sky6RASCOMTele.dRa) + " | " + String(sky6RASCOMTele.dDec));
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

### .isParked

Tem o valor zero se o telescópio estiver na posição de parking.

### .dRa

A ascensão reta atual.

### .dDec

A declinação atual.

## Não relacionadas com as classes

### String(string string)

**Argumentos**: Uma variável qualquer.

Essa função funciona como o método toString(), do javascript. A diferença é que esta é uma função, logo, não há a necessidade da função ser aplicada em uma string.

Exemplo:

```javascript
var integer = 2;
print(String(integer));
```

### print()

**Argumentos**: Qualquer coisa.

Essa função escreve nos logs do debugger. Ela escreve enquanto o programa roda, diferentemente da variável Out.

### A variável Out

Essa variável armazena tudo que será escrito na tela do "Run Java Scrip" no SkyX. Ela só é escrita quando o script acaba de rodar.
