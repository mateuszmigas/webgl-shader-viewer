!function(e){var t={};function n(r){if(t[r])return t[r].exports;var l=t[r]={i:r,l:!1,exports:{}};return e[r].call(l.exports,l,l.exports,n),l.l=!0,l.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)n.d(r,l,function(t){return e[t]}.bind(null,l));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r=function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var r=Array(e),l=0;for(t=0;t<n;t++)for(var o=arguments[t],i=0,u=o.length;i<u;i++,l++)r[l]=o[i];return r};console.log("fse");var l=document.getElementById("viewer"),o=document.createElement("div");o.className="viewer-options";var i=document.createElement("canvas");i.className="viewer-content";var u=function(e){var t=document.createElement("select"),n=null,l=[],o=function(t){e(n=t)};t.onchange=function(){var e=l.find((function(e){return e.item.id===t.value}));e.item.id?o(e.item):o(null)};return{element:t,controller:{setItems:function(e){t.innerHTML="",l.length=0,e.find((function(e){return e.id===(null==n?void 0:n.id)}))||o(null),r([{id:"",display:""}],e).forEach((function(e){var r=document.createElement("option");r.value=e.id,r.textContent=e.display,r.selected=e.id===(null==n?void 0:n.id),t.appendChild(r),l.push({element:r,item:e})}))},getItems:function(){return l.map((function(e){return e.item}))},setSelectedItemById:function(e){o(null),l.forEach((function(t){t.item.id===e?(t.element.selected=!0,o(t.item)):t.element.selected=!1}))},getSelectedItem:function(){return n},clearSelection:function(){l.forEach((function(e){return e.element.selected=!1})),o(null)}}}}((function(e){console.log("item changed",e)})),c=u.element,a=u.controller;a.setItems([{id:"1",display:"ala1"},{id:"2",display:"ala2"},{id:"3",display:"ala3"}]),a.setSelectedItemById("2");var d={element:s=document.createElement("textarea"),controller:{getText:function(){return s.value},setText:function(e){return s.value=e}}},f=d.element,m=d.controller;o.appendChild(c),o.appendChild(f),l.appendChild(o),m.setText("dupa"),i.width=500,i.height=500,l.appendChild(i);var s,p=i.getContext("2d");p.fillStyle="green",p.fillRect(150,150,200,450)}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZXdlci9jb21wb25lbnRzL3RleHRBcmVhLnRzIiwid2VicGFjazovLy8uL3NyYy92aWV3ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZpZXdlci9jb21wb25lbnRzL2Ryb3Bkb3duLnRzIl0sIm5hbWVzIjpbImluc3RhbGxlZE1vZHVsZXMiLCJfX3dlYnBhY2tfcmVxdWlyZV9fIiwibW9kdWxlSWQiLCJleHBvcnRzIiwibW9kdWxlIiwiaSIsImwiLCJtb2R1bGVzIiwiY2FsbCIsIm0iLCJjIiwiZCIsIm5hbWUiLCJnZXR0ZXIiLCJvIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiciIsIlN5bWJvbCIsInRvU3RyaW5nVGFnIiwidmFsdWUiLCJ0IiwibW9kZSIsIl9fZXNNb2R1bGUiLCJucyIsImNyZWF0ZSIsImtleSIsImJpbmQiLCJuIiwib2JqZWN0IiwicHJvcGVydHkiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsInAiLCJzIiwiY29uc29sZSIsImxvZyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJvcHRpb25zIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImNhbnZhcyIsIm9uQ2hhbmdlIiwiZWxlbWVudCIsInNlbGVjdGVkSXRlbSIsIml0ZW1FbGVtZW50cyIsInNldFNlbGVjdGVkSXRlbSIsIml0ZW0iLCJvbmNoYW5nZSIsImZvdW5kRWxlbWVudCIsImZpbmQiLCJlIiwiaWQiLCJjb250cm9sbGVyIiwic2V0SXRlbXMiLCJpdGVtcyIsImlubmVySFRNTCIsImxlbmd0aCIsImRpc3BsYXkiLCJmb3JFYWNoIiwib3B0aW9uIiwidGV4dENvbnRlbnQiLCJzZWxlY3RlZCIsImFwcGVuZENoaWxkIiwicHVzaCIsImdldEl0ZW1zIiwibWFwIiwiaWUiLCJzZXRTZWxlY3RlZEl0ZW1CeUlkIiwiZ2V0U2VsZWN0ZWRJdGVtIiwiY2xlYXJTZWxlY3Rpb24iLCJjcmVhdGVEcm9wZG93biIsImRyb3Bkb3duRWxlbWVudCIsImRyb3Bkb3duQ29udHJvbGxlciIsImdldFRleHQiLCJzZXRUZXh0IiwidGV4dCIsInRleHRBcmVhRWxlbWVudCIsInRleHRBcmVhQ29udHJvbGxlciIsIndpZHRoIiwiaGVpZ2h0IiwiZ2V0Q29udGV4dCIsImZpbGxTdHlsZSIsImZpbGxSZWN0Il0sIm1hcHBpbmdzIjoiYUFDRSxJQUFJQSxFQUFtQixHQUd2QixTQUFTQyxFQUFvQkMsR0FHNUIsR0FBR0YsRUFBaUJFLEdBQ25CLE9BQU9GLEVBQWlCRSxHQUFVQyxRQUduQyxJQUFJQyxFQUFTSixFQUFpQkUsR0FBWSxDQUN6Q0csRUFBR0gsRUFDSEksR0FBRyxFQUNISCxRQUFTLElBVVYsT0FOQUksRUFBUUwsR0FBVU0sS0FBS0osRUFBT0QsUUFBU0MsRUFBUUEsRUFBT0QsUUFBU0YsR0FHL0RHLEVBQU9FLEdBQUksRUFHSkYsRUFBT0QsUUFLZkYsRUFBb0JRLEVBQUlGLEVBR3hCTixFQUFvQlMsRUFBSVYsRUFHeEJDLEVBQW9CVSxFQUFJLFNBQVNSLEVBQVNTLEVBQU1DLEdBQzNDWixFQUFvQmEsRUFBRVgsRUFBU1MsSUFDbENHLE9BQU9DLGVBQWViLEVBQVNTLEVBQU0sQ0FBRUssWUFBWSxFQUFNQyxJQUFLTCxLQUtoRVosRUFBb0JrQixFQUFJLFNBQVNoQixHQUNYLG9CQUFYaUIsUUFBMEJBLE9BQU9DLGFBQzFDTixPQUFPQyxlQUFlYixFQUFTaUIsT0FBT0MsWUFBYSxDQUFFQyxNQUFPLFdBRTdEUCxPQUFPQyxlQUFlYixFQUFTLGFBQWMsQ0FBRW1CLE9BQU8sS0FRdkRyQixFQUFvQnNCLEVBQUksU0FBU0QsRUFBT0UsR0FFdkMsR0FEVSxFQUFQQSxJQUFVRixFQUFRckIsRUFBb0JxQixJQUMvQixFQUFQRSxFQUFVLE9BQU9GLEVBQ3BCLEdBQVcsRUFBUEUsR0FBOEIsaUJBQVZGLEdBQXNCQSxHQUFTQSxFQUFNRyxXQUFZ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QUFJLElBQUtNLFFBQVMsUUFDcEIsQ0FBRU4sR0FBSSxJQUFLTSxRQUFTLFVBRXRCZSxFQUFtQkwsb0JBQW9CLEtBRWpDLE1EdkJDLENBQ0x6QixRQUxJQSxFQUFVUCxTQUFTRyxjQUFjLFlBTXJDYyxXQUFZLENBQ1ZxQixRQU5ZLFdBQU0sT0FBQS9CLEVBQVF4QixPQU8xQndELFFBTlksU0FBQ0MsR0FBaUIsT0FBQ2pDLEVBQVF4QixNQUFReUQsS0MwQnhDQyxFQUFlLFVBQ1pDLEVBQWtCLGFBR2hDeEMsRUFBUXlCLFlBQVlTLEdBQ3BCbEMsRUFBUXlCLFlBQVljLEdBRXBCLEVBQVFkLFlBQVl6QixHQUVwQndDLEVBQW1CSCxRQUFRLFFBRTNCbEMsRUFBT3NDLE1BQVEsSUFDZnRDLEVBQU91QyxPQUFTLElBQ2hCLEVBQVFqQixZQUFZdEIsR0FDcEIsSUQxQ01FLEVDMENBLEVBQVVGLEVBQU93QyxXQUFXLE1BQ2xDLEVBQVFDLFVBQVksUUFDcEIsRUFBUUMsU0FBUyxJQUFLLElBQUssSUFBSyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuIiwiZXhwb3J0IGNvbnN0IGNyZWF0ZVRleHRBcmVhID0gKCk6IHtcclxuICBlbGVtZW50OiBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gIGNvbnRyb2xsZXI6IHtcclxuICAgIHNldFRleHQ6ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgICBnZXRUZXh0OiAoKSA9PiBzdHJpbmc7XHJcbiAgfTtcclxufSA9PiB7XHJcbiAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcclxuICBjb25zdCBnZXRUZXh0ID0gKCkgPT4gZWxlbWVudC52YWx1ZTtcclxuICBjb25zdCBzZXRUZXh0ID0gKHRleHQ6IHN0cmluZykgPT4gKGVsZW1lbnQudmFsdWUgPSB0ZXh0KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIGVsZW1lbnQsXHJcbiAgICBjb250cm9sbGVyOiB7XHJcbiAgICAgIGdldFRleHQsXHJcbiAgICAgIHNldFRleHQsXHJcbiAgICB9LFxyXG4gIH07XHJcbn07XHJcbiIsImltcG9ydCB7IGNyZWF0ZVRleHRBcmVhIH0gZnJvbSBcIi4vY29tcG9uZW50cy90ZXh0QXJlYVwiO1xyXG5pbXBvcnQgeyBjcmVhdGVEcm9wZG93biB9IGZyb20gXCIuL2NvbXBvbmVudHMvZHJvcGRvd25cIjtcclxuXHJcbmNvbnNvbGUubG9nKFwiZnNlXCIpO1xyXG5cclxuLy9jcmVhdGUgc2VjdGlvblxyXG4vL2NyZWF0ZSB0aXRsZVxyXG4vL2NyZWF0ZSBkcm9wZG93blxyXG4vL2NyYWV0ZSB0aXRsZVxyXG4vL2NyZWF0ZSBpbnB1dFxyXG5cclxuLy8gY3JlYXRlRHJvcGRvd24gPT4gZWxlbWVudCwgY29udHJvbGxlciB7IHNldEl0ZW1zLCBzZXRTZWxlY3RlZEl0ZW1JZCwgZ2V0U2VsZWN0ZWRJdGVtSWQsIGdldEl0ZW1zIH1cclxuXHJcbntcclxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWV3ZXJcIik7XHJcbiAgY29uc3Qgb3B0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgb3B0aW9ucy5jbGFzc05hbWUgPSBcInZpZXdlci1vcHRpb25zXCI7XHJcblxyXG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgY2FudmFzLmNsYXNzTmFtZSA9IFwidmlld2VyLWNvbnRlbnRcIjtcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZWxlbWVudDogZHJvcGRvd25FbGVtZW50LFxyXG4gICAgY29udHJvbGxlcjogZHJvcGRvd25Db250cm9sbGVyLFxyXG4gIH0gPSBjcmVhdGVEcm9wZG93bigoaXRlbSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJpdGVtIGNoYW5nZWRcIiwgaXRlbSk7XHJcbiAgfSk7XHJcbiAgZHJvcGRvd25Db250cm9sbGVyLnNldEl0ZW1zKFtcclxuICAgIHsgaWQ6IFwiMVwiLCBkaXNwbGF5OiBcImFsYTFcIiB9LFxyXG4gICAgeyBpZDogXCIyXCIsIGRpc3BsYXk6IFwiYWxhMlwiIH0sXHJcbiAgICB7IGlkOiBcIjNcIiwgZGlzcGxheTogXCJhbGEzXCIgfSxcclxuICBdKTtcclxuICBkcm9wZG93bkNvbnRyb2xsZXIuc2V0U2VsZWN0ZWRJdGVtQnlJZChcIjJcIik7XHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGVsZW1lbnQ6IHRleHRBcmVhRWxlbWVudCxcclxuICAgIGNvbnRyb2xsZXI6IHRleHRBcmVhQ29udHJvbGxlcixcclxuICB9ID0gY3JlYXRlVGV4dEFyZWEoKTtcclxuXHJcbiAgb3B0aW9ucy5hcHBlbmRDaGlsZChkcm9wZG93bkVsZW1lbnQpO1xyXG4gIG9wdGlvbnMuYXBwZW5kQ2hpbGQodGV4dEFyZWFFbGVtZW50KTtcclxuXHJcbiAgZWxlbWVudC5hcHBlbmRDaGlsZChvcHRpb25zKTtcclxuXHJcbiAgdGV4dEFyZWFDb250cm9sbGVyLnNldFRleHQoXCJkdXBhXCIpO1xyXG5cclxuICBjYW52YXMud2lkdGggPSA1MDA7XHJcbiAgY2FudmFzLmhlaWdodCA9IDUwMDtcclxuICBlbGVtZW50LmFwcGVuZENoaWxkKGNhbnZhcyk7XHJcbiAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgY29udGV4dC5maWxsU3R5bGUgPSBcImdyZWVuXCI7XHJcbiAgY29udGV4dC5maWxsUmVjdCgxNTAsIDE1MCwgMjAwLCA0NTApO1xyXG59XHJcbiIsImV4cG9ydCB0eXBlIERyb3Bkb3duSXRlbSA9IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGRpc3BsYXk6IHN0cmluZztcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVEcm9wZG93biA9IChcclxuICBvbkNoYW5nZTogKGl0ZW06IERyb3Bkb3duSXRlbSB8IG51bGwpID0+IHZvaWRcclxuKToge1xyXG4gIGVsZW1lbnQ6IEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gIGNvbnRyb2xsZXI6IHtcclxuICAgIHNldEl0ZW1zOiAoaXRlbXM6IERyb3Bkb3duSXRlbVtdKSA9PiB2b2lkO1xyXG4gICAgZ2V0SXRlbXM6ICgpID0+IERyb3Bkb3duSXRlbVtdO1xyXG4gICAgc2V0U2VsZWN0ZWRJdGVtQnlJZDogKGlkOiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgICBnZXRTZWxlY3RlZEl0ZW06ICgpID0+IERyb3Bkb3duSXRlbSB8IG51bGw7XHJcbiAgICBjbGVhclNlbGVjdGlvbjogKCkgPT4gdm9pZDtcclxuICB9O1xyXG59ID0+IHtcclxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcclxuXHJcbiAgbGV0IHNlbGVjdGVkSXRlbTogRHJvcGRvd25JdGVtIHwgbnVsbCA9IG51bGw7XHJcbiAgbGV0IGl0ZW1FbGVtZW50czogeyBlbGVtZW50OiBIVE1MT3B0aW9uRWxlbWVudDsgaXRlbTogRHJvcGRvd25JdGVtIH1bXSA9IFtdO1xyXG4gIGNvbnN0IHNldFNlbGVjdGVkSXRlbSA9IChpdGVtOiBEcm9wZG93bkl0ZW0gfCBudWxsKSA9PiB7XHJcbiAgICBzZWxlY3RlZEl0ZW0gPSBpdGVtO1xyXG4gICAgb25DaGFuZ2Uoc2VsZWN0ZWRJdGVtKTtcclxuICB9O1xyXG5cclxuICBlbGVtZW50Lm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgY29uc3QgZm91bmRFbGVtZW50ID0gaXRlbUVsZW1lbnRzLmZpbmQoKGUpID0+IGUuaXRlbS5pZCA9PT0gZWxlbWVudC52YWx1ZSk7XHJcblxyXG4gICAgaWYgKGZvdW5kRWxlbWVudC5pdGVtLmlkKSBzZXRTZWxlY3RlZEl0ZW0oZm91bmRFbGVtZW50Lml0ZW0pO1xyXG4gICAgZWxzZSBzZXRTZWxlY3RlZEl0ZW0obnVsbCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2V0SXRlbXMgPSAoaXRlbXM6IERyb3Bkb3duSXRlbVtdKSA9PiB7XHJcbiAgICBlbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBpdGVtRWxlbWVudHMubGVuZ3RoID0gMDtcclxuXHJcbiAgICBpZiAoIWl0ZW1zLmZpbmQoKGkpID0+IGkuaWQgPT09IHNlbGVjdGVkSXRlbT8uaWQpKSB7XHJcbiAgICAgIHNldFNlbGVjdGVkSXRlbShudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBbeyBpZDogXCJcIiwgZGlzcGxheTogXCJcIiB9LCAuLi5pdGVtc10uZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICBvcHRpb24udmFsdWUgPSBpdGVtLmlkO1xyXG4gICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBpdGVtLmRpc3BsYXk7XHJcbiAgICAgIG9wdGlvbi5zZWxlY3RlZCA9IGl0ZW0uaWQgPT09IHNlbGVjdGVkSXRlbT8uaWQ7XHJcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgaXRlbUVsZW1lbnRzLnB1c2goeyBlbGVtZW50OiBvcHRpb24sIGl0ZW0gfSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBnZXRJdGVtcyA9ICgpID0+IGl0ZW1FbGVtZW50cy5tYXAoKGllKSA9PiBpZS5pdGVtKTtcclxuICBjb25zdCBzZXRTZWxlY3RlZEl0ZW1CeUlkID0gKGlkOiBzdHJpbmcpID0+IHtcclxuICAgIHNldFNlbGVjdGVkSXRlbShudWxsKTtcclxuICAgIGl0ZW1FbGVtZW50cy5mb3JFYWNoKChpZSkgPT4ge1xyXG4gICAgICBpZiAoaWUuaXRlbS5pZCA9PT0gaWQpIHtcclxuICAgICAgICBpZS5lbGVtZW50LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgICBzZXRTZWxlY3RlZEl0ZW0oaWUuaXRlbSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWUuZWxlbWVudC5zZWxlY3RlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBjb25zdCBnZXRTZWxlY3RlZEl0ZW0gPSAoKSA9PiBzZWxlY3RlZEl0ZW07XHJcbiAgY29uc3QgY2xlYXJTZWxlY3Rpb24gPSAoKSA9PiB7XHJcbiAgICBpdGVtRWxlbWVudHMuZm9yRWFjaCgoaWUpID0+IChpZS5lbGVtZW50LnNlbGVjdGVkID0gZmFsc2UpKTtcclxuICAgIHNldFNlbGVjdGVkSXRlbShudWxsKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgZWxlbWVudCxcclxuICAgIGNvbnRyb2xsZXI6IHtcclxuICAgICAgc2V0SXRlbXMsXHJcbiAgICAgIGdldEl0ZW1zLFxyXG4gICAgICBzZXRTZWxlY3RlZEl0ZW1CeUlkLFxyXG4gICAgICBnZXRTZWxlY3RlZEl0ZW0sXHJcbiAgICAgIGNsZWFyU2VsZWN0aW9uLFxyXG4gICAgfSxcclxuICB9O1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6IiJ9