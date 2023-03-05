
var defaultptzport=8091;// 默认端口
var g_ptz_port = defaultptzport;
var g_uc_port=0;
var gxmlDoc=0;
var g_szLan=null;
var g_lanxXmlDoc = null;
var g_titleLangDoc=null;

var g_RecordFlash=0;
var g_TalkbackFlash=0;
var g_isIe11Viewer=false;





function ShowError(ev,fromstr)
{
    //alert(ev.destription);
}




function TranslateElements(targetDocument,tag,propertyToSet)
{
    var e=targetDocument.getElementsByTagName(tag);
    for(var i=0;i<e.length;i++)
    {
        var sKey=e[i].getAttribute('id');
        if(sKey)
        {
            var s=getNodeValue(sKey);
            if(s && tag == 'LABEL' )
            {
                if(propertyToSet!="title")
                {
                   s = s.replace(/ /g,"&nbsp;");
                }
            }
            if(s)
            {
                eval('e[i].'+propertyToSet+' = s');
            }
        }
    }
}

function getNodeValue(tagName)
{
	if(g_lanxXmlDoc == null)
	{
	  return "";
	}
	var nodelist=g_lanxXmlDoc.getElementsByTagName(tagName);
	if(nodelist!=null) 
	{
	    try
	    {
	        return nodelist[0].childNodes[0].nodeValue;
	    }
        catch(eee)
        {
	        return "";
	    }
	}
	return "";
}


function GetXmlNode(doc,tagName,idx)
{
	if(doc == null)
	{
	    return "";
	}
	if(idx==undefined || idx==null)
	{
	    idx=0;
	}
	var nodelist=doc.getElementsByTagName(tagName);
	if(nodelist!=null)
	{
	    try
	    {
	        if(idx>=nodelist[0].childNodes.length)
	        {
	            idx=nodelist[0].childNodes.length-1;
	        }
	        return nodelist[0].childNodes[idx];
	    }
        catch(eee)
        {
	        return null;
	    }
	}
	return null;
}



function GetXmlNodeValue(doc,tagName,idx)
{
    var nodeitem=GetXmlNode(doc,tagName,idx);
	if(nodeitem!=null)
	{
	    try
	    {
	        return nodeitem.nodeValue;
	    }
        catch(eee)
        {
	        return "";
	    }
	}
	return "";
}



function GetXmlNodeAttr(doc,tagName,attr,idx)
{
    var nodeitem=GetXmlNode(doc,tagName,idx);
	if(nodeitem!=null)
	{
	    try
	    {
	        return nodeitem.getAttribute(attr);
	    }
        catch(eee)
        {
	        return "";
	    }
	}
	return "";
}


function isIE()
{
	try
	{
		if ( (!!(window.ActiveXObject)) || ("ActiveXObject" in window) )
		{
			return true;
		}
		else
		{
			return false;
		}
	}catch(eev){}	
	return false;
}


function parseXml(fileRoute)
{
  xmlDoc=null;  
  if(isIE())
  {
      var xmlCom=new Array( "MSXML2.DOMDocument.3.0","MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument", "Microsoft.XMLDOM", "MSXML.DOMDocument"); 
      for(var i=0; i<xmlCom.length; i++)
      {
            try
            {
                for(var idx=0;idx<5;idx++)
                {
                    var xmlDom=new ActiveXObject(xmlCom[i]);           
                    xmlDom.async=false;
                    xmlDom.load(fileRoute);
                    xmlDoc=xmlDom;
                    if(xmlDoc!=null)
                    {
                        break;
                    }
                }
                return xmlDoc;
            }
            catch(eee)
            {
                ShowError(eee);
            }
      }
  }
  else if(document.implementation&&document.implementation.createDocument)
  {
        for(var idx=0;idx<5;idx++)
        {
            var xmlhttp=new window.XMLHttpRequest();
            xmlhttp.open("GET",fileRoute,false);
            xmlhttp.send(null);
            xmlDoc=xmlhttp.responseXML;
            if(xmlDoc!=null)
            {
                break;
            }
        }
  }
  else
  {
        xmlDoc=null;
  }  
  return xmlDoc;
}


function   readxml(nType, nValue)
{ 
    var   oNode = gxmlDoc.selectSingleNode("//class[@id='"+nType+"']/subclass"); 
    var   sText = oNode.getAttribute(nValue); 
    return sText;
} 



function  GetCookie(name)
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) 
    {
        return unescape(arr[2]);
    }
    return "";
}



        
function  DelCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=GetCookie(name);
    if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}



function  SetCookie(name,  value)
{
    var Days = 1; 
    var exp  = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}




function CancleEvent(e)
{
    try
    {
        if(navigator.appName.indexOf("Explorer") > -1)
        { 
            if(event.srcElement.tagName=="INPUT") 
            {
                return true;
            } 
        } 
        else
        {
            if(event.target.tagName=="INPUT" ) 
            { 
                return true;
            } 
        } 
    }
    catch(eee)
    {
        ShowError(eee);
    }
    
    try
    {        
        if ( event && event.preventDefault )
        { 
            event.preventDefault(); 
        }
        else if( e && e.preventDefault )
        {
            e.preventDefault(); 
        }
        else
        {
            window.event.returnValue = false;
        }
    }
    catch(eee)
    {
        ShowError(eee);
    }
    return false;
}


