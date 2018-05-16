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

sky6RASCOMTele.Connect();

function Sky6IsConnected()
{
  if (sky6RASCOMTele.isConnected == 0)
  {
    print("Not connected");
    sky6RASCOMTele.Abort();
    return false;
  }
  return true;
}

function Find(objectName)
{
	// Número de propriedades que um objeto tem.
  var PropCnt = 189;
  var Out = "";
  // Acha o objeto dado.
  sky6StarChart.Find(objectName);

  for (var p = 0;p < PropCnt;++p)
  {
    if (sky6ObjectInformation.PropertyApplies(p) != 0)
    {
      sky6ObjectInformation.Property(p);

      Out += sky6ObjectInformation.ObjInfoPropOut + "|";
      // Prints out object info.
      print(Out);
    }
  }
}

function SetTelescopeTracking(IOn)
{
  sky6RASCOMTele.Connect();

  if (Sky6IsConnected())
  {
    sky6RASCOMTele.SetTracking(IOn, 1);
	  var Out = "TheSkyX Build " + Application.build;
	  Out += "RA Rate = " + sky6RASCOMTele.dRaTrackingRate;
    Out += "Dec Rate = " + sky6RASCOMTele.dDecTrackingRate;
    print(Out);
  }
}

function MountIsSlewing()
{
  sky6RASCOMTele.Connect();

  // Checks connection.
  if (Sky6IsConnected())
  {
    // IsSlewComplete return zero if the telescope is slewing.
    if (sky6RASCOMTele.IsSlewComplete != 0)
    {
      print("Not Slewing");
    }
    else
    {
      print("Slewing");
    }
  }
  else
  {
    print("Telescope not connected.");
  }
}

function SlewTelescopeTo(dRa, dDec, targetObject)
{
  if (Sky6IsConnected())
  {
     sky6RASCOMTele.SlewToRaDec(dRa, dDec, targetObject);
     return true;
  }
	else
	{
    print("Telescope not connected.");
	}
}

function ParkTelescope()
{
  sky6RASCOMTele.Connect();

  if (Sky6IsConnected())
  {
    if (sky6RASCOMTele.isParked != 0) {
      sky6RASCOMTele.Park();
			print(parked);
      return true;
    }
  }
}

function DisconnectTelescope()
{
  sky6RASCOMTele.Disconnect();
  sky6RASCOMTheSky.DisconnectTelescope();
} 

function getRADec(object) {
  sky6StarChart.Find(object);

  sky6ObjectInformation.Property(54);
  var targetRA = sky6ObjectInformation.ObjInfoPropOut;
  sky6ObjectInformation.Property(55);
  var targetDec = sky6ObjectInformation.ObjInfoPropOut;

  return {"ra": targetRA, "dec": targetDec};
}

// Variáveis usadas para checar se os processos já começaram.
var started = false;
var flipped = false;
var turnedOff = false;

var start_time = 9;
var flip_time = 12;
var turn_off_time = 17;

while (sky6IsConnected())
{
  
  var time = new Date();
  var hour = time.getHours();
  var minutes = time.getMinutes();
  var seconds = time.getSeconds();

  print(String(hour) + ":" + String(minutes) + ":" + String(seconds) );

  if (minutes == start_time && started == false)
  {
  	print(started);
    started = true;
    // Slew somewhere.
    var prop = getRADec("Sun");
    SlewTelescopeTo(prop.ra, prop.dec, "Sun");
    print("Started.");
  }
  else if (minutes == flip_time && flipped == false)
  {
    print(flipped);
    flipped = true;
    // Flip.
    var prop = getRADec("Sun");
    SlewTelescopeTo(prop.ra, prop.dec, "Sun");
    print("Flipped.");
  }
  else if (minutes == turn_off_time && turnedOff == false)
  {
    turnedOff = true;
    //SetTelescopeTracking(0);
    ParkTelescope();
    DisconnectTelescope();
    print("Turned off.");
  }
}
