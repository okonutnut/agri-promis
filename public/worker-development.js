/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./worker/index.js":
/*!*************************!*\
  !*** ./worker/index.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval(__webpack_require__.ts("self.addEventListener('push', function(event) {\n    if (event.data) {\n        const data = event.data.json();\n        const options = {\n            body: data.body,\n            icon: data.icon || '/icon.png',\n            badge: '/badge.png',\n            vibrate: [\n                100,\n                50,\n                100\n            ],\n            data: {\n                dateOfArrival: Date.now(),\n                primaryKey: '2'\n            }\n        };\n        event.waitUntil(self.registration.showNotification(data.title, options));\n    }\n});\nself.addEventListener('notificationclick', function(event) {\n    console.log('Notification click received.');\n    event.notification.close();\n    event.waitUntil(clients.openWindow('https://localhost:3000/'));\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                /* unsupported import.meta.webpackHot */ undefined.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi93b3JrZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUFBLEtBQUtDLGdCQUFnQixDQUFDLFFBQVEsU0FBVUMsS0FBSztJQUMzQyxJQUFJQSxNQUFNQyxJQUFJLEVBQUU7UUFDZCxNQUFNQSxPQUFPRCxNQUFNQyxJQUFJLENBQUNDLElBQUk7UUFDNUIsTUFBTUMsVUFBVTtZQUNkQyxNQUFNSCxLQUFLRyxJQUFJO1lBQ2ZDLE1BQU1KLEtBQUtJLElBQUksSUFBSTtZQUNuQkMsT0FBTztZQUNQQyxTQUFTO2dCQUFDO2dCQUFLO2dCQUFJO2FBQUk7WUFDdkJOLE1BQU07Z0JBQ0pPLGVBQWVDLEtBQUtDLEdBQUc7Z0JBQ3ZCQyxZQUFZO1lBQ2Q7UUFDRjtRQUNBWCxNQUFNWSxTQUFTLENBQUNkLEtBQUtlLFlBQVksQ0FBQ0MsZ0JBQWdCLENBQUNiLEtBQUtjLEtBQUssRUFBRVo7SUFDakU7QUFDRjtBQUVBTCxLQUFLQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsU0FBVUMsS0FBSztJQUN4RGdCLFFBQVFDLEdBQUcsQ0FBQztJQUNaakIsTUFBTWtCLFlBQVksQ0FBQ0MsS0FBSztJQUN4Qm5CLE1BQU1ZLFNBQVMsQ0FBQ1EsUUFBUUMsVUFBVSxDQUFDO0FBQ3JDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXE9rb251dFxcRG9jdW1lbnRzXFxXZWIgUHJvamVjdHNcXGFncmktcHJvbWlzXFx3b3JrZXJcXGluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInNlbGYuYWRkRXZlbnRMaXN0ZW5lcigncHVzaCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gIGlmIChldmVudC5kYXRhKSB7XHJcbiAgICBjb25zdCBkYXRhID0gZXZlbnQuZGF0YS5qc29uKClcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGJvZHk6IGRhdGEuYm9keSxcclxuICAgICAgaWNvbjogZGF0YS5pY29uIHx8ICcvaWNvbi5wbmcnLFxyXG4gICAgICBiYWRnZTogJy9iYWRnZS5wbmcnLFxyXG4gICAgICB2aWJyYXRlOiBbMTAwLCA1MCwgMTAwXSxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGRhdGVPZkFycml2YWw6IERhdGUubm93KCksXHJcbiAgICAgICAgcHJpbWFyeUtleTogJzInLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gICAgZXZlbnQud2FpdFVudGlsKHNlbGYucmVnaXN0cmF0aW9uLnNob3dOb3RpZmljYXRpb24oZGF0YS50aXRsZSwgb3B0aW9ucykpXHJcbiAgfVxyXG59KVxyXG4gXHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbm90aWZpY2F0aW9uY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICBjb25zb2xlLmxvZygnTm90aWZpY2F0aW9uIGNsaWNrIHJlY2VpdmVkLicpXHJcbiAgZXZlbnQubm90aWZpY2F0aW9uLmNsb3NlKClcclxuICBldmVudC53YWl0VW50aWwoY2xpZW50cy5vcGVuV2luZG93KCdodHRwczovL2xvY2FsaG9zdDozMDAwLycpKVxyXG59KSJdLCJuYW1lcyI6WyJzZWxmIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZGF0YSIsImpzb24iLCJvcHRpb25zIiwiYm9keSIsImljb24iLCJiYWRnZSIsInZpYnJhdGUiLCJkYXRlT2ZBcnJpdmFsIiwiRGF0ZSIsIm5vdyIsInByaW1hcnlLZXkiLCJ3YWl0VW50aWwiLCJyZWdpc3RyYXRpb24iLCJzaG93Tm90aWZpY2F0aW9uIiwidGl0bGUiLCJjb25zb2xlIiwibG9nIiwibm90aWZpY2F0aW9uIiwiY2xvc2UiLCJjbGllbnRzIiwib3BlbldpbmRvdyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./worker/index.js\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./worker/index.js");
/******/ 	
/******/ })()
;