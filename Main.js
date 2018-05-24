/**
 * Author: Edison Neto (ednetoali@gmail.com)
 *
 * MIT License

 * Copyright (c) 2018 Edison Aguiar de Souza Neto

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Inicia a conexão entre o SkyX e o telescópio.
 */
sky6RASCOMTele.Connect();

/**
 * Confirma se o script tem conexão com o telescópio.
 *
 * @return false se não estiver conectado.
 *         true se estiver conectado.
 */
function Sky6IsConnected()
{
  if (sky6RASCOMTele.isConnected == 0)
  {
    print("Não conectado");
    sky6RASCOMTele.Abort();
    return false;
  }
  return true;
}

/**
 * Faz o Find no objeto dado, e printa todas as propriedades (informações)
 * daquele objeto.
 *
 * @param objectName Nome do objeto a ser encontrado.
 */
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
      // Printa as informações do objeto.
      print(Out);
    }
  }
}

/**
 * 'Liga' o tracking para um lugar específico, ou desliga o tracking.
 *
 * @param IOn Binário(0 ou 1), o número que desliga ou liga o tracking.
 *             0 - desliga
 *             1 - liga
 *
 * @param IIgnoreRates Binário(0 ou 1), o número que especifica se é para o 
 *                                      telescópio usar a taxa de tracking atual.
 *             0 - Ignora os valores de dRaRate e dDecRate
 *             1 - Usa os valores de dRaRate e dDecRate
 *
 * @param dRaRate Especifica a ascensão reta a ser usada. Só é utilizada se 
 *                IIgnoreRates for igual à 1.
 *
 * @param dDecRate Especifica a declinação a ser usada. Só é utilizada se
 *                 IIgnoreRates for igual à 1.
 */
function SetTelescopeTracking(IOn, IIgnoreRates, dRaRate, dDecRate)
{
  sky6RASCOMTele.Connect();

  if (Sky6IsConnected() === true)
  {
    sky6RASCOMTele.SetTracking(IOn, IIgnoreRates, dRaRate, dDecRate);
    var Out = "TheSkyX Build " + Application.build;
    Out += "RA Rate = " + sky6RASCOMTele.dRaTrackingRate;
    Out += "Dec Rate = " + sky6RASCOMTele.dDecTrackingRate;
    print(Out);
  }
}

/**
 * Confirma se o slew está ocorrendo ou não.
 *
 * @return true se estiver fazendo o slew.
 *         false se não estiver fazendo o slew.
 */
function MountIsSlewing()
{
  sky6RASCOMTele.Connect();

  if (Sky6IsConnected() === true)
  {
    // IsSlewComplete retorna zero se o telescópio estiver fazendo o slew.
    if (sky6RASCOMTele.IsSlewComplete != 0)
    {
      print("Não está fazer o slew.");
      return false;
    }
    else
    {
      print("Fazendo o slew.");
      return true;
    }
  }
  else
  {
    print("Telescópio não conectado.");
  }
}

/**
 * Faz o slew para um determinado objeto dados sua ascensão reta e declinação.
 *
 * @param dRa ascensão reta.
 * @param dDec declinação.
 * @param targetObjecto Objeto para fazer o slew.
 *
 * @return true se tudo tiver ocorrido normalmente.
 */
function SlewTelescopeTo(dRa, dDec, targetObject)
{
  if (Sky6IsConnected() === true)
  {
     sky6RASCOMTele.SlewToRaDec(dRa, dDec, targetObject);
     return true;
  }
  else
  {
    print("Telescópio não conectado.");
    return false;
  }
}

/**
 * Leva o telescópio para a posição de parking.
 *
 * @return true se tudo tiver ocorrido normalmente.
 */
function ParkTelescope()
{
  sky6RASCOMTele.Connect();

  if (Sky6IsConnected() === true)
  {
    if (sky6RASCOMTele.isParked() != 0) {
      sky6RASCOMTele.Park();
      print("Parking completo.");
      return true;
    }
  }
}

/**
 * Desconecta o SkyX do telescópio.
 */
function DisconnectTelescope()
{
  if (Sky6IsConnected() === true)
  {
    sky6RASCOMTele.Disconnect();
  }
} 

/**
 * Encontra o objeto dado e retorna um object com a ascensão reta e
 * a declinação.
 *
 * @param object Nome do objeto a ser encontrado.
 * @return Um objeto com a ascensão reta (ra) e a declinação (dec).
 */
function getRADec(object)
{
  if (Sky6IsConnected() === true) {
    sky6StarChart.Find(object);

    sky6ObjectInformation.Property(54);
    var targetRA = sky6ObjectInformation.ObjInfoPropOut;
    sky6ObjectInformation.Property(55);
    var targetDec = sky6ObjectInformation.ObjInfoPropOut;

    return {"ra": targetRA, "dec": targetDec};
  }
}

// Variáveis usadas para checar se os processos já começaram.
var started = false;
var flipped = false;
var turnedOff = false;

var start_time = 9;
var flip_time = 12;
var turn_off_time = 17;

while (true) {
  var time = new Date();
  var hour = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();

  if (Sky6IsConnected() === true)
  {
    var horario = String(hour) + ":" + String(minutes) + ":" + String(seconds);
    print(horario);
  
    if (hour == start_time && started == false)
    {
      started = true;
      var propriedade = getRADec("Sun");
      SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");
      print("Ligou às " + horario);
    }
    else if (hour == flip_time && flipped == false)
    {
      flipped = true;
      var propriedade = getRADec("Sun");
      SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");
      print("Fez o flip às " + horario);
    }
    else if (hour == turn_off_time && turnedOff == false)
    {
      turnedOff = true;
      SetTelescopeTracking(0, 1, 0, 0);
      ParkTelescope();
      DisconnectTelescope();

      print("Desligado às " + horario);
    }
  }
  else if (hour == start_time)
  {
    sky6RASCOMTele.Connect();
    started = false;
    flipped = false;
    turnedOff = false;
  }
}
