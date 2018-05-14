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

function Sky6IsConnected()
{
  if (sky6RASCOMTele.isConnected == 0)
  {
    out = "Not connected";
    sky6RASCOMTele.Abort();
    return false;
  }
  return true;
}

function Find(objectName)
{
  var PropCnt = 189;
  var Out = "";
  // Find the given object.
  sky6StarChart.Find(objectName);

  for (var p = 0;p < PropCnt;++p)
  {
    if (sky6ObjectInformation.PropertyApplies(p) != 0)
    {
      /* Latch the property into ObjInfoPropOut */
      sky6ObjectInformation.Property(p);

      /* Append into s */
      Out += sky6ObjectInformation.ObjInfoPropOut + "|";
      // Prints out object info.
      print(Out);
      return true;
    }
  }
}

function TheSkyX()
{
  var Out;
  sky6RASCOMTele.Connect()
  if (Sky6IsConnected())
  {
    sky6RASCOMTele.GetRaDec();
    Out = String(sky6RASCOMTele.dRa);
    Out += " " + String(sky6RASCOMTele.dDec);
    print(Out);

    return {
      "dRa": sky6RASCOMTele.dRa,
      "dDec": sky6RASCOMTele.dDec
    }
  }
  else
  {
    return false;
  }
}


function SetTelescopeTracking(IOn)
{
  sky6RASCOMTele.Connect();

  if (Sky6IsConnected())
  {
    sky6RASCOMTele.SetTracking(IOn, 1);
	  Out = "TheSkyX Build " + Application.build + cr;
	  Out += "RA Rate = " + sky6RASCOMTele.dRaTrackingRate + cr;
    Out += "Dec Rate = " + sky6RASCOMTele.dDecTrackingRate + cr; 
    return Out;
  }
  else
  {
    return false;
  }
}

function MountIsSlewing()
{
  var Out;

  sky6RASCOMTele.Connect();

  // Checks connection.
  if (Sky6IsConnected())
  {
    // IsSlewComplete return zero if the telescope is slewing.
    if (sky6RASCOMTele.IsSlewComplete != 0)
    {
      Out  = "Not Slewing";
      print(Out);
      return false
    }
    else
    {
      Out  = "Slewing";
      print(Out);
      return true;
    }
  }
  else
  {
    print("Telescope not connected.");
    return false;
  }
}

function SlewTelescopeTo(dRa, dDec)
{
  if (Sky6IsConnected())
  {
    try
    {
      sky6RASCOMTele.SlewToRaDec(dRa, dDec);
      return true;
    }
    catch
    {
      print("An error ocurred.");
      return false;
    }
  }
}

function ParkTelescope()
{
  sky6RASCOMTele.Connect();

  if (Sky6IsConnected() && !(sky6RASCOMTele.isParked()))
  {
    sky6RASCOMTele.Park();
    return true;
  }
  else
  {
    return false;
  }
}

function DisconnectTelescope()
{
  sky6RASCOMTele.Diconnect();
  sky6RASCOMTheSky.DiconnectTelescope();
} 

function Main()
{
  sky6RASCOMTele.Connect();
  while (Sky6IsConnected())
  {
    // Gets the time when the function runs.
    var time = new Date();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    print(String(hour) + " | " + String(minutes) + " | " + String(seconds));

    var started = false;
    var flip = false;
    var turnedOff = false;

    /**
     * Turn on process(9:00):
     * Connect
     * Find Sun
     * Slew
     * 
     * Flip process(13:00):
     * Slew
     * 
     * Shutdown process(17:00):
     * Tracking off
     * Park
     * Disconnect.
     */

    if (hour == 9 && started === false)
    {
      started = true;
      Find("Sun");
      // Slew somewhere.
      SlewTelescopeTo(0, 0);
      print("Started.");
    }
    else if (hour == 13 && flip === false)
    {
      flip = true;
      // Flip.
      SlewTelescopeTo(0, 0);
      while (MountIsSlewing())
      {
        print("Slewing...");
      }

      print("Flipped.");
    }
    else if (hour == 18 && turnedOff === false)
    {
      turnedOff = true;
      SetTelescopeTracking(0);
      ParkTelescope();
      DisconnectTelescope();
      print("Turned off.");
    }
  }
}

setInterval(function() {
  Main();
}, "1000");
