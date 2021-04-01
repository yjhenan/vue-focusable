"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigationService = exports.NavigationServiceDirection = void 0;
var FocusElement_1 = require("./FocusElement");
var NavigationService_1 = __importDefault(require("./NavigationService"));
var NavigationService_2 = require("./NavigationService");
Object.defineProperty(exports, "NavigationServiceDirection", { enumerable: true, get: function () { return NavigationService_2.NavigationServiceDirection; } });
var ElementName = "Focus-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
exports.default = {
    install: function (Vue, options) {
        exports.navigationService = new NavigationService_1.default(options.clickable);
        options.setupKeyBoardEvents(exports.navigationService);
        Vue.component('Focusable', {
            data: function () {
                return {
                    id: null,
                    name: ElementName,
                    focusElement: null
                };
            },
            render: function (createElement) {
                var _a;
                var _b, _c, _d;
                return createElement(options.tag, {
                    class: (_a = {},
                        _a[options.className || "focus"] = (_b = this.$data.focusElement) === null || _b === void 0 ? void 0 : _b.isFocus,
                        _a)
                }, [
                    this.$scopedSlots.default({
                        isDefault: (_c = this.$data.focusElement) === null || _c === void 0 ? void 0 : _c.isDefault,
                        isFocus: (_d = this.$data.focusElement) === null || _d === void 0 ? void 0 : _d.isFocus
                    })
                ]);
            },
            mounted: function () {
                this.$data.focusElement = new FocusElement_1.FocusElement(this.$vnode);
                exports.navigationService.registerFocusElement(this.$data.focusElement, this.$vnode);
            },
            destroyed: function () {
                if (this.$data.focusElement.id) {
                    var focusElement = exports.navigationService.getFocusElementById(this.$data.focusElement.id);
                    if (focusElement)
                        exports.navigationService.deRegisterFocusElement(focusElement);
                    this.$data.focusElement = null;
                }
            }
        });
    }
};
