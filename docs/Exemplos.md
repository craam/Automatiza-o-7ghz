# Exemplos

## Pegando a ascensão direita e a declinação do objeto para fazer o slew.

```javascript
var targetObject = "Sun";

sky6RASCOMTele.Connect();
sky6StarChart.Find(targetObject);

sky6RASCOMTele.SlewToRaDec(targetRa, TargetDec, targetObject);
```
