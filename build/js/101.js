(window.webpackJsonp=window.webpackJsonp||[]).push([[101],{1100:function(e,t,n){var r;(r=function(e){"use strict";e.defineMode("vbscript",function(e,t){var n="error";function r(e){return new RegExp("^(("+e.join(")|(")+"))\\b","i")}var a=new RegExp("^[\\+\\-\\*/&\\\\\\^<>=]"),i=new RegExp("^((<>)|(<=)|(>=))"),o=new RegExp("^[\\.,]"),c=new RegExp("^[\\(\\)]"),s=new RegExp("^[A-Za-z][_A-Za-z0-9]*"),b=["class","sub","select","while","if","function","property","with","for"],l=["else","elseif","case"],u=["next","loop","wend"],v=r(["and","or","not","xor","is","mod","eqv","imp"]),d=["dim","redim","then","until","randomize","byval","byref","new","property","exit","in","const","private","public","get","set","let","stop","on error resume next","on error goto 0","option explicit","call","me"],m=["true","false","nothing","empty","null"],p=["abs","array","asc","atn","cbool","cbyte","ccur","cdate","cdbl","chr","cint","clng","cos","csng","cstr","date","dateadd","datediff","datepart","dateserial","datevalue","day","escape","eval","execute","exp","filter","formatcurrency","formatdatetime","formatnumber","formatpercent","getlocale","getobject","getref","hex","hour","inputbox","instr","instrrev","int","fix","isarray","isdate","isempty","isnull","isnumeric","isobject","join","lbound","lcase","left","len","loadpicture","log","ltrim","rtrim","trim","maths","mid","minute","month","monthname","msgbox","now","oct","replace","rgb","right","rnd","round","scriptengine","scriptenginebuildversion","scriptenginemajorversion","scriptengineminorversion","second","setlocale","sgn","sin","space","split","sqr","strcomp","string","strreverse","tan","time","timer","timeserial","timevalue","typename","ubound","ucase","unescape","vartype","weekday","weekdayname","year"],f=["vbBlack","vbRed","vbGreen","vbYellow","vbBlue","vbMagenta","vbCyan","vbWhite","vbBinaryCompare","vbTextCompare","vbSunday","vbMonday","vbTuesday","vbWednesday","vbThursday","vbFriday","vbSaturday","vbUseSystemDayOfWeek","vbFirstJan1","vbFirstFourDays","vbFirstFullWeek","vbGeneralDate","vbLongDate","vbShortDate","vbLongTime","vbShortTime","vbObjectError","vbOKOnly","vbOKCancel","vbAbortRetryIgnore","vbYesNoCancel","vbYesNo","vbRetryCancel","vbCritical","vbQuestion","vbExclamation","vbInformation","vbDefaultButton1","vbDefaultButton2","vbDefaultButton3","vbDefaultButton4","vbApplicationModal","vbSystemModal","vbOK","vbCancel","vbAbort","vbRetry","vbIgnore","vbYes","vbNo","vbCr","VbCrLf","vbFormFeed","vbLf","vbNewLine","vbNullChar","vbNullString","vbTab","vbVerticalTab","vbUseDefault","vbTrue","vbFalse","vbEmpty","vbNull","vbInteger","vbLong","vbSingle","vbDouble","vbCurrency","vbDate","vbString","vbObject","vbError","vbBoolean","vbVariant","vbDataObject","vbDecimal","vbByte","vbArray"],h=["WScript","err","debug","RegExp"],y,g,w=["server","response","request","session","application"],x=["buffer","cachecontrol","charset","contenttype","expires","expiresabsolute","isclientconnected","pics","status","clientcertificate","cookies","form","querystring","servervariables","totalbytes","contents","staticobjects","codepage","lcid","sessionid","timeout","scripttimeout"],k=["addheader","appendtolog","binarywrite","end","flush","redirect","binaryread","remove","removeall","lock","unlock","abandon","getlasterror","htmlencode","mappath","transfer","urlencode"],I=["clear","execute","raise","replace","test","write","writeline","close","open","state","eof","update","addnew","end","createobject","quit"].concat(["description","firstindex","global","helpcontext","helpfile","ignorecase","length","number","pattern","source","value","count"]);h=h.concat(f),e.isASP&&(h=h.concat(w),I=I.concat(k,x));var C=r(d),L=r(m),E=r(p),D=r(h),S=r(I),T='"',O=r(b),z=r(l),F=r(u),R=r(["end"]),j=r(["do"]),B=r(["on error resume next","exit"]),A=r(["rem"]),M;function N(e,t){t.currentIndent++}function W(e,t){t.currentIndent--}function q(e,t){if(e.eatSpace())return"space";var r;if("'"===e.peek())return e.skipToEnd(),"comment";if(e.match(A))return e.skipToEnd(),"comment";if(e.match(/^((&H)|(&O))?[0-9\.]/i,!1)&&!e.match(/^((&H)|(&O))?[0-9\.]+[a-z_]/i,!1)){var b=!1;if(e.match(/^\d*\.\d+/i)?b=!0:e.match(/^\d+\.\d*/)?b=!0:e.match(/^\.\d+/)&&(b=!0),b)return e.eat(/J/i),"number";var l=!1;if(e.match(/^&H[0-9a-f]+/i)?l=!0:e.match(/^&O[0-7]+/i)?l=!0:e.match(/^[1-9]\d*F?/)?(e.eat(/J/i),l=!0):e.match(/^0(?![\dx])/i)&&(l=!0),l)return e.eat(/L/i),"number"}return e.match(T)?(t.tokenize=J(e.current()),t.tokenize(e,t)):e.match(i)||e.match(a)||e.match(v)?"operator":e.match(o)?null:e.match(c)?"bracket":e.match(B)?(t.doInCurrentLine=!0,"keyword"):e.match(j)?(N(e,t),t.doInCurrentLine=!0,"keyword"):e.match(O)?(t.doInCurrentLine?t.doInCurrentLine=!1:N(e,t),"keyword"):e.match(z)?"keyword":e.match(R)?(W(e,t),W(e,t),"keyword"):e.match(F)?(t.doInCurrentLine?t.doInCurrentLine=!1:W(e,t),"keyword"):e.match(C)?"keyword":e.match(L)?"atom":e.match(S)?"variable-2":e.match(E)?"builtin":e.match(D)?"variable-2":e.match(s)?"variable":(e.next(),n)}function J(e){var r=1==e.length,a="string";return function(a,i){for(;!a.eol();){if(a.eatWhile(/[^'"]/),a.match(e))return i.tokenize=q,"string";a.eat(/['"]/)}if(r){if(t.singleLineStringErrors)return n;i.tokenize=q}return"string"}}function K(e,t){var r=t.tokenize(e,t),a=e.current();return"."===a?(r=t.tokenize(e,t),a=e.current(),!r||"variable"!==r.substr(0,8)&&"builtin"!==r&&"keyword"!==r?n:("builtin"!==r&&"keyword"!==r||(r="variable"),I.indexOf(a.substr(1))>-1&&(r="variable-2"),r)):r}return{electricChars:"dDpPtTfFeE ",startState:function(){return{tokenize:q,lastToken:null,currentIndent:0,nextLineIndent:0,doInCurrentLine:!1,ignoreKeyword:!1}},token:function(e,t){e.sol()&&(t.currentIndent+=t.nextLineIndent,t.nextLineIndent=0,t.doInCurrentLine=0);var n=K(e,t);return t.lastToken={style:n,content:e.current()},"space"===n&&(n=null),n},indent:function(t,n){var r=n.replace(/^\s+|\s+$/g,"");return r.match(F)||r.match(R)||r.match(z)?e.indentUnit*(t.currentIndent-1):t.currentIndent<0?0:t.currentIndent*e.indentUnit}}}),e.defineMIME("text/vbscript","vbscript")})(n(74))}}]);