# Exemplos (Desatualizado)

## Funcionamento da rotina principal

O código está dentro de um while true. A cada vez que ele é rodado o horario do computador é salvo em uma variável para verificar o horário.

Antes do início do loop são definidos os horários (UT) para ligar, fazer o flip e desligar.
Para o inicío, é verificada se a hora é exatamente a do horário de inicialização. Antes de fazer o Slew, é necessário usar a função FindHome. Como não há uma forma de saber se o telescópio já fez o home ou não, a função FindHome deve ser executada sempre na inicialização.
O flip, como a inicialização, é realizado precisamente no horário determinado.
O desligamento ocorre se o tracking estiver sendo realizado e está a hora atual for maior ou igual a hora de desligamento.

Se a conexão for perdida há a possibilidade dela ser recuperada e que o telescópio volte a sua rotina normal. Entretanto, o problema causado pela perda de conexão pode não ser resolvido, e há a possibilidade de que seja necessária um reconexão manual.

A documentação feita dentro do script é feita usando o padrão javadoc <https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html>

## Pegando a ascensão reta e a declinação do objeto para fazer o slew

```javascript
// Declara o objeto para ser encontrado e observado.
var targetObject = "Sun";

sky6RASCOMTele.Connect();
sky6StarChart.Find(targetObject);

// A propriedade 54 é a ascensão reta.
sky6ObjectInformation.Property(54);
var targetRA = sky6ObjectInformation.ObjInfoPropOut;

// A propriedade 55 é a declinação.
sky6ObjectInformation.Property(55);
var targetDec = sky6ObjectInformation.ObjInfoPropOut;

// Faz o Slew até o objeto.
sky6RASCOMTele.SlewToRaDec(targetRa, TargetDec, targetObject);
```

Para pegar a ascensão reta e a declinação já há uma função implementada no script principal, chamada getRADec:

```javascript
function getRADec(object)
{
  if (sky6RASCOMTele.IsConnected != 0) {
    try {
      sky6StarChart.Find(object);
    } catch (finderr) {
      writeFileAndPrint("Erro durante o find: " + finderr.message);
      return false;
    }

    sky6ObjectInformation.Property(54);
    var targetRA = sky6ObjectInformation.ObjInfoPropOut;
    sky6ObjectInformation.Property(55);
    var targetDec = sky6ObjectInformation.ObjInfoPropOut;

    return {"ra": targetRA, "dec": targetDec};
  }
}
```

Essa função retorna um objeto com a ascensão reta e a declinação. Para fazer o slew:

```javascript
var objectValues = getRADec("Sun");
sky6RASCOMTele.SlewToRaDec(objectValues.ra, objectValues.dec, "Sun");
```

## Encontrando um objeto e pegando informações sobre ele

No script principal há uma função já declarada chamada Find, que faz isso.

```javascript
function Find(objectName)
{
  // Número de propriedades que um objeto tem.
  var propriedades = 189;
  var Out = "";
  // Acha o objeto dado.
  try {
    sky6StarChart.Find(objectName);
  } catch (finderr) {
    print("Objeto nao encontrado");
    return 0;
  }

  for (var prop = 0;prop < propriedades;++prop) {
    if (sky6ObjectInformation.PropertyApplies(prop) != 0) {
      sky6ObjectInformation.Property(prop);

      Out += sky6ObjectInformation.ObjInfoPropOut + "|";

      // Printa as informações do objeto.
      print(Out);
    }
  }
}
```

Essa função acha o objeto dado e pega todas as informações relacionadas a ele. Cada propriedade (informação) é representada por um número, por exemplo o número 54 representa a ascensão reta. Ao chamar o método .Property(), ele prepara o resultado na variável ObjInfoPropOut, e pode ser "printado" ou salvo em outra variável.

## Vendo se o slew está sendo realizado

Mesmo você podendo ver no próprio SkyX se o slew está ocorrendo, é bom termos uma função para verificarmos isso.

```javascript
function MountIsSlewing()
{
  if (sky6RASCOMTele.IsConnected != 0) {
    // IsSlewComplete retorna zero se o telescópio estiver fazendo o slew.
    if (sky6RASCOMTele.IsSlewComplete != 0) {
      print("Não está fazer o slew.");
      return false;
    } else {
      print("Fazendo o slew.");
      return true;
    }
  } else {
    print("Telescópio não conectado.");
  }
}
```

Essa função confirma se está ocorrendo o slew ou não usando o atributo do sky6RASCOMTele.
