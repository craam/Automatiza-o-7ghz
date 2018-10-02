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
 * Version: 1.2.1 10/02/18
 */

/**
 * Confirma se o script tem conexão com o telescópio.
 *
 * @returns {boolean} false se não estiver conectado.
 *                    true se estiver conectado.
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
 * @returns {boolean} false case algum erro aconteça.
 */
function ConnectTelescope()
{
  try {
    sky6RASCOMTele.Connect();
  } catch (connerr) {
    WriteFileAndPrint("Erro de conexão com a montagem: " + connerr.message + " ");
    return false;
  }

  return true;
}

/**
 * Encontra o objeto dado, e escreve todas as propriedades (informações)
 * daquele objeto.
 *
 * @param {string} objectName - Nome do objeto a ser encontrado.
 * @returns {boolean} false se objeto não encontrado.
 */
function Find(objectName)
{
  var props = 189;
  try {
    sky6StarChart.Find(objectName);
  } catch (finderr) {
    PrintAndOut("Objeto nao encontrado.\n" + finderr.message);
    return false;
  }

  for (var prop = 0;prop < props;++prop) {
    if (sky6ObjectInformation.PropertyApplies(prop) != 0) {
      sky6ObjectInformation.Property(prop);

      PrintAndOut(sky6ObjectInformation.ObjInfoPropOut + "|");
    }
  }
}

/**
 * Liga o tracking para um lugar específico, ou desliga o tracking.
 *
 * @param {number} IOn -  Binário(0 ou 1), o número que desliga ou liga o tracking.
 *                              0 - desliga
 *                              0 - liga
 *
 * @param {number} IIgnoreRates - Binário(0 ou 1), o número que especifica se é para o 
 *                                      telescópio usar a taxa de tracking atual.
 *                              0 - Ignora os valores de dRaRate e dDecRate
 *                              1 - Usa os valores de dRaRate e dDecRate
 *
 * @param {number} dRaRate - Especifica a ascensão reta a ser usada. Só é utilizada se 
 *                          IIgnoreRates for igual à 1.
 *
 * @param {number} dDecRate - Especifica a declinação a ser usada. Só é utilizada se
 *                          IIgnoreRates for igual à 1.
 *
 * @returns {boolean} false se a montagem não estiver conectada.
 */
function SetTelescopeTracking(IOn, IIgnoreRates, dRaRate, dDecRate)
{
  if (!Sky6IsConnected()) {
    return false;
  }

  sky6RASCOMTele.SetTracking(IOn, IIgnoreRates, dRaRate, dDecRate);
  var Out = "RA Rate = " + sky6RASCOMTele.dRaTrackingRate;
  Out += " | Dec Rate = " + sky6RASCOMTele.dDecTrackingRate;
  PrintAndOut(Out);
  return true;
}

/**
 * Confirma se o slew está ocorrendo ou não.
 *
 * @returns {boolean} true se estiver fazendo o slew.
 *                    false se não estiver fazendo o slew.
 */
function MountIsSlewing()
{
  if (!Sky6IsConnected()) {
    PrintAndOut("Telescopio nao conectado.");
    return false;
  }

  // IsSlewComplete retorna zero se o telescópio estiver fazendo o slew.
  if (sky6RASCOMTele.IsSlewComplete != 0) {
    PrintAndOut("Nao esta fazendo o slew.");
    return false;
  } else {
    PrintAndOut("Fazendo o slew.");
    return true;
  }
}

/**
 * Faz o slew para um determinado objeto dados sua ascensão reta e declinação.
 *
 * @param {number} dRa - ascensão reta.
 * @param {number} dDec - declinação.
 * @param {string} targetObject - Objeto para fazer o slew.
 *
 * @returns {boolean} true se tudo tiver ocorrido corretamente.
 */
function SlewTelescopeTo(dRa, dDec, targetObject)
{
  if (!Sky6IsConnected()) {
    PrintAndOut("Telescopio nao conectado.");
    return false;
  }
  
  try {
    sky6RASCOMTele.SlewToRaDec(dRa, dDec, targetObject);
    return true;
  } catch (slewerr) {
    WriteFileAndPrint("Falha durante o slew: " + slewerr.message);
    return false;
  }
}