function SelectNothing()
{
    try
    {
        if(navigator.appName.indexOf("Explorer") > -1)
        { 
            if(event.srcElement.tagName=="INPUT") 
            {
                return true;
            } 
        } 
        else
        { 

            if(event.target.tagName=="INPUT" ) 
            { 
                return true;
            } 
        } 
    }
    catch(eee)
    {
        ShowError(eee);
    }
    try
    {
        document.selection.empty();
    }
    catch(eee)
    {
        ShowError(eee);
    }
}




//get ptz port value
function inner__getptzport()
{
    var vvprot = 0;
    try
    {
        var xmlHttpRequest = null; 
        if (window.XMLHttpRequest) 
        {
       
            xmlHttpRequest = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
      
    	    xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }       
        var szPort = window.location.port;
        var szProtocol = window.location.protocol;
        var szHostname = window.location.hostname;
        var dateva=new Date();
        var szUrl = szProtocol+ "//" + szHostname + ":" + szPort + "/cgi-bin/getptzport.cgi?t=" +dateva.getTime();
        xmlHttpRequest.open("GET", szUrl, false); 
        xmlHttpRequest.send(null);
        if(xmlHttpRequest.readyState==4)
	    {
		    if(xmlHttpRequest.status==200)
		    {
			    vvprot = xmlHttpRequest.responseText;
		    }
		    else		    
		    {
                vvprot = 0;
		    }
	    }
   }
   catch(e)
   {
        vvprot = 0;
   }
   return vvprot; 
}


function getptzport()
{
    try
    {
        g_ptz_port = inner__getptzport();
        if(g_ptz_port==0)
        {//读取出错，再读一次
            g_ptz_port=inner__getptzport();
        }
        if(g_ptz_port==0)
        {
            g_ptz_port=inner__getptzport();
        }
    }
    catch(eevv)
    {
        g_ptz_port=defaultptzport;
    }
    return  g_ptz_port;
}



//objid:
//      <object> label id value
//weburl:
//      language file ,eg:/xml/IPCConfig.xml
function  LoadLangToCtrlObj(objid,weburl)
{
    try
    {
        var szPort = window.location.port;
        var szProtocol = window.location.protocol;
        var szHostname = window.location.hostname;
        var szUrl = szProtocol+ "//" + szHostname + ":" + szPort + "/" +weburl+"?v=2.0.2.4";
	    if(szPort=="")
        {
            szUrl = szProtocol+ "//" + szHostname + "/" +weburl+"?v=2.0.2.4";
        }
        var ctrlobj=document.getElementById("objid");
        ctrlobj.LoadLang(szUrl,1);
        return true;
    }
    catch(eevvp)
    {
    
    }
    return false;
}




 

function WriteBody(langtype)
{
    var titletext="高清网络摄像机";
    xmlPath="./xml/Login.xml";
    for(var idx=0;idx<2;idx++)
    {
        g_titleLangDoc = parseXml(xmlPath);
        if(g_titleLangDoc!=null)
        {
            break;
        }
    }
    if (g_titleLangDoc == null)  
    {
        g_titleLangDoc = parseXml(xmlPath);
        if (g_titleLangDoc == null)
        {
            try
            {
                document.title = titletext;
            }
            catch(eee)
            {
                ShowError(eee);
            }
            return false;
        }            
    }
    var lanobjlist=g_titleLangDoc.getElementsByTagName("Resources");
    var lanrescount=0;
    if(lanobjlist!=null)
    {
        lanrescount=lanobjlist.length;// language count 
    } 
    else
    {
        g_titleLangDoc=null;
    }
    if (lanrescount> 0)
    {
        var szOption="";
        for(var i=0; i<lanrescount; i++)
        {
            var vLanguage = lanobjlist[i].getAttribute("lan");
            if(vLanguage.toLowerCase()==langtype)
            {
	            var nodelist=lanobjlist[i].getElementsByTagName("title");
	            if(nodelist!=null) 
	            {
	                try
	                {
	                    var mytitle=nodelist[0].childNodes[0].nodeValue;                
                        if(mytitle!="")
                        {
                            titletext=mytitle;
                        }    
	                }
                    catch(eee)
                    {
	                }
	            }    
	            break;       
            }
        }
    }
    else
    {
        g_titleLangDoc=null;
    }
    try
    {
        document.title = titletext;
    }
    catch(eee)
    {
        ShowError(eee);
    }
    try
    {
        window.title = titletext;
        return true;
    }
    catch(eee)
    {
        ShowError(eee);
    }  
}





//  only for login.html page    
function GetCtrlVersion()
{
    try
    {
        var version=document.getElementById("ctrl_version").value;
        return version;
    }
    catch(eee)
    {
        ShowError(eee);
    }
    return "";
}


var timerforautoloadxml=0;//timer handle 
var checkloadxmlcount=0;//read xml file counter


function CallClickButton(objid)
{
    try
    {         
	setTimeout(function(){var btn = document.getElementById(objid);btn.click();},0);
	return true;  
    }
    catch(eev)
    {
    }
    return false;
}


function SetValue(objid,value)
{
    try
    {
        if(document.getElementById)
        {
            var obj=document.getElementById(objid);
            obj.value= value;
        }
        else
        {
            var objls=document.all[objid];
            if(objls && objls.length!=undefined && objls.length>=0)
            {
                objls[0].value=value;
            }
        }
     }
     catch(eee)
     {
        
     }   
}


