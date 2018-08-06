/**
 * Author: Edison Neto (ednetoali@gmail.com)

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
 * Version: 1.1.6 08/06/18
 */

/**
 * Confirma se o script tem conexão com o telescópio.
 *
 * @return false se não estiver conectado.
 *         true se estiver conectado.
 */
function Sky6IsConnected()
{
  if (sky6RASCOMTele.IsConnected == 0)
  {
    return false;
  }
  return true;
}

/**
 * Estabiliza a conexão com o telescópio.
 * 
 * @return false case algum erro aconteça.
 */
function ConnectTelescope()
{
  try {
    sky6RASCOMTele.Connect();
  } catch (connerr) {
    print("Mount não conectado " + connerr.message);
    return false;
  }

  return true;
}

/**
 * Encontra o objeto dado, e printa todas as propriedades (informações)
 * daquele objeto.
 *
 * @param objectName Nome do objeto a ser encontrado.
 * @return Zero se objeto não encontrado.
 */
function Find(objectName)
{
  // Número de propriedades que um objeto tem.
  var propriedades = 189;
  var Out = "";
  // Acha o objeto dado.
  try {
    sky6StarChart.Find(objectName);
  } catch (finderr) {
    print("Objeto não encontrado");
    return 0;
  }

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
  if (sky6RASCOMTele.IsConnected != 0)
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
  if (sky6RASCOMTele.IsConnected != 0)
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
 * @return true se tudo tiver ocorrido corretamente.
 */
function SlewTelescopeTo(dRa, dDec, targetObject)
{
  if (sky6RASCOMTele.IsConnected != 0)
  {
    try {
      sky6RASCOMTele.SlewToRaDec(dRa, dDec, targetObject);
      return true;
    } catch (slewerr) {
      print("Falha durano o slew: " + slewerr.message);
      return false;
    }
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
 * @return true se tudo tiver ocorrido corretamente.
 */
function ParkTelescope()
{
  if (sky6RASCOMTele.IsConnected != 0)
  {
    if (sky6RASCOMTele.IsParked != 0)
    {
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
  if (sky6RASCOMTele.IsConnected != 0)
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
  if (sky6RASCOMTele.IsConnected != 0)
  {
    try {
      sky6StarChart.Find(object);
    } catch (finderr) {
      print("Erro durante o find: " + finderr.message);
      return false;
    }

    sky6ObjectInformation.Property(54);
    var targetRA = sky6ObjectInformation.ObjInfoPropOut;
    sky6ObjectInformation.Property(55);
    var targetDec = sky6ObjectInformation.ObjInfoPropOut;

    return {"ra": targetRA, "dec": targetDec};
  }
}

/**
 * Pega a data e o horário do momento que a função é chamada.
 *
 * @return Um objeto com os dados.
 */
function getTimeNow()
{
  var time = new Date();
  var day = time.getDate();
  var month = time.getMonth();
  var year = time.getFullYear();
  var hour = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();

  return {
      "day": day,
      "month": month,
      "year": year,
      "hour": hour,
      "minutes": minutes,
      "seconds": seconds
  };
}

function SetFileName()
{
  var time = getTimeNow();

  if (time.day < 10) {
    var day = "0" + String(time.day);
  } else {
    var day = String(time.day);
  }

  if (time.month < 10) {
    var month = "0" + String(time.month);
  } else {
    var month = String(time.month);
  }

  var year = String(time.year);

  var filename = year + month + dia;

  return filename;
}

function getHorario()
{
  var time = getTimeNow();
  horario = String(time.hour) + ":" + String(time.minutes) + ":" + String(time.seconds);
  return horario
}

var start_hour = 11;
var start_minutes = 00;
var flip_hour = 16;
var flip_minutes = 00;
var turn_off_hour = 20;
var turn_off_minutes = 00;

while (true)
{
  var time = getTimeNow();
  var horario = getHorario();
  var filename = SetFileName();

  // Verifica se o telescópio está conectado.
  if (sky6RASCOMTele.IsConnected != 0)
  {
    // Se a hora do computador for a hora de começar.
    if (time.hour == start_hour && time.minutes == start_minutes)
    {
      TextFile.openForAppend(filename);
      sky6RASCOMTele.FindHome();
      var propriedade = getRADec("Sun");

      horario = getHorario();
      print("Iniciou o slew as " + horario);
      TextFile.write("Iniciou o slew as " + horario + "\n");
      SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

      horario = getHorario();
      print("Iniciou o rastreamento as " + horario);
      TextFile.write("Iniciou o rastreamento as " + horario + "\n");
      TextFile.close();
    }
    // Hora exata do flip.
    else if (time.hour == flip_hour && time.minutes == flip_minutes)
    {
      TextFile.openForAppend(filename);
      var propriedade = getRADec("Sun");
      horario = getHorario();
      print("Iniciou o slew as " + horario);
      TextFile.write("Iniciou o slew as " + horario + "\n");
      SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

      horario = getHorario();
      print("Completou o flip as " + horario);
      TextFile.write("Completou o flip as " + horario + "\n");
      TextFile.close();
    }
    // Verifica se a hora do computador é maior ou igual a hora de desligar e
    // se o tracking ainda está ocorrendo.
    else if (time.hour >= turn_off_hour && sky6RASCOMTele.IsTracking != 0)
    {
      TextFile.openForAppend(filename);
      SetTelescopeTracking(0, 1, 0, 0);
      horario = getHorario();
      print("Desligou o rastreamento as " + horario);
      TextFile.write("Desligou o rastreamento as " + horario + "\n");

      ParkTelescope();
      horario = getHorario();
      print("Parking finalizado as " + horario);

      TextFile.write("Parking finalizado as " + horario + "\n");

      horario = getHorario();
      print("Desconectado as " + horario);
      TextFile.write("Desconectado as " + horario + "\n");
      TextFile.close();
    }
  }
  // Inicia a conexão no início do dia, no horário exato de 11:00 (08:00 local).
  else if (sky6RASCOMTele.IsConnected == 0 && time.hour == start_hour && time.minutes == start_minutes)
  {
    print("Conectado as " + horario);
    ConnectTelescope();
    TextFile.createNew(filename);
    TextFile.write(String(time.day) + "/" + String(time.month) + "/" + String(time.year) + "\n");
    TextFile.write("Conectado as " + horario + "\n");
    TextFile.close();
  }
  // Prevê um eventual problema de simples desconexão do SkyX.
  // Verifica se está desconectado e se está no horário de funcionamento.
  else if (sky6RASCOMTele.IsConnected == 0 && time.hour >= start_hour && time.hour < turn_off_hour)
  {
    print("Reconectando...");
    ConnectTelescope();
    // Verifica se o Tracking não está ocorrendo e se há um slew em execução.
    if (sky6RASCOMTele.IsTracking == 0 && sky6RASCOMTele.IsSlewComplete != 0)
    {
      TextFile.openForAppend(filename);
      var propriedade = getRADec("Sun");

      horario = getHorario();
      print("Iniciou o slew as " + horario);
      TextFile.write("Iniciou o slew as " + horario + "\n");
      SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

      horario = getHorario();
      print("Reiniciou o rastreamento as " + horario);
      TextFile.write("Reiniciou o rastreamento as " + horario + "\n");

      TextFile.close();
    }
  }
}
