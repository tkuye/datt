(this.webpackJsonpdatt=this.webpackJsonpdatt||[]).push([[25],{298:function(e,t,c){"use strict";c.r(t);var i=c(8),n=c(14),s=c(0),a=c(9),j=c(193),d=(c(194),c(128)),l=c(20),b=c(21),r=c(11),o=c.n(r),u=c(1),O=function(e){Object(n.a)(e);var t=Object(s.useContext)(l.f),c=Object(s.useState)([]),a=Object(i.a)(c,2),j=a[0],d=a[1],r=Object(s.useContext)(l.d);return Object(s.useEffect)((function(){"LOADED"===(null===t||void 0===t?void 0:t.status)&&d(t.events.map((function(e){var t="";o.a.get(e.url).then((function(e){t=e.data}));var c=function(){null===r||void 0===r||r.getEvents(e,t)};return Object(u.jsx)("div",{className:"upcoming-events",children:Object(u.jsxs)(b.b,{to:"/events/".concat(e.event_name.split(" ").join("-").toLowerCase()),style:{textDecoration:"none"},children:[Object(u.jsx)("img",{className:"upcoming-img",src:e.image,alt:e.event_name,onClick:c}),Object(u.jsx)("h1",{onClick:c,children:e.event_name})]})})})))}),[t]),Object(u.jsx)("div",{children:j.length?Object(u.jsxs)("div",{id:"upcoming",children:[Object(u.jsx)("h1",{id:"head-upcoming",children:"Upcoming Events"}),Object(u.jsx)("h3",{children:"Click below to check out our upcoming events."}),j]}):null})};t.default=function(e){Object(n.a)(e);var t=Object(s.useState)(""),c=Object(i.a)(t,2),b=c[0],r=c[1],o=Object(s.useState)(""),h=Object(i.a)(o,2),x=h[0],v=h[1],m=Object(s.useState)(""),g=Object(i.a)(m,2),f=g[0],p=g[1],S=Object(s.useState)(),k=Object(i.a)(S,2),C=k[0],N=k[1],D=Object(s.useState)(0),E=Object(i.a)(D,2),q=E[0],w=E[1],y=Object(s.useContext)(l.b);return Object(s.useEffect)((function(){if("LOADED"===(null===y||void 0===y?void 0:y.status)){var e=0;w(y.images.length),N(y.images.map((function(t){return e++,Object(u.jsx)(j.d,{index:e,children:Object(u.jsx)("img",{className:"image",src:t,alt:"prev"})})})))}a.a.get("/mission").then((function(e){r(e.data.name),v(e.data.quote.split("-")[0]),p(e.data.quote.split("-")[1])}))}),[y]),Object(u.jsxs)("div",{id:"header",children:[Object(u.jsx)("h1",{children:Object(u.jsx)("button",{children:"D. A. T. T."})}),Object(u.jsxs)(j.c,{infinite:!0,isPlaying:!0,interval:5e3,naturalSlideHeight:40,naturalSlideWidth:100,totalSlides:q,isIntrinsicHeight:!0,className:"carousel-provider",children:[Object(u.jsx)("div",{id:"layout"}),Object(u.jsx)(j.e,{className:"slider",children:C}),Object(u.jsx)(j.a,{className:"back",children:Object(u.jsx)(d.a,{})}),Object(u.jsx)(j.b,{className:"next",children:Object(u.jsx)(d.b,{})})]}),Object(u.jsx)("div",{id:"main",children:Object(u.jsx)(O,{})}),Object(u.jsxs)("div",{id:"mission-div",children:[Object(u.jsx)("h2",{children:"Our Mission"}),Object(u.jsx)("h3",{children:Object(u.jsx)("i",{children:b})})]}),Object(u.jsx)("div",{id:"main-quote",children:Object(u.jsxs)("h3",{id:"quote",children:[x," ~ ",f]})})]})}}}]);
//# sourceMappingURL=25.9acd11a1.chunk.js.map