// if 
function js_Logon(ocx_id,lan)
{
    g_ptz_port=getptzport();
    if(g_ptz_port<=0)
    {
        g_ptz_port=defaultptzport;
    }
    SetValue("idPTZPort",g_ptz_port);
    SetValue("idPTZPort",g_ptz_port);
    try
    {
        var idcb = document.getElementById("idCallBack");
        idcb.setAttribute("selectlang", lan); 
    }
    catch(eevv)
    {
        
    }
	CallClickButton(ocx_id);
}



//  check auto login 
function CheckAndLogin(objid)
{
    var checkret=checkdata();
    if(checkret!="")
    {
        return false;
    }
    js_Logon('Logon',"");
    return true;
}




// change language 
//
//xmlPath:
//      language file in ipc
// lan:
//      language type, we can find it in  Resources node in attribute lan <Resources lan='zh-cn' name='简体中文'>
//      eg: zh-cn
//flag:
//      if flag=='enent',it will auto change control language
//
function jsChangeLoginLanguage(xmlPath,lan,flag)
{
    try 
    {
        g_szLan = lan;
        SetCookie('language', g_szLan);
        WriteBody(lan);
        for(var idx=0;idx<2;idx++)
        {
            g_lanxXmlDoc = parseXml(xmlPath);
            if(g_lanxXmlDoc!=null)
            {
                break;
            }
        }
        if (g_lanxXmlDoc == null)  
        {
            g_lanxXmlDoc = parseXml(xmlPath);
            if (g_lanxXmlDoc == null)
            {
                return false;
            }            
        }
        var lanobjlist=g_lanxXmlDoc.getElementsByTagName("Resources");
        var lanrescount=0;
        if(lanobjlist!=null)
        {
            lanrescount=lanobjlist.length;// language count 
        }
        
        var vSelectObj = window.parent.document.getElementById('idLanguage');
        vSelectObj.options.length=0;//clear all items
        {   
            if (lanrescount> 0)
            {
                var szOption="";
                for(var i=0; i<lanrescount; i++)
                {
                    var vLanguage = lanobjlist[i].getAttribute("lan");
                    var vName = lanobjlist[i].getAttribute("name"); 
                    var objitem=new Option(vName, vLanguage);
                    vSelectObj.options[vSelectObj.options.length]=objitem;
                }
            }
        }
        if(vSelectObj.options.length<=0)
        {//读取资源文件失败，要重新读一次
            if(timerforautoloadxml!=0)
            {
                window.clearTimeout(timerforautoloadxml);
            }
            checkloadxmlcount++;
            if(checkloadxmlcount<2)
            {//重试5次
                timerforautoloadxml=window.setTimeout(function (){jsChangeLoginLanguage(xmlPath, lan,flag);},1000);
            }
            return true;
        }
        checkloadxmlcount=0;
        timerforautoloadxml=0;
        for (var i=0; i<lanrescount; i++)
        {   
            if (lan==lanobjlist[i].getAttribute("lan"))
            {  
                g_lanxXmlDoc=lanobjlist[i];
                break;
            }
        }
        var vLength = vSelectObj.options.length;
        for (var i=0; i<vSelectObj.options.length; i++)
        {
            if (lan == vSelectObj.options[i].value) 
            {
                vSelectObj.options[i].selected=true;                
                break;
            }
        }
        if(vSelectObj.options.length<=0)
        {
            var error="not find language type";
        }
    }
    catch(eee)
    {
        ShowError(eee);
    }
    try
    {
        TranslateElements(document, "LABEL", "innerHTML");
        TranslateElements(document, "LABEL", "title");
        TranslateElements(document, "td", "innerHTML");
        TranslateElements(document, "input", "value");
        TranslateElements(document, "a", "innerHTML");
        TranslateElements(document, "img", "src");//logo_img
        var s=getNodeValue("title");
        window.parent.document.title = s;
    }
    catch(eee)
    {
        ShowError(eee);
    }    
    if(flag =="event")
    {
        js_Logon('selectchange',lan);
    }
}



function SetDefaultLangName()
{
    var language;     
    language = GetCookie('language');
    if(language==undefined || language==null || language=="")
    {
        try
        {
            if (navigator.appName == "Netscape" || navigator.appName == "Opera")
            {
	            language = navigator.language.toLowerCase();
            }
            else if (navigator.language) 
            {
                language = navigator.language.toLowerCase();;
            }
            else if(navigator.browserLanguage)
            {
                language = navigator.browserLanguage.toLowerCase();;
            }
            else
            {
                language= "en-us";
            }
        }catch(eevv){}
    }
    if (language == "zh-tw")
    {
        g_szLan = "zh-tw";
    }
    else if(language == "zh-cn") 
    {
	    g_szLan = "zh-cn";
    }
    else if(language == "en-us" || language == "en")
    {
        g_szLan = "en-us";
    }
    else if(language == "ru-ru" || language == "ru")
    {
	    g_szLan = "ru-ru";
    }
    else if(language == "tr-tr" || language == "tr")
    {
	    g_szLan = "tr-tr";
    }
    else if(language == "pl-pl" || language == "pl")
    {
	    g_szLan = "pl-pl";
    }
    else
    {
        g_szLan = language;
    }
    SetCookie('language', g_szLan);	
    WriteBody(g_szLan);
    return g_szLan;
}




