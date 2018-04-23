/**
 * Author: Edison Neto (ednetoali@gmail.com)
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
      RunJavaScriptOutput.writeLine(Out);
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
    RunJavaScriptOutput.writeLine(Out);

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

function MountIsSlewing(TargetRA, TargetDec)
{
  var TargetRA = "21";
  var TargetDec = "20";
  var Out;

  sky6RASCOMTele.Connect();

  // Checks connection.
  if (Sky6IsConnected())
  {
    // IsSlewComplete return zero if the telescope is slewing.
    if (sky6RASCOMTele.IsSlewComplete != 0)
    {
      Out  = "Not Slewing";
      RunJavaScriptOutput.writeLine(Out);
      return false
    }
    else
    {
      Out  = "Slewing";
      RunJavaScriptOutput.writeLine(Out);
      return true;
    }
  }
  else
  {
    RunJavaScriptOutput.writeLine("Telescope not connected.");
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
      RunJavaScriptOutput.writeLine("An error ocurred.");
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
  sky6RASCOMTheSjy.DiconnectTelescope();
} 

function Main()
{
  sky6RASCOMTele.Connect();
  if (Sky6IsConnected())
  {
    // Gets the time when the function runs.
    var time = new Date();
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    var started = false;
    var flip = false;
    var turnedOff = false;

    if (hour == 9 && started === false)
    {
      DoSomething();
      Find("Sun");
      started = true;
      RunJavaScriptOutput.writeLine("Started.")
    }
    else if (hour == 13 && flip === false)
    {

      SlewTelescopeTo(0, 0);
      while (MountIsSlewing())
      {
        RunJavaScriptOutput.writeLine("Slewing...");
      }

      flip = true;
      RunJavaScriptOutput.writeLine("Flipped.")
    }
    else if (hour == 18 && turnedOff === false)
    {
      DoSomeOtherThing()
      SetTelescopeTracking(0);
      ParkTelescope();
      DisconnectTelescope();
      turnedOff = true;
      RunJavaScriptOutput.writeLine("Turned off.")
    }
  }
}

setInterval(function() {
  Main();
}, "1000");
