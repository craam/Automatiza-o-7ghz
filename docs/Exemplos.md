# Exemplos

## Funcionamento da rotina principal

O código está dentro de um while que confirma se o telescópio está conectado com o TheSkyX. A cada vez que ele é rodado a hora, o minuto e o segundo são salvos em três variáveis para checar o horário.

### DDD

Antes de começar o loop são declaradas três variáveis to tipo booleano com o valor false para a confirmação do processo de inicialização, de flip e de desligamento. No início de cada processo o valor da variável em questão é mudado para true. Desse modo não há a possibilidade do processo ser iniciado novamente.

Os comentário feitos dentro do script são feitas usando o padrão javadoc <https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html>

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
  sky6StarChart.Find(object);

  sky6ObjectInformation.Property(54);
  var targetRA = sky6ObjectInformation.ObjInfoPropOut;
  sky6ObjectInformation.Property(55);
  var targetDec = sky6ObjectInformation.ObjInfoPropOut;
  return {"ra": targetRA, "dec": targetDec};
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
  sky6StarChart.Find(objectName);

  for (var propriedade = 0;propriedade < propriedades;++propriedade)
  {
    if (sky6ObjectInformation.PropertyApplies(propriedade) != 0)
    {
      sky6ObjectInformation.Property(propriedade);

      Out += sky6ObjectInformation.ObjInfoPropOut + "|";
      // Prints out object info.
      print(Out);
    }
  }
}
```

Essa função acha o objeto dado e pega todas as informações relacionadas a ele. Cada propriedade (informação) é representada por um número, por exemplo o número 54 representa a ascensão reta. Ao chamar o método .Property(), ele prepara o resultado na variável ObjInfoPropOut, e pode ser "printado" ou salvo em outra variável.

## Vendo se o slew está sendo realizado

Mesmo você podendo ver no próprio SkyX se o slew está ocorrendo, é bom termos uma função para checarmos isso.

```javascript
function MountIsSlewing()
{
  sky6RASCOMTele.Connect();

  if (Sky6IsConnected())
  {
    // IsSlewComplete retorna zero se o telescópio estiver fazendo o slew.
    if (sky6RASCOMTele.IsSlewComplete != 0)
    {
      print("Not Slewing");
      return false;
    }
    else
    {
      print("Slewing");
      return true;
    }
  }
  else
  {
    print("Telescope not connected.");
  }
}
```

Essa função confirma se está ocorrendo o slew ou não usando o atributo do sky6RASCOMTele.