function InitLoginLanguage(xmlfile,fLoginCallBack)
{
    var language=SetDefaultLangName();    
    try
    {
        g_ptz_port = getptzport();
    }
    catch(eevv)
    {
        g_ptz_port=defaultptzport;
    }
    SetValue("idPTZPort",g_ptz_port);
    SetValue("idUCPort",g_uc_port); 
    jsChangeLoginLanguage(xmlfile,g_szLan);
    var idcb = document.getElementById("idCallBack");
    idcb.setAttribute("scfLogin", fLoginCallBack); 
    idcb.setAttribute("selectlang", g_szLan); 
	CallClickButton("idCallBack");
    return true;
}


function OnLoginChangeLanguage(va,file)
{
    jsChangeLoginLanguage(file, va,'event');   
}




// for player.html

function SendPtzCmd(xml)
{
    SetValue("PtzControl",xml); 
    CallClickButton("PtzControl");
    return true;
}


 
function Obj(o)
{ 
 	return document.getElementById(o)?document.getElementById(o):o; 
} 

function GetXYWH(o)
{ 
	var w3c=(document.getElementById)? true:false; 
	var agt=navigator.userAgent.toLowerCase(); 
	var ie = ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1) && (agt.indexOf("omniweb") == -1)); 
	var ie5=(w3c && ie)? true : false; 
	var ns6=(w3c && (navigator.appName=="Netscape"))? true: false; 
	var op8=(navigator.userAgent.toLowerCase().indexOf("opera")==-1)? false:true;
	var nLt=0; 
	var nTp=0; 
	var offsetParent = o; 
	while (offsetParent!=null && offsetParent!=document.body)
	{ 
		nLt+=offsetParent.offsetLeft; 
		nTp+=offsetParent.offsetTop; 
		if(!ns6)
		{ 
			parseInt(offsetParent.currentStyle.borderLeftWidth)>0?nLt+=parseInt(offsetParent.currentStyle.borderLeftWidth):""; 
			parseInt(offsetParent.currentStyle.borderTopWidth)>0?nTp+=parseInt(offsetParent.currentStyle.borderTopWidth):""; 
		} 
		offsetParent=offsetParent.offsetParent; 
	}
	var obj=new Object();
	obj.left=nLt+2;
	obj.top=nTp+2; 
	return obj;
}

var lastfEventCallBack=null;
var lastDisplayId="";
function DisplayVideo(displayId,nstream,fEventCallBack)
{
    try
    {   
        lastDisplayId=displayId;
        lastfEventCallBack=fEventCallBack;
        var hid = document.getElementById(displayId);
	var ltinfo=GetXYWH(hid);
        var playbnt=document.getElementById("PlayRealVideo");
//      playbnt.setAttribute("pictTop",""+hid.offsetTop);
//      playbnt.setAttribute("pictLeft",""+hid.offsetLeft);
        playbnt.setAttribute("pictLeft",""+ltinfo.left);
        playbnt.setAttribute("pictTop",""+ltinfo.top); 
        playbnt.setAttribute("pictWidth",""+parseInt(hid.offsetWidth)-4);
        playbnt.setAttribute("pictHeight",""+parseInt(hid.offsetHeight)-4);
        playbnt.setAttribute("nStreamType",""+nstream);
        playbnt.setAttribute("scfRealEvent", fEventCallBack); 
        CallClickButton("PlayRealVideo");
    }
    catch(eee)
    {
        ShowError(eee);
    }
}


function OnChangeVideoStream(nstream)
{
    if(lastfEventCallBack!=null && lastDisplayId!="" )
    {
        DisplayVideo(lastDisplayId,nstream,lastfEventCallBack);
        return true;
    }
    return false;
}



function LoadDefaultStreamType()
{
    CallClickButton("InitStreamType");
}









function jsChangePlayerLanguage(xmlPath, lan)
{
    try
    {
        g_szLan = lan;
        SetCookie('language', g_szLan);
        for(var idx=0;idx<10;idx++)
        {
            g_lanxXmlDoc = parseXml(xmlPath);
            if(g_lanxXmlDoc!=null)
            {
                break;
            }
        }
        if (g_lanxXmlDoc==null)
        {
            return ;
        }
        for (var i=0; i<g_lanxXmlDoc.getElementsByTagName("Resources").length; i++)
        {   
            if (lan==g_lanxXmlDoc.getElementsByTagName("Resources")[i].getAttribute("lan"))
            {  
                g_lanxXmlDoc=g_lanxXmlDoc.getElementsByTagName("Resources")[i];                   
                break;
            }
        }
    }
    catch(eee)
    {
        ShowError(eee);
    } 
    TranslateElements(document, "LABEL", "innerHTML");
    TranslateElements(document, "LABEL", "title");
    TranslateElements(document, "td", "innerHTML");
    TranslateElements(document, "span", "innerHTML");
    TranslateElements(document, "option", "innerHTML");
    TranslateElements(document, "li", "title");
    TranslateElements(document, "select", "title");
    TranslateElements(document, "input", "title");
    TranslateElements(document, "div", "title");
    TranslateElements(document, "a", "innerHTML");
    TranslateElements(document, "img", "src");//logo_img
    return true;
}








