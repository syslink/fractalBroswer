(window.webpackJsonp=window.webpackJsonp||[]).push([[53],{1067:function(e,n,r){var t;(t=function(e){"use strict";var n=["From","Sender","Reply-To","To","Cc","Bcc","Message-ID","In-Reply-To","References","Resent-From","Resent-Sender","Resent-To","Resent-Cc","Resent-Bcc","Resent-Message-ID","Return-Path","Received"],r=["Date","Subject","Comments","Keywords","Resent-Date"];e.registerHelper("hintWords","mbox",n.concat(r));var t=/^[ \t]/,a=/^From /,i=new RegExp("^("+n.join("|")+"): "),o=new RegExp("^("+r.join("|")+"): "),d=/^[^:]+:/,s=/^[^ ]+@[^ ]+/,c=/^.*?(?=[^ ]+?@[^ ]+)/,m=/^<.*?>/,u=/^.*?(?=<.*>)/;function l(e){return"Subject"===e?"header":"string"}function p(e,n){if(e.sol()){if(n.inSeparator=!1,n.inHeader&&e.match(t))return null;if(n.inHeader=!1,n.header=null,e.match(a))return n.inHeaders=!0,n.inSeparator=!0,"atom";var r,p=!1;return(r=e.match(o))||(p=!0)&&(r=e.match(i))?(n.inHeaders=!0,n.inHeader=!0,n.emailPermitted=p,n.header=r[1],"atom"):n.inHeaders&&(r=e.match(d))?(n.inHeader=!0,n.emailPermitted=!0,n.header=r[1],"atom"):(n.inHeaders=!1,e.skipToEnd(),null)}if(n.inSeparator)return e.match(s)?"link":e.match(c)?"atom":(e.skipToEnd(),"atom");if(n.inHeader){var f=l(n.header);if(n.emailPermitted){if(e.match(m))return f+" link";if(e.match(u))return f}return e.skipToEnd(),f}return e.skipToEnd(),null}e.defineMode("mbox",function(){return{startState:function(){return{inSeparator:!1,inHeader:!1,emailPermitted:!1,header:null,inHeaders:!1}},token:p,blankLine:function(e){e.inHeaders=e.inSeparator=e.inHeader=!1}}}),e.defineMIME("application/mbox","mbox")})(r(75))}}]);