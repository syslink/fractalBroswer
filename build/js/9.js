(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{835:function(e,t,n){var r;(r=function(e){"use strict";function t(e){for(var t={},n=e.split(" "),r=0;r<n.length;++r)t[n[r]]=!0;return t}e.defineMode("asn.1",function(e,t){var n=e.indentUnit,r=t.keywords||{},i=t.cmipVerbs||{},E=t.compareTypes||{},a=t.status||{},s=t.tags||{},o=t.storage||{},I=t.modifier||{},T=t.accessTypes||{},u=t.multiLineStrings,S=!1!==t.indentStatements,l=/[\|\^]/,c;function A(e,t){var n=e.next();if('"'==n||"'"==n)return t.tokenize=p(n),t.tokenize(e,t);if(/[\[\]\(\){}:=,;]/.test(n))return c=n,"punctuation";if("-"==n&&e.eat("-"))return e.skipToEnd(),"comment";if(/\d/.test(n))return e.eatWhile(/[\w\.]/),"number";if(l.test(n))return e.eatWhile(l),"operator";e.eatWhile(/[\w\-]/);var u=e.current();return r.propertyIsEnumerable(u)?"keyword":i.propertyIsEnumerable(u)?"variable cmipVerbs":E.propertyIsEnumerable(u)?"atom compareTypes":a.propertyIsEnumerable(u)?"comment status":s.propertyIsEnumerable(u)?"variable-3 tags":o.propertyIsEnumerable(u)?"builtin storage":I.propertyIsEnumerable(u)?"string-2 modifier":T.propertyIsEnumerable(u)?"atom accessTypes":"variable"}function p(e){return function(t,n){for(var r=!1,i,E=!1;null!=(i=t.next());){if(i==e&&!r){var a=t.peek();a&&("b"!=(a=a.toLowerCase())&&"h"!=a&&"o"!=a||t.next()),E=!0;break}r=!r&&"\\"==i}return(E||!r&&!u)&&(n.tokenize=null),"string"}}function N(e,t,n,r,i){this.indented=e,this.column=t,this.type=n,this.align=r,this.prev=i}function O(e,t,n){var r=e.indented;return e.context&&"statement"==e.context.type&&(r=e.context.indented),e.context=new N(r,t,n,null,e.context)}function m(e){var t=e.context.type;return")"!=t&&"]"!=t&&"}"!=t||(e.indented=e.context.indented),e.context=e.context.prev}return{startState:function(e){return{tokenize:null,context:new N((e||0)-n,0,"top",!1),indented:0,startOfLine:!0}},token:function(e,t){var n=t.context;if(e.sol()&&(null==n.align&&(n.align=!1),t.indented=e.indentation(),t.startOfLine=!0),e.eatSpace())return null;c=null;var r=(t.tokenize||A)(e,t);if("comment"==r)return r;if(null==n.align&&(n.align=!0),";"!=c&&":"!=c&&","!=c||"statement"!=n.type)if("{"==c)O(t,e.column(),"}");else if("["==c)O(t,e.column(),"]");else if("("==c)O(t,e.column(),")");else if("}"==c){for(;"statement"==n.type;)n=m(t);for("}"==n.type&&(n=m(t));"statement"==n.type;)n=m(t)}else c==n.type?m(t):S&&(("}"==n.type||"top"==n.type)&&";"!=c||"statement"==n.type&&"newstatement"==c)&&O(t,e.column(),"statement");else m(t);return t.startOfLine=!1,r},electricChars:"{}",lineComment:"--",fold:"brace"}}),e.defineMIME("text/x-ttcn-asn",{name:"asn.1",keywords:t("DEFINITIONS OBJECTS IF DERIVED INFORMATION ACTION REPLY ANY NAMED CHARACTERIZED BEHAVIOUR REGISTERED WITH AS IDENTIFIED CONSTRAINED BY PRESENT BEGIN IMPORTS FROM UNITS SYNTAX MIN-ACCESS MAX-ACCESS MINACCESS MAXACCESS REVISION STATUS DESCRIPTION SEQUENCE SET COMPONENTS OF CHOICE DistinguishedName ENUMERATED SIZE MODULE END INDEX AUGMENTS EXTENSIBILITY IMPLIED EXPORTS"),cmipVerbs:t("ACTIONS ADD GET NOTIFICATIONS REPLACE REMOVE"),compareTypes:t("OPTIONAL DEFAULT MANAGED MODULE-TYPE MODULE_IDENTITY MODULE-COMPLIANCE OBJECT-TYPE OBJECT-IDENTITY OBJECT-COMPLIANCE MODE CONFIRMED CONDITIONAL SUBORDINATE SUPERIOR CLASS TRUE FALSE NULL TEXTUAL-CONVENTION"),status:t("current deprecated mandatory obsolete"),tags:t("APPLICATION AUTOMATIC EXPLICIT IMPLICIT PRIVATE TAGS UNIVERSAL"),storage:t("BOOLEAN INTEGER OBJECT IDENTIFIER BIT OCTET STRING UTCTime InterfaceIndex IANAifType CMIP-Attribute REAL PACKAGE PACKAGES IpAddress PhysAddress NetworkAddress BITS BMPString TimeStamp TimeTicks TruthValue RowStatus DisplayString GeneralString GraphicString IA5String NumericString PrintableString SnmpAdminAtring TeletexString UTF8String VideotexString VisibleString StringStore ISO646String T61String UniversalString Unsigned32 Integer32 Gauge Gauge32 Counter Counter32 Counter64"),modifier:t("ATTRIBUTE ATTRIBUTES MANDATORY-GROUP MANDATORY-GROUPS GROUP GROUPS ELEMENTS EQUALITY ORDERING SUBSTRINGS DEFINED"),accessTypes:t("not-accessible accessible-for-notify read-only read-create read-write"),multiLineStrings:!0})})(n(67))}}]);