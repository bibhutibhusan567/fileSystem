(this["webpackJsonpfile-upload-system"]=this["webpackJsonpfile-upload-system"]||[]).push([[0],{15:function(e,t,n){},16:function(e,t,n){},21:function(e,t,n){"use strict";n.r(t);var c=n(2),o=n.n(c),r=n(9),s=n.n(r),l=(n(15),n(4)),i=(n(16),n(23)),a=n(24),d=n(1);function j(e){return Object(d.jsxs)(i.a,{children:[Object(d.jsx)("thead",{children:Object(d.jsxs)("tr",{children:[Object(d.jsx)("th",{children:"#"}),Object(d.jsx)("th",{children:"File Name"}),Object(d.jsx)("th",{children:"Date"}),Object(d.jsx)("th",{children:"Time"}),Object(d.jsx)("th",{}),Object(d.jsx)("th",{})]})}),Object(d.jsx)("tbody",{children:e.list.map((function(t,n){return Object(d.jsxs)("tr",{children:[Object(d.jsx)("th",{children:n+1}),Object(d.jsx)("td",{children:t.fileName}),Object(d.jsx)("td",{children:t.date}),Object(d.jsx)("td",{children:t.time}),Object(d.jsx)("td",{children:Object(d.jsx)(a.a,{onClick:function(){return e.downloadHandler(t.fileName)},children:"Download"})}),Object(d.jsx)("td",{children:Object(d.jsx)(a.a,{onClick:function(){return e.deleteHandler(t.id)},children:"Delete"})})]},n)}))})]})}var h=function(){var e=Object(c.useState)(),t=Object(l.a)(e,2),n=t[0],o=t[1],r=Object(c.useState)([]),s=Object(l.a)(r,2),i=s[0],a=s[1],h=Object(c.useState)(),b=Object(l.a)(h,2),u=b[0],f=b[1],O=Object(c.useState)(),x=Object(l.a)(O,2),p=x[0],m=x[1];return Object(c.useEffect)((function(){fetch("".concat("http://localhost:8080","/data")).then((function(e){return e.json()})).then((function(e){e.error?f(e.error):(f(),console.log(e),a(e))}))}),[]),Object(d.jsxs)("div",{className:"App",children:[Object(d.jsxs)("form",{onSubmit:function(e){if(e.preventDefault(),void 0!==n){var t=new FormData;t.append("file",n),t.append("fileName",n.name),fetch("".concat("http://localhost:8080","/newfile"),{method:"post",body:t}).then((function(e){return e.json()})).then((function(e){e.error?f(e.error):(f(),m(e.message),a(e.body))}))}else f("Please select a file to upload")},children:[Object(d.jsx)("input",{type:"file",name:"file",onChange:function(e){o(e.target.files[0])}}),Object(d.jsx)("input",{type:"submit",value:"upload"})]}),Object(d.jsx)("br",{}),u?Object(d.jsx)("div",{className:"error",children:u}):Object(d.jsx)("div",{className:"success",children:p}),Object(d.jsx)("br",{}),Object(d.jsx)("br",{}),Object(d.jsx)(j,{list:i,downloadHandler:function(e){fetch("".concat("http://localhost:8080","/download/").concat(e)).then((function(e){return e.blob()})).then((function(t){var n=window.URL.createObjectURL(new Blob([t])),c=document.createElement("a");c.href=n,c.setAttribute("download",e),document.body.appendChild(c),c.click(),c.parentNode.removeChild(c)}))},deleteHandler:function(e){fetch("".concat("http://localhost:8080","/delete/").concat(e),{method:"delete"}).then((function(e){return e.json()})).then((function(e){e.error?f(e.error):(f(),a(e.body),m(e.message))}))}})]})};n(20);s.a.render(Object(d.jsx)(o.a.StrictMode,{children:Object(d.jsx)(h,{})}),document.getElementById("root"))}},[[21,1,2]]]);
//# sourceMappingURL=main.4ac13730.chunk.js.map