function InitPlayerLanguage(xmlfile)
{
    g_szLan = SetDefaultLangName();    
    jsChangePlayerLanguage(xmlfile,g_szLan);
}







function DelPtzPreset()
{
    var BtnDelPreset = document.getElementById(ocx_id);
    var SelDelPreset = document.getElementById(option_id);
    BtnDelPreset.value = SelDelPreset.options.value;
    BtnDelPreset.click();
}


function CallPtzPreset(ocx_id, option_id)
{
    var BtnCallPreset = document.getElementById(ocx_id);
    var SelCallPreset = document.getElementById(option_id);
    BtnCallPreset.value = SelCallPreset.options.value;
    BtnCallPreset.click();
}
 
 
 


function OnMouseDW(obj)
{
    obj.style.backgroundPosition="0px -56px";
}
function OnMouseOT(obj)
{
    obj.style.backgroundPosition="0px 0px";
}
function OnMouseOV(obj)
{
    obj.style.backgroundPosition="0px -28px";
}
function OnMouseUUP(obj)
{
    obj.style.backgroundPosition="0px -28px";
}





    
function Base64() 
{    
    // private property   
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";   
    
    // public method for encoding   
    this.encode = function (input) {   
        var output = "";   
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;   
        var i = 0;   
        input = _utf8_encode(input);   
        while (i < input.length) {   
            chr1 = input.charCodeAt(i++);   
            chr2 = input.charCodeAt(i++);   
            chr3 = input.charCodeAt(i++);   
            enc1 = chr1 >> 2;   
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);   
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);   
            enc4 = chr3 & 63;   
            if (isNaN(chr2)) {   
                enc3 = enc4 = 64;   
            } else if (isNaN(chr3)) {   
                enc4 = 64;   
            }   
            output = output +   
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +   
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);   
        }   
        return output;   
    }   
    
    // public method for decoding   
    this.decode = function (input) {   
        var output = "";   
        var chr1, chr2, chr3;   
        var enc1, enc2, enc3, enc4;   
        var i = 0;   
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");   
        while (i < input.length) {   
            enc1 = _keyStr.indexOf(input.charAt(i++));   
            enc2 = _keyStr.indexOf(input.charAt(i++));   
            enc3 = _keyStr.indexOf(input.charAt(i++));   
            enc4 = _keyStr.indexOf(input.charAt(i++));   
            chr1 = (enc1 << 2) | (enc2 >> 4);   
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);   
            chr3 = ((enc3 & 3) << 6) | enc4;   
            output = output + String.fromCharCode(chr1);   
            if (enc3 != 64) {   
                output = output + String.fromCharCode(chr2);   
            }   
            if (enc4 != 64) {   
                output = output + String.fromCharCode(chr3);   
            }   
        }   
        output = _utf8_decode(output);   
        return output;   
    }   
    
    // private method for UTF-8 encoding   
    _utf8_encode = function (string) {   
        string = string.replace(/\r\n/g,"\n");   
        var utftext = "";   
        for (var n = 0; n < string.length; n++) {   
            var c = string.charCodeAt(n);   
            if (c < 128) {   
                utftext += String.fromCharCode(c);   
            } else if((c > 127) && (c < 2048)) {   
                utftext += String.fromCharCode((c >> 6) | 192);   
                utftext += String.fromCharCode((c & 63) | 128);   
            } else {   
                utftext += String.fromCharCode((c >> 12) | 224);   
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);   
                utftext += String.fromCharCode((c & 63) | 128);   
            }   
    
        }   
        return utftext;   
    }   
    
    // private method for UTF-8 decoding   
    _utf8_decode = function (utftext) {   
        var string = "";   
        var i = 0;   
        var c = c1 = c2 = 0;   
        while ( i < utftext.length ) {   
            c = utftext.charCodeAt(i);   
            if (c < 128) {   
                string += String.fromCharCode(c);   
                i++;   
            } else if((c > 191) && (c < 224)) {   
                c2 = utftext.charCodeAt(i+1);   
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));   
                i += 2;   
            } else {   
                c2 = utftext.charCodeAt(i+1);   
                c3 = utftext.charCodeAt(i+2);   
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));   
                i += 3;   
            }   
        }   
        return string;   
    }   
}


function HideItem(idv)
{
    try
    {
        var obj=document.getElementById(idv);
        obj.style.display='none';
    }
    catch(eevv)
    {
    
    }
}

function ShowItem(idv)
{
    try
    {
        var obj=document.getElementById(idv);
        obj.style.display='block';
    }
    catch(eevv)
    {
    
    }
}

function HideItemList(idls)
{
    var ls=idls.split(",");
    var ilen=ls.length;
    if(ilen==1)
    {
        HideItem(idls);        
    }
    else 
    {
        for(var idx=0;idx<ilen;idx++)
        {
            HideItem(ls[idx]);        
        }    
    }
    return true;
}


function ShowItemList(idls)
{
    var ls=idls.split(",");
    var ilen=ls.length;
    if(ilen==1)
    {
        ShowItem(idls);        
    }
    else 
    {
        for(var idx=0;idx<ilen;idx++)
        {
            ShowItem(ls[idx]);        
        }    
    }
    return true;
}


