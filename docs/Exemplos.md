# Exemplos

## Funcionamento da rotina principal.

O código está dentro de um while que confirma se o telescópio está conectado com o TheSkyX. A cada vez que ele é rodado a hora, o minuto e o segundo são salvos em três variáveis para checar o horário.\
Antes de começar o loop são declaradas três variáveis to tipo booleano com o valor false para a confirmação do processo de inicialização, de flip e de desligamento. No início de cada processo o valor da variável em questão é mudado para true. Desse modo não há a possibilidade do processo ser inicializado novamente.

## Pegando a ascensão direita e a declinação do objeto para fazer o slew.

```javascript
// Declara o objeto para ser encontrado e observado.
var targetObject = "Sun";

sky6RASCOMTele.Connect();
sky6StarChart.Find(targetObject);

// A propriedade 54 é a ascensão direita.
sky6ObjectInformation.Property(54);
var targetRA = sky6ObjectInformation.ObjInfoPropOut;

// A propriedade 55 é a declinação.
sky6ObjectInformation.Property(55);
var targetDec = sky6ObjectInformation.ObjInfoPropOut;

// Faz o Slew até o objeto.
sky6RASCOMTele.SlewToRaDec(targetRa, TargetDec, targetObject);
```

Para pegar a ascensão direta e a declinação já há uma função implementada no script principal, chamada getRADec:

```javascript
function getRADec(object) {
  sky6StarChart.Find(object);

  sky6ObjectInformation.Property(54);
  var targetRA = sky6ObjectInformation.ObjInfoPropOut;
  sky6ObjectInformation.Property(55);
  var targetDec = sky6ObjectInformation.ObjInfoPropOut;
  return {"ra": targetRA, "dec": targetDec};
}
```
Essa função retorna um objeto com a ascensão direita e a declinação.
