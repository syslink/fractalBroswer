(window.webpackJsonp=window.webpackJsonp||[]).push([[97],{1096:function(e,t,T){var n;(n=function(e){"use strict";function t(e){for(var t={},T=e.split(" "),n=0;n<T.length;++n)t[T[n]]=!0;return t}e.defineMode("ttcn-cfg",function(e,t){var T=e.indentUnit,n=t.keywords||{},E=t.fileNCtrlMaskOptions||{},C=t.externalCommands||{},i=t.multiLineStrings,N=!1!==t.indentStatements,r=/[\|]/,o;function I(e,t){var T=e.next();if('"'==T||"'"==T)return t.tokenize=_(T),t.tokenize(e,t);if(/[:=]/.test(T))return o=T,"punctuation";if("#"==T)return e.skipToEnd(),"comment";if(/\d/.test(T))return e.eatWhile(/[\w\.]/),"number";if(r.test(T))return e.eatWhile(r),"operator";if("["==T)return e.eatWhile(/[\w_\]]/),"number sectionTitle";e.eatWhile(/[\w\$_]/);var i=e.current();return n.propertyIsEnumerable(i)?"keyword":E.propertyIsEnumerable(i)?"negative fileNCtrlMaskOptions":C.propertyIsEnumerable(i)?"negative externalCommands":"variable"}function _(e){return function(t,T){for(var n=!1,E,C=!1;null!=(E=t.next());){if(E==e&&!n){var N=t.peek();N&&("b"!=(N=N.toLowerCase())&&"h"!=N&&"o"!=N||t.next()),C=!0;break}n=!n&&"\\"==E}return(C||!n&&!i)&&(T.tokenize=null),"string"}}function A(e,t,T,n,E){this.indented=e,this.column=t,this.type=T,this.align=n,this.prev=E}function U(e,t,T){var n=e.indented;return e.context&&"statement"==e.context.type&&(n=e.context.indented),e.context=new A(n,t,T,null,e.context)}function O(e){var t=e.context.type;return")"!=t&&"]"!=t&&"}"!=t||(e.indented=e.context.indented),e.context=e.context.prev}return{startState:function(e){return{tokenize:null,context:new A((e||0)-T,0,"top",!1),indented:0,startOfLine:!0}},token:function(e,t){var T=t.context;if(e.sol()&&(null==T.align&&(T.align=!1),t.indented=e.indentation(),t.startOfLine=!0),e.eatSpace())return null;o=null;var n=(t.tokenize||I)(e,t);if("comment"==n)return n;if(null==T.align&&(T.align=!0),";"!=o&&":"!=o&&","!=o||"statement"!=T.type)if("{"==o)U(t,e.column(),"}");else if("["==o)U(t,e.column(),"]");else if("("==o)U(t,e.column(),")");else if("}"==o){for(;"statement"==T.type;)T=O(t);for("}"==T.type&&(T=O(t));"statement"==T.type;)T=O(t)}else o==T.type?O(t):N&&(("}"==T.type||"top"==T.type)&&";"!=o||"statement"==T.type&&"newstatement"==o)&&U(t,e.column(),"statement");else O(t);return t.startOfLine=!1,n},electricChars:"{}",lineComment:"#",fold:"brace"}}),e.defineMIME("text/x-ttcn-cfg",{name:"ttcn-cfg",keywords:t("Yes No LogFile FileMask ConsoleMask AppendFile TimeStampFormat LogEventTypes SourceInfoFormat LogEntityName LogSourceInfo DiskFullAction LogFileNumber LogFileSize MatchingHints Detailed Compact SubCategories Stack Single None Seconds DateTime Time Stop Error Retry Delete TCPPort KillTimer NumHCs UnixSocketsEnabled LocalAddress"),fileNCtrlMaskOptions:t("TTCN_EXECUTOR TTCN_ERROR TTCN_WARNING TTCN_PORTEVENT TTCN_TIMEROP TTCN_VERDICTOP TTCN_DEFAULTOP TTCN_TESTCASE TTCN_ACTION TTCN_USER TTCN_FUNCTION TTCN_STATISTICS TTCN_PARALLEL TTCN_MATCHING TTCN_DEBUG EXECUTOR ERROR WARNING PORTEVENT TIMEROP VERDICTOP DEFAULTOP TESTCASE ACTION USER FUNCTION STATISTICS PARALLEL MATCHING DEBUG LOG_ALL LOG_NOTHING ACTION_UNQUALIFIED DEBUG_ENCDEC DEBUG_TESTPORT DEBUG_UNQUALIFIED DEFAULTOP_ACTIVATE DEFAULTOP_DEACTIVATE DEFAULTOP_EXIT DEFAULTOP_UNQUALIFIED ERROR_UNQUALIFIED EXECUTOR_COMPONENT EXECUTOR_CONFIGDATA EXECUTOR_EXTCOMMAND EXECUTOR_LOGOPTIONS EXECUTOR_RUNTIME EXECUTOR_UNQUALIFIED FUNCTION_RND FUNCTION_UNQUALIFIED MATCHING_DONE MATCHING_MCSUCCESS MATCHING_MCUNSUCC MATCHING_MMSUCCESS MATCHING_MMUNSUCC MATCHING_PCSUCCESS MATCHING_PCUNSUCC MATCHING_PMSUCCESS MATCHING_PMUNSUCC MATCHING_PROBLEM MATCHING_TIMEOUT MATCHING_UNQUALIFIED PARALLEL_PORTCONN PARALLEL_PORTMAP PARALLEL_PTC PARALLEL_UNQUALIFIED PORTEVENT_DUALRECV PORTEVENT_DUALSEND PORTEVENT_MCRECV PORTEVENT_MCSEND PORTEVENT_MMRECV PORTEVENT_MMSEND PORTEVENT_MQUEUE PORTEVENT_PCIN PORTEVENT_PCOUT PORTEVENT_PMIN PORTEVENT_PMOUT PORTEVENT_PQUEUE PORTEVENT_STATE PORTEVENT_UNQUALIFIED STATISTICS_UNQUALIFIED STATISTICS_VERDICT TESTCASE_FINISH TESTCASE_START TESTCASE_UNQUALIFIED TIMEROP_GUARD TIMEROP_READ TIMEROP_START TIMEROP_STOP TIMEROP_TIMEOUT TIMEROP_UNQUALIFIED USER_UNQUALIFIED VERDICTOP_FINAL VERDICTOP_GETVERDICT VERDICTOP_SETVERDICT VERDICTOP_UNQUALIFIED WARNING_UNQUALIFIED"),externalCommands:t("BeginControlPart EndControlPart BeginTestCase EndTestCase"),multiLineStrings:!0})})(T(74))}}]);