//ptz_onlymove 时，只保留移动功能，去掉其它功能
function HiddenAdvPtzAction(allowadvptz)
{
    try
    {
        if(allowadvptz=="0")
        {
            HideItemList("ptz_adv_actiontalbe,show_ptz_advaction_tbody");
        }
        else
        {
            ShowItemList("ptz_adv_actiontalbe,show_ptz_advaction_tbody");
        }
    }catch(eevv)
    {

    }
    return true;
}



function DisableItem(idv)
{
    try
    {
        var obj=document.getElementById(idv);
	obj.isdisable="yes"; 
	OnMouseOT(obj);
    }
    catch(eevv)
    {
    
    }
}

function EnableItem(idv)
{
    try
    {
        var obj=document.getElementById(idv);
	obj.isdisable="no"; 
	OnMouseOT(obj);
    }
    catch(eevv)
    {
    
    }
}




function OnMouseDW(obj)
{
if(obj.isdisable=="yes")
{
    obj.style.backgroundPosition="0px -28px";
}
else
{
    obj.style.backgroundPosition="0px -56px";
}
}


function OnMouseOT(obj)
{
if(obj.isdisable=="yes")
{
    obj.style.backgroundPosition="0px -28px";
}
else
{
    obj.style.backgroundPosition="0px 0px";
}
}

function OnMouseOV(obj)
{
    obj.style.backgroundPosition="0px -28px";
}
function OnMouseUUP(obj)
{
    obj.style.backgroundPosition="0px -28px";
}




function DisableItemList(idls)
{
    var ls=idls.split(",");
    var ilen=ls.length;
    if(ilen==1)
    {
        DisableItem(idls);        
    }
    else 
    {
        for(var idx=0;idx<ilen;idx++)
        {
            DisableItem(ls[idx]);        
        }    
    }
    return true;
}


function EnableItemList(idls)
{
    var ls=idls.split(",");
    var ilen=ls.length;
    if(ilen==1)
    {
        EnableItem(idls);        
    }
    else 
    {
        for(var idx=0;idx<ilen;idx++)
        {
            EnableItem(ls[idx]);        
        }    
    }
    return true;
}





function OnChangeAbilityInfo(info)
{
	if(info=="")
	{
		return true;
	}
	if(info.replace("ptz_control")==info)
	{
        	HideItemList("ptz_adv_actiontalbe,show_ptz_advaction_tbody,ptz_movetable,preset_tbody_id");
		try{ShowPtzType(false,false);}catch(eevv){}
	}
	else
	{
        	ShowItemList("ptz_movetable,preset_tbody_id");
		HideItemList("preset_tbody_id_onlybuffer");
		if(info.replace("ptz_onlymove")==info)
		{
            		ShowItemList("ptz_adv_actiontalbe,show_ptz_advaction_tbody");
			try{ShowPtzType(true,false);}catch(eevv){}
		}
		else
		{
            		HideItemList("ptz_adv_actiontalbe,show_ptz_advaction_tbody"); 
			try{ShowPtzType(true,true);}catch(eevv){}
		}
	}	
	if(info.replace("front_replay")==info)
	{
		HideItemList("playbackli_id");
	}
	else
	{//要显示的话，不能按此条件进行判断
		//ShowItemList("playbackli_id");
	}	
	if(info.replace("audio_support")==info)
	{
		HideItemList("Talkback");
	}
	else
	{
		ShowItemList("Talkback");
	}
}


function OnChangeStoreDevice(ntype)
{
	if(ntype=="1" || ntype==1)
	{
		ShowItemList("playbackli_id");
	}
	else
	{
		HideItemList("playbackli_id");
	}
}



function addEvent(obj, name, func)
{
	try
	{
		if (obj.attachEvent)
		{
			obj.attachEvent(name, func);
		}
		else
		{
			obj.addEventListener(name, func, false); 
		}
	}catch(eev){}
}

function removeEvent(obj, name, func)
{
	try
	{
		if (obj.detachEvent)
		{
			obj.detachEvent(name, func);
		}
		else
		{
			obj.removeEventListener(name, func, false); 
		}
	}catch(eev){}
}


function GetViewType()
{
	var type="win32";
	var bswname="microsoft internet explorer";
	top.g_isIe11Viewer=g_isIe11Viewer=false;
	var isIEbroView=isIE();
	if(bswname.replace("internet exp","")!=bswname || isIEbroView)
	{

		try
		{
			var verinfo=""+navigator.userAgent;
			if(verinfo.replace("rv:11.0","")!=verinfo)
			{
				top.g_isIe11Viewer=g_isIe11Viewer=true;
			}
			top.g_isIe11Viewer=g_isIe11Viewer=true;// 所有IE都采用新方案处理  
		}
		catch(eevv){}
	}
	return true;
}