/**
 * Leva o telescópio para a posição de parking.
 *
 * @returns {boolean} true se tudo tiver ocorrido corretamente.
 */
function ParkTelescope()
{
  if (Sky6IsConnected()) {
    return false;
  }

  if (sky6RASCOMTele.IsParked != 0) {
    sky6RASCOMTele.Park();
    PrintAndOut("Parking completo.");
    return true;
  }
}

/**
 * Finaliza a conexão entre o SkyX e a montagem.
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
 * @param {string} object - Nome do objeto a ser encontrado.
 * @returns {object} Um objeto com a ascensão reta (ra) e a declinação (dec).
 */
function GetRADec(object)
{
  if (!Sky6IsConnected()) {
    WriteFileAndPrint("Erro de conexao tentando executar a funcao GetRADec ");
    return false;
  }

  try {
    sky6StarChart.Find(object);
  } catch (finderr) {
    WriteFileAndPrint("Erro durante o find: " + finderr.message + " ");
    return false;
  }

  sky6ObjectInformation.Property(54);
  var targetRA = sky6ObjectInformation.ObjInfoPropOut;
  sky6ObjectInformation.Property(55);
  var targetDec = sky6ObjectInformation.ObjInfoPropOut;

  return {"ra": targetRA, "dec": targetDec};
}

/**
 * Pega a data e o horário do momento que a função é chamada.
 *
 * @returns {object} Um objeto com os dados.
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
 * @returns {string} O nome do arquivo do dia atual.
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
 * @returns {string} O horário no formato H%:M%:S%.
 */
function getHorario()
{
  var time = getTimeNow();
  var horario = String(time.hour) + ":" + String(time.minutes) + ":" + String(time.seconds);
  return horario;
}

/**
 * Escreve no debugger e escreve no arquivo de log a mesma mensagem,
 * junto com o horário do momento.
 *
 * @param {string} text -  A mensagem a ser escrita.
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
    PrintAndOut("Erro ao editar o log. \n" + texterr.message);
  }
}

/**
 * Escreve no debugger e na Run Java Script.
 * 
 * @param {string} text - A mensagem.
 */
function PrintAndOut(text)
{
  print(text);
  RunJavaScriptOutput.writeLine(text);
}

/**
 * Processo de inicialização.
 */
function Initialize_s()
{
  sky6RASCOMTele.FindHome();
  var propriedade = GetRADec("Sun");

  WriteFileAndPrint("Iniciou o slew as")
  SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

  WriteFileAndPrint("Iniciou o rastreamento as");
}

/**
 * Processo do Flip.
 */
function Flip_s()
{
  var propriedade = GetRADec("Sun");
  WriteFileAndPrint("Iniciou o slew as");
  SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

  WriteFileAndPrint("Completou o flip as");
}

/**
 * Processo de desligamento.
 */
function TurnOff_s()
{
  SetTelescopeTracking(0, 1, 0, 0);
  WriteFileAndPrint("Desligou o rastreamento as");

  ParkTelescope();
  WriteFileAndPrint("Parking finalizado as");

  WriteFileAndPrint("Desconectado as");
}

/**
 * Conecta no início do dia e cria o arquivo de log diário.
 */
function Connect_s()
{
  var time = getTimeNow();
  var horario = getHorario();

  print("Conectado as " + horario);
  ConnectTelescope();

  var filename = setFileName();
  TextFile.createNew(filename);
  TextFile.write(String(time.day) + "/" + String(time.month) + "/" + String(time.year) + "\n");
  TextFile.write("Conectado as " + horario + "\n");
  TextFile.close();
}

/**
 * Reconecta e reinicia o tracking.
 */
function Reconnect_s()
{
  WriteFileAndPrint("(Re)conectando as");
  ConnectTelescope();
  sky6RASCOMTele.FindHome();
  // Verifica se o Tracking não está ocorrendo.
  if (sky6RASCOMTele.IsTracking == 0) {
    RestartTracking_s();
  }
}

/**
 * Reinicia o rastreamento.
 */
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
};

while (true)
{
  var time = getTimeNow();

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
    Connect_s();
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
