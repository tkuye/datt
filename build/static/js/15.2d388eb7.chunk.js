(this.webpackJsonpdatt=this.webpackJsonpdatt||[]).push([[15],{305:function(t,n,e){"use strict";e.r(n);var i=e(8),s=e(1),c=e(9),u=e(74),a=e(75),r=e(0);n.default=function(){var t=Object(s.useState)(""),n=Object(i.a)(t,2),e=n[0],o=n[1],j=Object(s.useContext)(u.a);Object(s.useEffect)((function(){c.a.get("/api/v1/mission").then((function(t){o(t.data.name)}))}),[]);return Object(r.jsxs)("div",{children:[Object(r.jsx)(a.a,{}),Object(r.jsxs)("div",{id:"new-user",children:[Object(r.jsx)("h2",{children:"Edit Our Mission Statement Here."}),Object(r.jsx)("textarea",{value:e,onChange:function(t){return o(t.target.value)}}),Object(r.jsx)("input",{type:"submit",value:"Change Mission",id:"submit",onClick:function(){c.a.post("/api/v1/mission",{mission:e}).then((function(){j.running()}))}})]})]})}},75:function(t,n,e){"use strict";e(1);var i=e(74),s=e(0);n.a=function(){return Object(s.jsx)("div",{children:Object(s.jsx)(i.a.Consumer,{children:function(t){return Object(s.jsx)("h3",{onClick:function(){return t.running()},id:"home",children:"Go Home"})}})})}}}]);
//# sourceMappingURL=15.2d388eb7.chunk.js.map