function WriteObjectScript()
{
	var type="win32";
	var bswname="microsoft internet explorer";
	try
	{
	    type=window.navigator.platform.toLowerCase();
	    bswname=window.navigator.appName.toLowerCase();
	}catch(eevv){} 
	GetViewType();
	var isIEbroView=isIE();
	if(bswname.replace("internet exp","")!=bswname || isIEbroView)
	{
	    if(type=="win32")
	    {
	        document.write('<OBJECT ID="IPCConfigCtrl"  codebase="http://update.seetong.com/files/ocx/ipc/h265/IPCConfig.exe"     CLASSID="CLSID:F0C2A265-C11A-4B67-84ED-D62E95008822" width="1008px" height="680px" ></OBJECT>');
	    }
	    else if(type=="win64")
	    {
	        document.write('<OBJECT ID="IPCConfigCtrl"     codebase="http://update.seetong.com/files/ocx/ipc/h265/IPCConfig.exe"       CLASSID="CLSID:A6C74265-97EB-447D-8D82-E66DD76F9788" width="1008px" height="680px" ></OBJECT>');                                                
	    }
	    else
	    {
	        document.write('<OBJECT ID="IPCConfigCtrl"  codebase="http://update.seetong.com/files/ocx/ipc/h265/IPCConfig.exe"     CLASSID="CLSID:F0C2A265-C11A-4B67-84ED-D62E95008822" width="1008px" height="680px" ></OBJECT>');
	    }
	}
	else
	{			
		document.write('<object id="IPCConfigCtrl" codebase="http://update.seetong.com/files/ocx/ipc/h265/IPCConfig.exe" type="application/x-ipcctrlh265" width="1008px" height="680px"><embed type="application/x-ipcctrlh265" width="1008px" height="680px" pluginspage="IPCConfig.exe"></embed></object>');
	} 
}


function GetDefaultInstallLangTip()
{
    var msgInfo = "Please install the plug!";
    try
    {
        var  language=SetDefaultLangName();
        if (language=="zh-cn")
        {
            msgInfo = "请先安装插件！";
        }
        else if(language=="zh-tw")
        {
            msgInfo = "請先安裝插件!";
        }
        else if(language == "en-us" || language == "en")
        {
            msgInfo = "Please install the plug!"
        }
        else
        {
            msgInfo = "Please install the plug!";
        }
    }catch(eevv){}
    return msgInfo;
}


function DoIpcCtrlDefEvent(data,nType,nSubType)
{
	try
	{
	    if(nType==10 && nSubType==10)
	    {//change title info
	        var langtype=data;
	        WriteBody(langtype);
	    }
	}
	catch(eevv)
	{
    
	}

	try
	{
	    if(nType==0 && nSubType==0)
	    {//redirect page 
	        var newurl=data;
	        try
	        {
	            if(window && window.location)
	            {
	                window.location=newurl;
	                return true;
	            }
	            else if(document && document.location)
	            {
	                window.location=newurl;
	                return true;
	            }                
	        }
	        catch(eevv)
	        {
            
	        }
	    }
	    else if(nType==0 && nSubType==1)
	    {//redirect to login page
	           try
	           {
	                //document.body.style.backgroundImage="";
	                //document.body.style.backgroundColor="#99d86c";
	    	   }
	    	   catch(eevv){}
	    }
	    else if(nType==0 && nSubType==2)
	    {//redirect to play page
	           try
	           {
	                //document.body.style.backgroundColor="#2c2d2f";
	                //document.body.style.backgroundImage="url(images/bg.png)";
	    	   }
	    	   catch(eevv){}
	    }
	}
	catch(eev)
	{
	    var errormsg="redirect error";
	}
	return true;
}



function ShowPtzType(hvaeptz,onlymove)
{
	return true;
	var ptztbody=document.getElementById("ptzbg_ctrl");
	var objplaymidarea=document.getElementById("IDPlayPict");
	var allptzbd=document.getElementById("all_ptzAction_tbody");
	if(hvaeptz)
	{
		if(onlymove)
		{
			ptztbody.style.backgroundImage="url(images/onlymove_ptzbg.jpg)";
		}			
		ptztbody.style.width="250px";
		allptzbd.style.display="block";
		objplaymidarea.style.width="750px";
	}
	else
	{
		ptztbody.style.width="55px";
		ptztbody.style.backgroundImage="";
		allptzbd.style.display="none";
		objplaymidarea.style.width="940px";
	}
} 
	
	
	
	
function  DoDefPlayerPageCallBackAction(nCode)
{
	nCode=parseInt(""+nCode);
	switch(nCode)
	{
	case 42:
	    {//start record 
	        g_RecordFlash=1;
	    }
	    break;
	case 43://record error
	case 44://record finish
	    {//stop record or record error
	        g_RecordFlash=0;
	        var varRecord = document.getElementById("RealRecord");
	        varRecord.setAttribute("bgimagewidth", 47);
	        varRecord.setAttribute("curbgimage", 0);
	        OnMouseOV(varRecord);
	        OnMouseOT(varRecord);
	    }
	    break;
	case 6:
	    {//start talk ok
	         g_TalkbackFlash = 1;
	    }
	    break;
	case 8:
	    {// stop talk  
	        g_TalkbackFlash = 0;
	        var varTalkback = document.getElementById("Talkback");
	        varTalkback.setAttribute("bgimagewidth", 47);
	        varTalkback.setAttribute("curbgimage", 0);
	        OnMouseOV(varTalkback);
	        OnMouseOT(varTalkback);
	    }
	    break;
	case 24:
	    {// start play video 
	        var varRealVideo = document.getElementById("PlayRealVideo");            
	        varRealVideo.setAttribute("bgimagewidth", 92);
	        varRealVideo.setAttribute("curbgimage", 92);
	        OnMouseOV(varRealVideo);
	        OnMouseOT(varRealVideo);
	     }
	     break;
	case 28:
	    {// stop play video 
	        var varRealVideo = document.getElementById("PlayRealVideo");
	        varRealVideo.setAttribute("bgimagewidth", 47);
	        varRealVideo.setAttribute("curbgimage", 0);
	        OnMouseOV(varRealVideo);
	        OnMouseOT(varRealVideo);
	    }
	    break;
	case 10001:
	    {// 手工停止视频流  
	        var varRealVideo = document.getElementById("PlayRealVideo");
	        varRealVideo.setAttribute("bgimagewidth", 47);
	        varRealVideo.setAttribute("curbgimage", 0);
	        OnMouseOV(varRealVideo);
	        OnMouseOT(varRealVideo);
	        g_TalkbackFlash = 0;
	        var varTalkback = document.getElementById("Talkback");
	        varTalkback.setAttribute("bgimagewidth", 47);
	        varTalkback.setAttribute("curbgimage", 0);
	        OnMouseOV(varTalkback);
	        OnMouseOT(varTalkback);
	        g_RecordFlash=0;
	        var varRecord = document.getElementById("RealRecord");
	        varRecord.setAttribute("bgimagewidth", 47);
	        varRecord.setAttribute("curbgimage", 0);
	        OnMouseOV(varRecord);
	        OnMouseOT(varRecord);
	    }
	    break;
	}
}


