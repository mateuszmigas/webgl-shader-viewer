!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r=acquireVsCodeApi(),o=function(){function e(){var e=this;this.eventListeners=[],window.addEventListener("message",(function(t){e.eventListeners=e.eventListeners.filter((function(e){return e(t.data)}))}))}return e.prototype.getShaderDocuments=function(){var e=this;return r.postMessage({type:"getShaderDocuments"}),new Promise((function(t){e.eventListeners.push((function(e){return"getShaderDocuments"===e.type&&(t(e.payload.files),!0)}))}))},e.prototype.onDidShaderDocumentsChange=function(e){r.postMessage({type:"onDidShaderDocumentsChange"}),this.eventListeners.push((function(t){return"onDidShaderDocumentsChange"===t.type&&e(t.payload.files),!1}))},e}(),i=function(e,t){var n,r,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,r=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=u.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=t.call(e,u)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}},u=function(e){var t=document.createElement("div");return t.className=e,t};(function(e,t,n,r){new(n||(n=Promise))((function(o,i){function u(e){try{c(r.next(e))}catch(e){i(e)}}function a(e){try{c(r.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,a)}c((r=r.apply(e,t||[])).next())}))})(void 0,void 0,void 0,(function(){var e,t;return i(this,(function(n){return new o,e=document.getElementById("viewer"),(t=document.createElement("div")).className="viewer-options",t.appendChild(u("viewer-shaders-title")),t.appendChild(u("viewer-refresh-button")),t.appendChild(u("viewer-vertex-shader-selector")),t.appendChild(u("viewer-fragment-shader-selector")),t.appendChild(u("viewer-shader-options")),e.appendChild(t),[2]}))}))}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZXdlci9jb21tdW5pY2F0aW9uUHJveHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZXdlci9pbmRleC50cyJdLCJuYW1lcyI6WyJpbnN0YWxsZWRNb2R1bGVzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiZXhwb3J0cyIsIm1vZHVsZSIsImkiLCJsIiwibW9kdWxlcyIsImNhbGwiLCJtIiwiYyIsImQiLCJuYW1lIiwiZ2V0dGVyIiwibyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsInIiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsInZhbHVlIiwidCIsIm1vZGUiLCJfX2VzTW9kdWxlIiwibnMiLCJjcmVhdGUiLCJrZXkiLCJiaW5kIiwibiIsIm9iamVjdCIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJwIiwicyIsImFjcXVpcmVWc0NvZGVBcGkiLCJldmVudExpc3RlbmVycyIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImZpbHRlciIsImxpc3RlbmVyIiwiZGF0YSIsImdldFNoYWRlckRvY3VtZW50cyIsInBvc3RNZXNzYWdlIiwidHlwZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicHVzaCIsIm1lc3NhZ2UiLCJwYXlsb2FkIiwiZmlsZXMiLCJvbkRpZFNoYWRlckRvY3VtZW50c0NoYW5nZSIsImNhbGxiYWNrIiwidGhpcyIsImNyZWF0ZURpdlNlY3Rpb24iLCJ0ZXh0IiwiZGl2IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiVnNDb2RlQXBpUHJveHkiLCJlbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJvcHRpb25zIiwiYXBwZW5kQ2hpbGQiXSwibWFwcGluZ3MiOiJhQUNFLElBQUlBLEVBQW1CLEdBR3ZCLFNBQVNDLEVBQW9CQyxH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WUFBWVYsRUFBaUIseUJBQ3JDUyxFQUFRQyxZQUFZVixFQUFpQiwwQkFDckNTLEVBQVFDLFlBQVlWLEVBQWlCLGtDQUNyQ1MsRUFBUUMsWUFBWVYsRUFBaUIsb0NBQ3JDUyxFQUFRQyxZQUFZVixFQUFpQiwwQkEwQnJDTyxFQUFRRyxZQUFZRCxHIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJkZWNsYXJlIGNvbnN0IGFjcXVpcmVWc0NvZGVBcGk6ICgpID0+IHtcclxuICAvL2dldFN0YXRlOiAoKSA9PiBhbnk7XHJcbiAgLy9zZXRTdGF0ZTogKHN0YXRlOiBhbnkpID0+IHZvaWQ7XHJcbiAgcG9zdE1lc3NhZ2U6IChtZXNzYWdlOiBWc0NvZGVBcGlQcm94eU1lc3NhZ2VSZXF1ZXN0KSA9PiB2b2lkO1xyXG59O1xyXG5leHBvcnQgY29uc3QgdnNjb2RlQXBpID0gYWNxdWlyZVZzQ29kZUFwaSgpO1xyXG5cclxuZXhwb3J0IHR5cGUgVnNDb2RlQXBpUHJveHlNZXNzYWdlUmVxdWVzdCA9XHJcbiAgfCB7IHR5cGU6IFwiZ2V0U2hhZGVyRG9jdW1lbnRzXCIgfVxyXG4gIHwgeyB0eXBlOiBcIm9uRGlkU2hhZGVyRG9jdW1lbnRzQ2hhbmdlXCIgfTtcclxuXHJcbmV4cG9ydCB0eXBlIFZzQ29kZUFwaVByb3h5TWVzc2FnZVJlc3BvbnNlID1cclxuICB8IHtcclxuICAgICAgdHlwZTogXCJnZXRTaGFkZXJEb2N1bWVudHNcIjtcclxuICAgICAgcGF5bG9hZDogeyBmaWxlczogeyBmaWxlUGF0aDogc3RyaW5nOyBmaWxlTmFtZTogc3RyaW5nIH1bXSB9O1xyXG4gICAgfVxyXG4gIHwge1xyXG4gICAgICB0eXBlOiBcIm9uRGlkU2hhZGVyRG9jdW1lbnRzQ2hhbmdlXCI7XHJcbiAgICAgIHBheWxvYWQ6IHsgZmlsZXM6IHsgZmlsZVBhdGg6IHN0cmluZzsgZmlsZU5hbWU6IHN0cmluZyB9W10gfTtcclxuICAgIH07XHJcblxyXG5leHBvcnQgY2xhc3MgVnNDb2RlQXBpUHJveHkge1xyXG4gIGV2ZW50TGlzdGVuZXJzOiAoKG1lc3NhZ2U6IFZzQ29kZUFwaVByb3h5TWVzc2FnZVJlc3BvbnNlKSA9PiBib29sZWFuKVtdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xyXG4gICAgICAvL2NsZWFyIGV2ZW50IGxpc3RlbmVyIHRoYXQgYXJlIG5vIGxvbmdlciBpbnRlcmVzdGVkXHJcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSB0aGlzLmV2ZW50TGlzdGVuZXJzLmZpbHRlcigobGlzdGVuZXIpID0+XHJcbiAgICAgICAgbGlzdGVuZXIoZXZlbnQuZGF0YSlcclxuICAgICAgKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2hhZGVyRG9jdW1lbnRzKCkge1xyXG4gICAgdnNjb2RlQXBpLnBvc3RNZXNzYWdlKHtcclxuICAgICAgdHlwZTogXCJnZXRTaGFkZXJEb2N1bWVudHNcIixcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx7IGZpbGVQYXRoOiBzdHJpbmc7IGZpbGVOYW1lOiBzdHJpbmcgfVtdPigocmVzb2x2ZSkgPT4ge1xyXG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnB1c2goKG1lc3NhZ2UpID0+IHtcclxuICAgICAgICBpZiAobWVzc2FnZS50eXBlID09PSBcImdldFNoYWRlckRvY3VtZW50c1wiKSB7XHJcbiAgICAgICAgICByZXNvbHZlKG1lc3NhZ2UucGF5bG9hZC5maWxlcyk7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25EaWRTaGFkZXJEb2N1bWVudHNDaGFuZ2UoXHJcbiAgICBjYWxsYmFjazogKGRvY3VtZW50czogeyBmaWxlUGF0aDogc3RyaW5nOyBmaWxlTmFtZTogc3RyaW5nIH1bXSkgPT4gdm9pZFxyXG4gICkge1xyXG4gICAgdnNjb2RlQXBpLnBvc3RNZXNzYWdlKHtcclxuICAgICAgdHlwZTogXCJvbkRpZFNoYWRlckRvY3VtZW50c0NoYW5nZVwiLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5wdXNoKChtZXNzYWdlKSA9PiB7XHJcbiAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwib25EaWRTaGFkZXJEb2N1bWVudHNDaGFuZ2VcIikge1xyXG4gICAgICAgIGNhbGxiYWNrKG1lc3NhZ2UucGF5bG9hZC5maWxlcyk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IGNyZWF0ZVRleHRBcmVhIH0gZnJvbSBcIi4vY29tcG9uZW50cy90ZXh0QXJlYVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVEcm9wZG93biB9IGZyb20gXCIuL2NvbXBvbmVudHMvZHJvcGRvd25cIjtcclxuaW1wb3J0IHsgVnNDb2RlQXBpUHJveHkgfSBmcm9tIFwiLi9jb21tdW5pY2F0aW9uUHJveHlcIjtcclxuaW1wb3J0IHsgY3JlYXRlU2VjdGlvblRpdGxlIH0gZnJvbSBcIi4vY29tcG9uZW50cy9jcmVhdGVTZWN0aW9uVGl0bGVcIjtcclxuXHJcbmNvbnN0IGNyZWF0ZURpdlNlY3Rpb24gPSAodGV4dDogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBkaXYuY2xhc3NOYW1lID0gdGV4dDtcclxuICByZXR1cm4gZGl2O1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlVmlld2VyID0gYXN5bmMgKCkgPT4ge1xyXG4gIGNvbnN0IHZzY29kZUFwaSA9IG5ldyBWc0NvZGVBcGlQcm94eSgpO1xyXG4gIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpZXdlclwiKTtcclxuICBjb25zdCBvcHRpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICBvcHRpb25zLmNsYXNzTmFtZSA9IFwidmlld2VyLW9wdGlvbnNcIjtcclxuXHJcbiAgb3B0aW9ucy5hcHBlbmRDaGlsZChjcmVhdGVEaXZTZWN0aW9uKFwidmlld2VyLXNoYWRlcnMtdGl0bGVcIikpO1xyXG4gIG9wdGlvbnMuYXBwZW5kQ2hpbGQoY3JlYXRlRGl2U2VjdGlvbihcInZpZXdlci1yZWZyZXNoLWJ1dHRvblwiKSk7XHJcbiAgb3B0aW9ucy5hcHBlbmRDaGlsZChjcmVhdGVEaXZTZWN0aW9uKFwidmlld2VyLXZlcnRleC1zaGFkZXItc2VsZWN0b3JcIikpO1xyXG4gIG9wdGlvbnMuYXBwZW5kQ2hpbGQoY3JlYXRlRGl2U2VjdGlvbihcInZpZXdlci1mcmFnbWVudC1zaGFkZXItc2VsZWN0b3JcIikpO1xyXG4gIG9wdGlvbnMuYXBwZW5kQ2hpbGQoY3JlYXRlRGl2U2VjdGlvbihcInZpZXdlci1zaGFkZXItb3B0aW9uc1wiKSk7XHJcblxyXG4gIC8vIGNvbnN0IHsgZWxlbWVudDogc2hhZGVyc0VsIH0gPSBjcmVhdGVTZWN0aW9uVGl0bGUoXCJzaGFkZXJzXCIpO1xyXG4gIC8vIG9wdGlvbnMuYXBwZW5kQ2hpbGQoc2hhZGVyc0VsKTtcclxuXHJcbiAgLy8gY29uc3QgcmVmcmVzaEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcbiAgLy8gLy9yZWZyZXNoQnV0dG9uLlxyXG5cclxuICAvLyBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gIC8vIGNhbnZhcy5jbGFzc05hbWUgPSBcInZpZXdlci1jb250ZW50XCI7XHJcblxyXG4gIC8vIGNvbnN0IHtcclxuICAvLyAgIGVsZW1lbnQ6IGRyb3Bkb3duRWxlbWVudCxcclxuICAvLyAgIGNvbnRyb2xsZXI6IGRyb3Bkb3duQ29udHJvbGxlcixcclxuICAvLyB9ID0gY3JlYXRlRHJvcGRvd24oKGl0ZW0pID0+IHtcclxuICAvLyAgIGNvbnNvbGUubG9nKFwiaXRlbSBjaGFuZ2VkXCIsIGl0ZW0pO1xyXG4gIC8vIH0pO1xyXG5cclxuICAvLyBjb25zdCB7XHJcbiAgLy8gICBlbGVtZW50OiB0ZXh0QXJlYUVsZW1lbnQsXHJcbiAgLy8gICBjb250cm9sbGVyOiB0ZXh0QXJlYUNvbnRyb2xsZXIsXHJcbiAgLy8gfSA9IGNyZWF0ZVRleHRBcmVhKCk7XHJcblxyXG4gIC8vIG9wdGlvbnMuYXBwZW5kQ2hpbGQoZHJvcGRvd25FbGVtZW50KTtcclxuICAvLyBvcHRpb25zLmFwcGVuZENoaWxkKHRleHRBcmVhRWxlbWVudCk7XHJcblxyXG4gIGVsZW1lbnQuYXBwZW5kQ2hpbGQob3B0aW9ucyk7XHJcblxyXG4gIC8vIGNvbnN0IGZpbGVzID0gYXdhaXQgdnNjb2RlQXBpLmdldFNoYWRlckRvY3VtZW50cygpO1xyXG4gIC8vIGRyb3Bkb3duQ29udHJvbGxlci5zZXRJdGVtcyhcclxuICAvLyAgIGZpbGVzLm1hcCgoZikgPT4gKHtcclxuICAvLyAgICAgaWQ6IGYuZmlsZVBhdGgsXHJcbiAgLy8gICAgIGRpc3BsYXk6IGYuZmlsZU5hbWUsXHJcbiAgLy8gICB9KSlcclxuICAvLyApO1xyXG4gIC8vIHZzY29kZUFwaS5vbkRpZFNoYWRlckRvY3VtZW50c0NoYW5nZSgoZG9jcykgPT4ge1xyXG4gIC8vICAgY29uc29sZS5sb2coXCJkb2NzIGNoYW5nZWRcIik7XHJcbiAgLy8gICBkcm9wZG93bkNvbnRyb2xsZXIuc2V0SXRlbXMoXHJcbiAgLy8gICAgIGRvY3MubWFwKChmKSA9PiAoe1xyXG4gIC8vICAgICAgIGlkOiBmLmZpbGVQYXRoLFxyXG4gIC8vICAgICAgIGRpc3BsYXk6IGYuZmlsZU5hbWUsXHJcbiAgLy8gICAgIH0pKVxyXG4gIC8vICAgKTtcclxuICAvLyB9KTtcclxuXHJcbiAgLy8gY2FudmFzLndpZHRoID0gNTAwO1xyXG4gIC8vIGNhbnZhcy5oZWlnaHQgPSA1MDA7XHJcbiAgLy8gZWxlbWVudC5hcHBlbmRDaGlsZChjYW52YXMpO1xyXG4gIC8vIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gIC8vIGNvbnRleHQuZmlsbFN0eWxlID0gXCJncmVlblwiO1xyXG4gIC8vIGNvbnRleHQuZmlsbFJlY3QoMTUwLCAxNTAsIDIwMCwgNDUwKTtcclxufTtcclxuXHJcbmNyZWF0ZVZpZXdlcigpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9