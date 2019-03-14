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
 * Version: 1.5
 */

/**
 * Confirma se o SkyX tem conexão com a montagem.
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
 * Estabiliza a conexão com a montagem.
 *
 * @returns {boolean} false caso algum erro aconteça.
 */
function ConnectTelescope()
{
    try {
        sky6RASCOMTele.Connect();
    } catch (connerr) {
        WriteLogError("Erro de conexao com a montagem. " + connerr.message, ConnectTelescope);
        return false;
    }

    return true;
}

/**
 * Liga/Desliga o tracking.
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
function SlewTelescopeToRaDec(dRa, dDec, targetObject)
{
    if (!Sky6IsConnected()) {
        WriteLogError("Telescopio nao conectado", SlewTelescopeToRaDec);
        return false;
    }
  
    try {
        sky6RASCOMTele.SlewToRaDec(dRa, dDec, targetObject);
        return true;
    } catch (slewerr) {
        WriteLogError("Falha durante o slew. " + slewerr.message, SlewTelescopeToRaDec);
        return false;
    }
}

/**
 * Faz o slew para um determinado objeto dados azimute e altitude.
 *
 * @param {number} az - Azimute.
 * @param {number} alt - Altitude.
 * @param {string} targetObject - Objeto em questão.
 *
 * @returns {boolean} true se tudo tiver ocorrido corretamente.
 */
function SlewTelescopeToAzAlt(az, alt, targetObject)
{
    if (!Sky6IsConnected()) {
        WriteLogError("Telescopio nao conectado.", SlewTelescopeToAzAlt);
        return false;
    }

    try {
        sky6RASCOMTele.SlewToAzAlt(az, alt, targetObject);
        return true;
    } catch (slewerr) {
        WriteLogError("Falha durante o slew. " + slewerr.message, SlewTelescopeToAzAlt);
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
        WriteLogInfo("Parking finalizado", ParkTelescope);
        return true;
    }
}

/**
 * Procura pelo objeto dado e pega a ascensão reta e a declinação dele
 * no momento.
 *
 * @param {string} object - Nome do objeto a ser encontrado.
 *
 * @returns {object} Um objeto com a ascensão reta e a declinação.
 */
function GetRADec(object)
{
    if (!Sky6IsConnected()) {
        WriteLogError("Erro de conexao", GetRaDec);
        return false;
    }

    try {
        sky6StarChart.Find(object);
    } catch (finderr) {
        WriteLogError("Erro durante o find. " + finderr.message, GetRaDec);
        return false;
    }

    sky6ObjectInformation.Property(54);
    var targetRA = sky6ObjectInformation.ObjInfoPropOut;
    sky6ObjectInformation.Property(55);
    var targetDec = sky6ObjectInformation.ObjInfoPropOut;

    return {"ra": targetRA, "dec": targetDec};
}

/**
 * Pega o azimute e a altitude do objeto sendo observado no momento.
 *
 * @returns {object} Um objeto com o azimute e a altitude.
 */
