(this.webpackJsonpdatt=this.webpackJsonpdatt||[]).push([[17],{314:function(e,t,s){"use strict";s.r(t);var r=s(1),c=s(8),a=s(9),n=s(75),l=s(74),u=s(0),o=function(){var e=Object(r.useState)(""),t=Object(c.a)(e,2),s=t[0],o=t[1],i=Object(r.useState)(""),d=Object(c.a)(i,2),h=d[0],m=d[1],j=Object(r.useState)(""),b=Object(c.a)(j,2),p=b[0],v=b[1],O=Object(r.useState)(""),g=Object(c.a)(O,2),f=g[0],x=g[1],w=Object(r.useState)(!1),y=Object(c.a)(w,2),C=y[0],E=y[1],B=Object(r.useRef)(""),N=Object(r.useContext)(l.a);return Object(u.jsxs)("div",{children:[Object(u.jsx)(n.a,{}),Object(u.jsx)("div",{id:"new-user",children:Object(u.jsxs)("form",{onSubmit:function(e){e.preventDefault(),C&&""===p&&""!==h&&""!==s&&a.a.post("/api/v1/new-user",{username:s,password:h}).then((function(e){"success"===e.data&&(N.newUser("User ".concat(s," Created.")),N.running())}))},onChange:function(){var e=document.getElementById("password-validation");Array.from(e.children).every((function(e){return e.classList.contains("success")}))?(e.style.borderColor="rgb(27, 141, 46)",E(!0)):(e.style.borderColor="rgb(202, 32, 32)",E(!1))},children:[Object(u.jsx)("label",{htmlFor:"username",children:Object(u.jsx)("h2",{children:"Enter a Username"})}),Object(u.jsx)("input",{type:"text",id:"username",value:s,autoComplete:"username",onChange:function(e){o(e.target.value)},onBlur:function(){a.a.post("/api/v1/existing-user",{username:s}).then((function(e){e.data?v("There is already a user with that username."):v("")}))}}),Object(u.jsx)("div",{className:"errors",children:p}),Object(u.jsx)("label",{htmlFor:"password",children:Object(u.jsx)("h2",{children:"Enter a Password"})}),Object(u.jsx)("input",{type:"password",name:"password",autoComplete:"new-password",onChange:function(e){m(e.target.value),function(e){var t;if(e.target.value.length>=8)null===(t=document.getElementById("charlen"))||void 0===t||t.classList.replace("errors","success");else if(e.target.value.length<8){var s;null===(s=document.getElementById("charlen"))||void 0===s||s.classList.replace("success","errors")}var r,c,a,n,l,u,o,i=!1;String(e.target.value).split("").forEach((function(e){e.toUpperCase()===e&&isNaN(Number(e))&&(i=!0)})),i?null===(r=document.getElementById("charcase"))||void 0===r||r.classList.replace("errors","success"):null===(c=document.getElementById("charcase"))||void 0===c||c.classList.replace("success","errors"),l=e.target.value,/\d/.test(l)?null===(a=document.getElementById("charnum"))||void 0===a||a.classList.replace("errors","success"):null===(n=document.getElementById("charnum"))||void 0===n||n.classList.replace("success","errors"),e.target.value===f?null===(u=document.getElementById("charmatch"))||void 0===u||u.classList.replace("errors","success"):null===(o=document.getElementById("charmatch"))||void 0===o||o.classList.replace("success","errors")}(e)},onFocus:function(){return B.current.style.display="block"}}),Object(u.jsx)("label",{htmlFor:"re-type",children:Object(u.jsx)("h2",{children:"Confirm Password"})}),Object(u.jsx)("input",{type:"password",name:"re-password",id:"re-type",autoComplete:"new-password",onChange:function(e){x(e.target.value),function(e){var t,s;e.target.value===h?null===(t=document.getElementById("charmatch"))||void 0===t||t.classList.replace("errors","success"):null===(s=document.getElementById("charmatch"))||void 0===s||s.classList.replace("success","errors")}(e)}}),Object(u.jsx)("input",{type:"submit",id:"submit",value:"Create New User"}),Object(u.jsxs)("div",{id:"password-validation",ref:B,style:{display:"none"},children:[Object(u.jsx)("p",{className:"errors",id:"charlen",children:"Password must be at least 8 characters."}),Object(u.jsx)("p",{className:"errors",id:"charcase",children:" Password must have an upper case character."}),Object(u.jsx)("p",{className:"errors",id:"charnum",children:"Password must contain a number."}),Object(u.jsx)("p",{className:"errors",id:"charmatch",children:"Passwords must match."})]})]})})]})};t.default=function(e){var t=e.getNewUser;return Object(u.jsx)("div",{onClick:function(){t(Object(u.jsx)(o,{}))},className:"user-admin",children:Object(u.jsx)("h2",{children:"Create a New User"})})}},75:function(e,t,s){"use strict";s(1);var r=s(74),c=s(0);t.a=function(){return Object(c.jsx)("div",{children:Object(c.jsx)(r.a.Consumer,{children:function(e){return Object(c.jsx)("h3",{onClick:function(){return e.running()},id:"home",children:"Go Home"})}})})}}}]);
//# sourceMappingURL=17.8170fd21.chunk.js.map