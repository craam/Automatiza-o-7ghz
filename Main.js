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
 * Version: 1.3 11/01/18
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
 * @returns {boolean} false caso algum erro aconteça.
 */
function ConnectTelescope()
{
    try {
        sky6RASCOMTele.Connect();
    } catch (connerr) {
        WriteLog("Erro de conexao com a montagem\n" + connerr.message + " ");
        return false;
    }

    return true;
}

/**
 * Liga o tracking para um lugar específico, ou desliga o tracking.
 *
 * @param {number} IOn - O número que desliga ou liga o tracking.
 *                              0 - desliga
 *                              1 - liga
 *
 * @param {number} IIgnoreRates - O número que especifica se é para o 
 *                                telescópio usar a taxa de tracking atual.
 *                              0 - Ignora os valores de dRaRate e dDecRate
 *                              1 - Usa os valores de dRaRate e dDecRate
 *
 * @param {number} dRaRate - Especifica a ascensão reta a ser usada.
 *                           Só é utilizada se IIgnoreRates for igual à 1.
 *
 * @param {number} dDecRate - Especifica a declinação a ser usada.
 *                           Só é utilizada se IIgnoreRates for igual à 1.
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
 * Faz o slew para um determinado objeto dados sua ascensão reta e declinação.
 *
 * @param {number} dRa - ascensão reta.
 * @param {number} dDec - declinação.
 * @param {string} targetObject - Objeto em questão.
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
        WriteLog("Falha durante o slew: " + slewerr.message);
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
    if (!Sky6IsConnected()) {
        return false;
    }

    if (sky6RASCOMTele.IsParked != 0) {
        sky6RASCOMTele.Park();
        WriteLog("Parking completo.");
        return true;
    }
}

/**
 * Prcoura pelo objeto dado e pega a ascensão reta e a declinação dele
 * no momento.
 *
 * @param {string} object - Nome do objeto a ser encontrado.
 * @returns {object} Um objeto com a ascensão reta e a declinação.
 */