function GetAzAlt()
{
    if (!Sky6IsConnected()) {
        WriteLogError("Erro de conexao", GetAzAlt);
        return false;
    }

    sky6RASCOMTele.GetAzAlt();
    var az = sky6RASCOMTele.dAz;
    var alt = sky6RASCOMTele.dAlt;

    return {"az": az, "alt": alt};
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
 * Pega o horário atual do computador formatado.
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
 * Escreve no log uma mensagem, junto com o horário do momento.
 * Também define o tipo(nível) de mensagem(Info, Warning ou Error).
 * Formato da mensagem: [LEVEL - 00:00:00] Text
 *
 * @param {string} text -  A mensagem a ser escrita.
 * @param {string} level - Nível da mensage.
 */
function WriteLog(level, text, functionCalling)
{
    var filename = setFileName();
    try {
        TextFile.openForAppend(filename);
        var formattedTime = getFormattedTime();
        var header = "[" + level + " - " + formattedTime  + "] ";
        TextFile.write(header + text + "(" + functionCalling.name + ")\n");
        print(header + text);
        TextFile.close();
    } catch (texterr) {
        PrintAndOut("Erro ao editar o log. " + texterr.message + " (WriteLog)");
    }
}

/**
 * Escreve a mensage de warning no log.
 *
 * @param {string} text -  A mensagem a ser escrita.
 */
function WriteLogWarning(text, functionCalling)
{
    WriteLog("WARNING", text, functionCalling);
}

/**
 * Escreve a mensagem de erro no log.
 *
 * @param {string} text - A mensagem a ser escrita.
 */
function WriteLogError(text, functionCalling)
{
    WriteLog("ERROR", text, functionCalling);
}

/**
 * Escreve a mensagem de informação no log.
 *
 * @param {string} text - A mensagem a ser escrita.
 */
function WriteLogInfo(text, functionCalling)
{
    WriteLog("INFO", text, functionCalling);
}

/**
 * Escreve no debugger e na janela Run Java Script.
 * Deve ser usado somente quando o log estiver inacessível.
 *
 * @param {string} text - O conteúdo a ser escrito.
 */
function PrintAndOut(text)
{
    var level = "WARNING";
    var formattedTime = getFormattedTime();
    var header = "[" + level + " - " + formattedTime  + "] ";
    print(header + text);
    RunJavaScriptOutput.writeLine(header + text);
}

/**
 * Conecta o telescópio e cria o arquivo de log do dia.
 */
function Connect_c()
{
    var time = getTimeNow();
    var formattedTime = getFormattedTime();

    ConnectTelescope();

    var filename = setFileName();
    TextFile.createNew(filename);
    TextFile.write(String(time.day) + "/" + String(time.month) + "/" + String(time.year) + "\n");
    var header = "[INFO - " + formattedTime + "] ";
    TextFile.write(header + "Conectado\n");
    print(header + "Conectado\n");
    TextFile.close();
}

/**
 * Processo de inicialização.
 */
function Initialize_c()
{
    if (sky6RASCOMTele.IsParked != 0) {
        sky6RASCOMTele.Unpark();
    }

    WriteLogInfo("Iniciou o home", Initialize_c);
    sky6RASCOMTele.FindHome();
    var props = GetRADec("Sun");

    WriteLogInfo("Iniciou o slew", Initialize_c);
    SlewTelescopeToRaDec(props.ra, props.dec, "Sun");

    WriteLogInfo("Iniciou o rastreamento", Initialize_c);
}

/**
 * Processo do Flip.
 */
function Flip_c()
{
    var props = GetRADec("Sun");
    WriteLogInfo("Iniciou o slew", Flip_c);
    SlewTelescopeToRaDec(props.ra, props.dec, "Sun");

    WriteLogInfo("Completou o flip",  Flip_c);
}

/**
 * Desliga o tracking e faz o parking.
 */
function TurnOff_c()
{
    SetTelescopeTracking(0, 1, 0, 0);
    WriteLogInfo("Desligou o rastreamento", TurnOff_c);

    ParkTelescope();
    WriteLogInfo("Desconectado", TurnOff_c);
}

/**
 * Reconecta o telescópio e reinicia o tracking.
 */
function Reconnect_c()
{
    WriteLogInfo("(Re)conectado", Reconnect_c);
    ConnectTelescope();
    SetTelescopeTracking(0, 1, 0, 0);
    sky6RASCOMTele.FindHome();
    RestartTracking_c();
}

/**
 * Reinicia o rastreamento.
 */
function RestartTracking_c()
{
    var props = GetRADec("Sun");

    WriteLogInfo("Iniciou o slew", RestartTracking_c);
    SlewTelescopeToRaDec(props.ra, props.dec, "Sun");

    WriteLogInfo("Reiniciou o rastreamento", RestartTracking_c);
}

/**
 * Aponta para o céu baseando-se no azimute.
 */
function CalibrateTelescope_c()
{
    WriteLogInfo("Calibracao iniciada", CalibrateTelescope_c);

    var delta = 20;
    var props = GetAzAlt();
    WriteLogInfo("Azimute atual: " + props.az + " | Altitude atual: " + props.alt);
    var newAz = props.az + delta;
    WriteLogInfo("Azimute futuro: " + newAz + " | Altitude futura: " + props.alt);

    SlewTelescopeToAzAlt(newAz, props.alt, "");
}

/*
 * Configura os horário para inicializar, fazer o flip e desligar.
 */
var work_time = {
    start_hour: 11,
    start_minutes: 00,
    start_seconds: 30,
    flip_hour: 16,
    flip_minutes: 00,
    turn_off_hour: 20,
    turn_off_minutes: 00,
    first_calibration_hour: 15,
    first_calibration_minutes: 00,
    first_calibration_seconds: 00,
    second_calibration_hour: 17,
    second_calibration_minutes: 00,
    second_calibration_seconds: 00,
    finish_first_calibration_hour: 15,
    finish_first_calibration_minutes: 00,
    finish_first_calibration_seconds: 30,
    finish_second_calibration_hour: 17,
    finish_second_calibration_minutes: 00,
    finish_second_calibration_seconds: 30,
};

/**
 * Verifica se é a hora da primeira calibração.
 *
 * @param {object} time - Horário atual.
 * @returns {boolean}
 */
function timeToFirstCalibration(time)
{
    return time.hour == work_time.first_calibration_hour &&
                time.minutes == work_time.first_calibration_minutes &&
                time.seconds == work_time.first_calibration_seconds;
}

/**
 * Verifica se é a hora de voltar para o sol.
 * 
 * @param {object} time - Horário atual.
 * @return {boolean}
 */
function timeToFinishFirstCalibration(time)
{
    return time.hour == work_time.finish_first_calibration_hour &&
                time.minutes == work_time.finish_first_calibration_minutes &&
                time.seconds == work_time.finish_first_calibration_seconds;
}

/**
 * Verifica se é a hora da segunda calibração.
 *
 * @param {object} time - Horário atual.
 * @returns {boolean}
 */
function timeToSecondCalibration(time)
{
    return time.hour == work_time.second_calibration_hour &&
                time.minutes == work_time.second_calibration_minutes &&
                time.seconds == work_time.second_calibration_seconds;
}

/**
 * Verifica se é a hora de voltar para o sol.
 * 
 * @param {object} time - Horário atual.
 * @return {boolean}
 */
function timeToFinishSecondCalibration(time)
{
    return time.hour == work_time.finish_second_calibration_hour &&
                time.minutes == work_time.finish_second_calibration_minutes &&
                time.seconds == work_time.finish_second_calibration_seconds;
}

/**
 * Verifica se é a hora de inicializar.
 *
 * @param {object} time - Horário atual.
 * @returns {boolean}
 */
function timeToInitialize(time)
{
    return time.hour == work_time.start_hour &&
                time.minutes == work_time.start_minutes &&
                time.seconds == work_time.start_seconds;
}

/**
 * Verifica se é a hora do flip.
 *
 * @param {object} time - Horário atual.
 * @returns {boolean}
 */
function timeToFlip(time)
{
    return time.hour == work_time.flip_hour &&
                time.minutes == work_time.flip_minutes;
}

/**
 * Verifica se é(ou já passou) (d)a hora de desligar o tracking e se ele
 * está ocorrendo.
 *
 * @param {object} time - Horário atual.
 * @returns {boolean}
 */
function timeToTurnOff(time)
{
    return time.hour >= work_time.turn_off_hour &&
                sky6RASCOMTele.IsTracking != 0;
}

/**
 * Verifica se é a hora de iniciar a conexão.
 *
 * @param {object} time - Horário atual.
 * @returns {boolean}
 */
function timeToConnect(time)
{
    return time.hour == work_time.start_hour &&
                time.minutes == work_time.start_minutes;
}

/**
 * Verifica se o telescópio está no horário de operação.
 * Procura prever um eventual problema de simples desconexão do SkyX.
 *
 * @param {object} time - Horário atual.
 * @returns {boolean}
 */
function inOperatingTime(time)
{
    return time.hour >= work_time.start_hour &&
                time.hour < work_time.turn_off_hour;
}

while (true)
{
    var time = getTimeNow();

    if (Sky6IsConnected()) {
        if (timeToInitialize(time)) {
            Initialize_c();
        }
        else if (timeToFirstCalibration(time)) {
            CalibrateTelescope_c();
        }
        else if (timeToFinishFirstCalibration(time)) {
            RestartTracking_c();
        }
        else if (timeToFlip(time)) {
            Flip_c();
        }
        else if (timeToSecondCalibration(time)) {
            CalibrateTelescope_c();
        }
        else if (timeToFinishSecondCalibration(time)) {
            RestartTracking_c();
        }
        else if (timeToTurnOff(time)) {
            TurnOff_c();
        }
    }
    else if (timeToConnect(time)) {
        Connect_c();
    }
    else if (inOperatingTime(time)) {
        Reconnect_c();
    }
}