function OnStateChange()
{
	try
	{
         if (g_RecordFlash)
         {
            var varRecord = document.getElementById("RealRecord");
            var bgimagew = varRecord.getAttribute("bgimagewidth");
            if (bgimagew == 47)
            {
                varRecord.setAttribute("bgimagewidth", 92);
            }
            else
            {
                varRecord.setAttribute("bgimagewidth", 47);
            }
            var height=varRecord.getAttribute("bgimagewidth");
            varRecord.style.backgroundPosition="0px -"+height+"px";
         }
         
         if (g_TalkbackFlash)
         {
            var varTalkback = document.getElementById("Talkback");
            var bgimagew = varTalkback.getAttribute("bgimagewidth");
            if (bgimagew == 47)
            {
                varTalkback.setAttribute("bgimagewidth", 92);
            }
            else
            {
                varTalkback.setAttribute("bgimagewidth", 47);
            }
            var height=varTalkback.getAttribute("bgimagewidth");
            varTalkback.style.backgroundPosition="0px -"+height+"px";
         }
	 }catch(eevv){}
}
    
		
function SelectValue(obj) 
{
	for(var i=0; i<obj.length; i++)
	{
	   if (obj.options[i].selected == true)
	   { 
	        obj.text = obj.options[i].text;
	        break;
	   }
	}
}
    
    
    
function CheckSpeed(obj, vaMin, vaMax)
{       
	if (isNaN(obj.value))
	{
           
	        if (obj.id == "PresetEdit")
	        {
	            alert(getNodeValue("PlayerTips4"));
	        }
	        else   if (obj.id=="TSpeed" || obj.id=="PSpeed")
	        {
	          alert(getNodeValue("PlayerTips2"));
	        }
	      obj.setAttribute("value", "");
	      obj.focus();
	      return false;
	}
        
	if (obj.value<vaMin || obj.value>vaMax)
	{   
	        if (obj.id == "PresetEdit")
	        {
	           alert(getNodeValue("PlayerTips3")+"["+vaMin+"-"+vaMax+"]");
	        }
	        else   if (obj.id=="TSpeed" || obj.id=="PSpeed")
	        {
	            alert(getNodeValue("PlayerTips1")+"["+vaMin+"-"+vaMax+"]");
	        }
           
	    obj.setAttribute("value", "5");
	    obj.focus();
	    return false;
	}
	return true;
}
	
	
	
	
function SendCmdWithSpeed(obj)
{
    var tspeed = document.getElementById("TSpeed");
    var pspeed = document.getElementById("PSpeed");
    var psp="5";
    var tsp="5";
    try
    {
         psp=pspeed.text;
         tsp=tspeed.text;
    }catch(eevv){}
    var cmddata="<xml><cmd>"+obj.id+"</cmd><panspeed>"+psp+"</panspeed><tiltspeed>"+tsp+"</tiltspeed></xml>";
    SendPtzCmd(cmddata);
}
    
function SendCmdWithnoSpeed(obj)
{
    var cmddata="<xml><cmd>"+obj.id+"</cmd></xml>";
    SendPtzCmd(cmddata);
}
    
function SendCmdByNameWithnoSpeed(cmdname)
{
    var cmddata="<xml><cmd>"+cmdname+"</cmd></xml>";
    SendPtzCmd(cmddata);
}
     
function OnIrisOpenAutoOff(obj) 
{
    SendCmdByNameWithnoSpeed("IrisOpenAutoOff");
}
    
            
function OnIrisCloseAutoOff(obj) 
{
    SendCmdByNameWithnoSpeed("IrisCloseAutoOff");
}
    
function OnFocusFarAutoOff(obj)
{
    SendCmdByNameWithnoSpeed("FocusFarAutoOff");
}
    
function OnFocusNearAutoOff(obj)
{
    SendCmdByNameWithnoSpeed("FocusNearAutoOff");
}
    
function OnPtzControl(obj)
{
    SendCmdWithSpeed(obj);
}
   
function OnPtzStop()
{
    var cmddata="<xml><cmd>stop</cmd></xml>";
    SendPtzCmd(cmddata);
}
    
    
