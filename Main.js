/*
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

/*
 * Version: 1.1.9.1 09/25/18
 */

/**
 * Confirma se o script tem conexão com o telescópio.
 *
 * @return false se não estiver conectado.
 *         true se estiver conectado.
 */
function Sky6IsConnected()
{
  if (sky6RASCOMTele.IsConnected == 0) {
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
    WriteFileAndPrint("Mount nao conectado " + connerr.message);
    return false;
  }

  return true;
}

/**
 * Encontra o objeto dado, e escreve todas as propriedades (informações)
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
    print("Objeto nao encontrado");
    RunJavaScriptOutput.writeLine("Objeto nao encontrado");
    return 0;
  }

  for (var prop  = 0;prop < propriedades;++prop) {
    if (sky6ObjectInformation.PropertyApplies(prop) != 0) {
      sky6ObjectInformation.Property(prop);

      Out += sky6ObjectInformation.ObjInfoPropOut + "|";

      // Escreve as informações do objeto.
      print(Out);
      RunJavaScriptOutput.writeLine(Out);
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
  if (Sky6IsConnected()) {
    sky6RASCOMTele.SetTracking(IOn, IIgnoreRates, dRaRate, dDecRate);
    var Out = "RA Rate = " + sky6RASCOMTele.dRaTrackingRate;
    Out += "Dec Rate = " + sky6RASCOMTele.dDecTrackingRate;
    print(Out);
    RunJavaScriptOutput.writeLine(Out);
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
  if (Sky6IsConnected()) {
    // IsSlewComplete retorna zero se o telescópio estiver fazendo o slew.
    if (sky6RASCOMTele.IsSlewComplete != 0) {
      print("Nao esta fazendo o slew.");
      return false;
    } else {
      print("Fazendo o slew.");
      return true;
    }
  } else {
    print("Telescopio nao conectado.");
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
  if (Sky6IsConnected()) {
    try {
      sky6RASCOMTele.SlewToRaDec(dRa, dDec, targetObject);
      return true;
    } catch (slewerr) {
      WriteFileAndPrint("Falha durante o slew: " + slewerr.message);
      return false;
    }
  } else {
    print("Telescopio nao conectado.");
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
  if (Sky6IsConnected()) {
    if (sky6RASCOMTele.IsParked != 0) {
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
  if (Sky6IsConnected()) {
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
function GetRADec(object)
{
  if (Sky6IsConnected()) {
    try {
      sky6StarChart.Find(object);
    } catch (finderr) {
      WriteFileAndPrint("Erro durante o find: " + finderr.message);
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

/**
 * Cria o nome do arquivo para o dia atual.
 * 
 * @return O nome do arquivo do dia atual.
 */
function setFileName()
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

  var filename = year + month + day;

  return filename;
}

/**
 * Pega o horário atual do computador.
 * 
 * @return O horário no formato H%:M%:S%.
 */
function getHorario()
{
  var time = getTimeNow();
  var horario = String(time.hour) + ":" + String(time.minutes) + ":" + String(time.seconds);
  return horario;
}

/**
 * Escreve no debugger e escreve no log a mesma mensagem, junto com
 * o horário do momento.
 *
 * @param filename O nome do arquivo.
 * @param text A mensagem a ser escrita.
 */
function WriteFileAndPrint(text)
{
  var filename = setFileName();
  try {
    TextFile.openForAppend(filename);
    var horario = getHorario();
    TextFile.write(text + " " + horario + "\n");
    print(text + " " + horario);
    TextFile.close();
  } catch (texterr) {
    print("Erro ao editar o log. \n" + texterr.message);
  }
}

function Initialize_s()
{
  sky6RASCOMTele.FindHome();
  var propriedade = GetRADec("Sun");

  WriteFileAndPrint("Iniciou o slew as")
  SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

  WriteFileAndPrint("Iniciou o rastreamento as");
}

function Flip_s()
{
  var propriedade = GetRADec("Sun");
  WriteFileAndPrint("Iniciou o slew as");
  SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

  WriteFileAndPrint("Completou o flip as");
}

function TurnOff_s()
{
  SetTelescopeTracking(0, 1, 0, 0);
  WriteFileAndPrint("Desligou o rastreamento as");

  ParkTelescope();
  WriteFileAndPrint("Parking finalizado as");

  WriteFileAndPrint("Desconectado as");
}

function Connect_s(time, horario)
{
  print("Conectado as " + horario);
  ConnectTelescope();
  var filename = setFileName();
  TextFile.createNew(filename);
  TextFile.write(String(time.day) + "/" + String(time.month) + "/" + String(time.year) + "\n");
  TextFile.write("Conectado as " + horario + "\n");
  TextFile.close();
}

function Reconnect_s()
{
  WriteFileAndPrint("(Re)conectando as");
  ConnectTelescope();
  sky6RASCOMTele.FindHome();
  // Verifica se o Tracking não está ocorrendo.
  if (sky6RASCOMTele.IsTracking == 0)
  {
    var propriedade = GetRADec("Sun");

    WriteFileAndPrint("Iniciou o slew as");
    SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

    WriteFileAndPrint("Reiniciou o rastreamento as");
  }
}

function RestartTracking_s()
{
  var propriedade = GetRADec("Sun");

  WriteFileAndPrint("Iniciou o slew as");
  SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

  WriteFileAndPrint("Reiniciou o rastreamento as");
}

var work_time = {
  "start_hour": 11,
  "start_minutes": 00,
  "flip_hour": 16,
  "flip_minutes": 00,
  "turn_off_hour": 20,
  "turn_off_minutes": 00,
}

while (true)
{
  var time = getTimeNow();
  var horario = getHorario();

  // Verifica se o telescópio está conectado.
  if (Sky6IsConnected()) {
    // Se a hora do computador for a hora de começar.
    if (time.hour == work_time.start_hour && time.minutes == work_time.start_minutes) {
      Initialize_s();
    }
    // Hora exata do flip.
    else if (time.hour == work_time.flip_hour && time.minutes == work_time.flip_minutes) {
      Flip_s();
    }
    // Verifica se a hora do computador é maior ou igual a hora de desligar e
    // se o tracking ainda está ocorrendo.
    else if (time.hour >= work_time.turn_off_hour && sky6RASCOMTele.IsTracking != 0) {
      TurnOff_s();
    }
  }
  // Inicia a conexão no início do dia, no horário exato de 11:00 (08:00 local).
  else if (!Sky6IsConnected() && time.hour == work_time.start_hour && time.minutes == work_time.start_minutes) {
    Connect_s(time, horario)
  }
  // Prevê um eventual problema de simples desconexão do SkyX.
  // Verifica se está desconectado e se está no horário de funcionamento.
  else if (!Sky6IsConnected() && time.hour >= work_time.start_hour && time.hour < work_time.turn_off_hour) {
    Reconnect_s();
  }
  else if (Sky6IsConnected() && time.hour >= work_time.start_hour && time.hour < work_time.turn_off_hour && sky6RASCOMTele.IsTracking == 0) {
    RestartTracking_s();
  }
}