function GetRADec(object)
{
    if (!Sky6IsConnected()) {
        WriteLog("Erro de conexao tentando executar a funcao GetRADec");
        return false;
    }

    try {
        sky6StarChart.Find(object);
    } catch (finderr) {
        WriteLog("Erro durante o find.\n" + finderr.message + " ");
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
 * @returns {string} O horário no formato %H:%M:%S.
 */
function getFormattedTime()
{
    var time = getTimeNow();
    var formattedTime = String(time.hour) + ":" + String(time.minutes) + ":" + String(time.seconds);
    return formattedTime;
}

/**
 * Escreve no debugger e no log a mesma mensagem, junto com o horário
 * do momento.
 *
 * @param {string} text -  A mensagem a ser escrita.
 */
function WriteLog(text)
{
    var filename = setFileName();
    try {
        TextFile.openForAppend(filename);
        var formattedTime = getFormattedTime();
        TextFile.write(text + " " + formattedTime + "\n");
        print(text + " " + formattedTime);
        TextFile.close();
    } catch (texterr) {
        PrintAndOut("Erro ao editar o log.\n" + texterr.message);
    }
}

/**
 * Escreve no debugger e na janela Run Java Script.
 * 
 * @param {string} text - O conteúdo a ser escrito.
 */
function PrintAndOut(text)
{
    print(text);
    RunJavaScriptOutput.writeLine(text);
}

/**
 * Processo de inicialização.
 */
function Initialize_c()
{
    sky6RASCOMTele.FindHome();
    var propriedade = GetRADec("Sun");

    WriteLog("Iniciou o slew as");
    SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

    WriteLog("Iniciou o rastreamento as");
}

/**
 * Processo do Flip.
 */
function Flip_c()
{
    var propriedade = GetRADec("Sun");
    WriteLog("Iniciou o slew as");
    SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

    WriteLog("Completou o flip as");
}

/**
 * Processo de desligamento.
 */
function TurnOff_c()
{
    SetTelescopeTracking(0, 1, 0, 0);
    WriteLog("Desligou o rastreamento as");

    ParkTelescope();
    WriteLog("Parking finalizado as");

    WriteLog("Desconectado as");
}

/**
 * Conecta no início do dia e cria o arquivo de log diário.
 */
function Connect_c()
{
    var time = getTimeNow();
    var formattedTime = getFormattedTime();

    print("Conectado as " + formattedTime);
    ConnectTelescope();

    var filename = setFileName();
    TextFile.createNew(filename);
    TextFile.write(String(time.day) + "/" + String(time.month) + "/" + String(time.year) + "\n");
    TextFile.write("Conectado as " + formattedTime + "\n");
    TextFile.close();
}

/**
 * Reconecta e reinicia o tracking.
 */
function Reconnect_c()
{
    WriteLog("(Re)conectado as");
    ConnectTelescope();
    sky6RASCOMTele.FindHome();
    // Verifica se o Tracking não está ocorrendo.
    if (sky6RASCOMTele.IsTracking == 0) {
        RestartTracking_c();
    }
}

/**
 * Reinicia o rastreamento.
 */
function RestartTracking_c()
{
    var propriedade = GetRADec("Sun");

    WriteLog("Iniciou o slew as");
    SlewTelescopeTo(propriedade.ra, propriedade.dec, "Sun");

    WriteLog("Reiniciou o rastreamento as");
}

/*
 * Configura os horário para inicializar, fazer o flip e desligar.
 */
var work_time = {
    "start_hour": 11,
    "start_minutes": 00,
    "flip_hour": 16,
    "flip_minutes": 00,
    "turn_off_hour": 20,
    "turn_off_minutes": 00,
};

/**
 * Verifica se é a hora de inicializar.
 *
 * @param {object} time - Horário atual.
 */
function timeToInitialize(time)
{
    return time.hour == work_time.start_hour && time.minutes == work_time.start_minutes;
}

/**
 * Verifica se é a hora do flip.
 *
 * @param {object} time - Horário atual.
 */
function timeToFlip(time)
{
    return time.hour == work_time.flip_hour && time.minutes == work_time.flip_minutes;
}

/**
 * Verifica se é(ou já passou) (d)a hora de desligar e se o tracking está ocorrendo.
 *
 * @param {object} time - Horário atual.
 */
function timeToTurnOff(time)
{
    return time.hour >= work_time.turn_off_hour && sky6RASCOMTele.IsTracking != 0;
}

/**
 * Verifica se é a hora de iniciar a conexão.
 *
 * @param {object} time - Horário atual.
 */
function timeToConnect(time)
{
    return !Sky6IsConnected() && time.hour == work_time.start_hour &&
                time.minutes == work_time.start_minutes;
}

/**
 * Verifica se o telescópio está desconectado e se está no horário de funcionamento.
 * Procurar prever um eventual problema de simples desconexão do SkyX.
 *
 * @param {object} time - Horário atual.
 */
function connectionProblem(time)
{
    return !Sky6IsConnected() && time.hour >= work_time.start_hour &&
                time.hour < work_time.turn_off_hour;
}

/**
 * Verifica se o telescópio está conectado no horário de funcionamento, mas
 * não está fazendo o tracking.
 * 
 * @param {object} time - Horário atual.
 */
function checkTracking(time)
{
    return Sky6IsConnected() && time.hour >= work_time.start_hour &&
                time.hour < work_time.turn_off_hour && sky6RASCOMTele.IsTracking == 0;
}

while (true)
{
    var time = getTimeNow();

    if (Sky6IsConnected()) {
        if (timeToInitialize(time)) {
            Initialize_c();
        }
        else if (timeToFlip(time)) {
            Flip_c();
        }
        else if (timeToTurnOff(time)) {
            TurnOff_c();
        }
    }
    else if (timeToConnect(time)) {
        Connect_c();
    }
    else if (connectionProblem(time)) {
        Reconnect_c();
    }
    else if (checkTracking(time)) {
        RestartTracking_c();
    }
}
