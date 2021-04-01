"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusElement = void 0;
var index_1 = require("./index");
// export focus element
var FocusElement = /** @class */ (function () {
    // directive initialisation
    function FocusElement(vnode) {
        var _a, _b, _c;
        this._listeners = {
            focus: false,
            blur: false,
            left: false,
            right: false,
            up: false,
            down: false,
            click: false
        };
        // is element 'focussed'
        this.isFocus = false;
        // is element 'selected'
        this.isSelect = true;
        /**
         * 是否为父节点
         *
         * @memberof FocusElement
         */
        this.isParent = false;
        var node = vnode.componentInstance;
        // 如未设定 id 就随机生成
        this.id = (node === null || node === void 0 ? void 0 : node.$attrs["id"]) || "focus-el-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
        node.$data.id = this.id;
        if (vnode && vnode.elm) {
            var elm = vnode.elm;
            if (!elm.id) {
                elm.id = this.id;
            }
        }
        this.parentId = ((_a = node.$parent.$data) === null || _a === void 0 ? void 0 : _a.name) === node.$data.name ? (_c = (_b = node.$parent.$data) === null || _b === void 0 ? void 0 : _b.focusElement) === null || _c === void 0 ? void 0 : _c.id : null;
        this.isParent = this.isParentFocusElement(node);
        // 默认容器组件不可选中
        if (this.isParent) {
            this.isSelect = false;
            // 可指定选中
            this.isSelect = ((node === null || node === void 0 ? void 0 : node.$attrs["data-select"]) === "" || (node === null || node === void 0 ? void 0 : node.$attrs["data-select"]) === "true" || node.$attrs["select"] == "");
        }
        // 不要缓存侦听器逻辑以防止内存泄漏
        // 而是缓存特定侦听器
        if (vnode.componentOptions && vnode.componentOptions.listeners) {
            var listeners = vnode.componentOptions.listeners;
            this._listeners = {
                focus: Boolean(listeners.focus),
                blur: Boolean(listeners.blur),
                left: Boolean(listeners.left),
                right: Boolean(listeners.right),
                up: Boolean(listeners.up),
                down: Boolean(listeners.down),
                click: Boolean(listeners.click),
            };
            listeners = undefined;
        }
    }
    Object.defineProperty(FocusElement.prototype, "$el", {
        /**
         * 获取`dom`的引用
         *
         * @readonly
         * @private
         * @type {(HTMLElement | null)}
         * @memberof FocusElement
         */
        get: function () {
            return document.getElementById(this.id);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FocusElement.prototype, "$node", {
        /**
         * 获取所对应的 VNode
         *
         * @readonly
         * @type {(Vue | null)}
         * @memberof FocusElement
         */
        get: function () {
            var _a;
            return (_a = index_1.navigationService.getFocusElementVNodeById(this.id)) === null || _a === void 0 ? void 0 : _a.componentInstance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FocusElement.prototype, "isDefault", {
        // css3 dataset 标准
        /**
         * 是否为默认
         *
         * @readonly
         * @private
         * @memberof FocusElement
         */
        get: function () {
            var _a, _b, _c;
            return (((_a = this.$node) === null || _a === void 0 ? void 0 : _a.$attrs["data-default"]) === "" || ((_b = this.$node) === null || _b === void 0 ? void 0 : _b.$attrs["data-default"]) === "true" || ((_c = this.$node) === null || _c === void 0 ? void 0 : _c.$attrs["default"]) == "");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FocusElement.prototype, "_left", {
        /**
         * 响应`left`事件时所要跳转的元素 `ID`
         */
        get: function () {
            var _a, _b;
            return (((_a = this.$node) === null || _a === void 0 ? void 0 : _a.$attrs["data-left"]) || ((_b = this.$node) === null || _b === void 0 ? void 0 : _b.$attrs["left"]) || "");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FocusElement.prototype, "_right", {
        /**
         * 响应`right`事件时所要跳转的元素 `ID`
         */
        get: function () {
            var _a, _b;
            return (((_a = this.$node) === null || _a === void 0 ? void 0 : _a.$attrs["data-right"]) || ((_b = this.$node) === null || _b === void 0 ? void 0 : _b.$attrs["right"]) || "");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FocusElement.prototype, "_up", {
        /**
         * 响应`up`事件时所要跳转的元素 `ID`
         */
        get: function () {
            var _a, _b;
            return (((_a = this.$node) === null || _a === void 0 ? void 0 : _a.$attrs["data-up"]) || ((_b = this.$node) === null || _b === void 0 ? void 0 : _b.$attrs["up"]) || "");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FocusElement.prototype, "_down", {
        /**
         * 响应`down`事件时所要跳转的元素 `ID`
         */
        get: function () {
            var _a, _b;
            return (((_a = this.$node) === null || _a === void 0 ? void 0 : _a.$attrs["data-down"]) || ((_b = this.$node) === null || _b === void 0 ? void 0 : _b.$attrs["down"]) || "");
        },
        enumerable: false,
        configurable: true
    });
    // cleanup when directive is destroyed
    FocusElement.prototype.destroy = function () {
        this.isFocus = false;
        this.isSelect = false;
        this._listeners = {
            focus: false,
            blur: false,
            left: false,
            right: false,
            up: false,
            down: false,
            click: false
        };
    };
    //// focus handling
    // set focus to element
    FocusElement.prototype.focus = function () {
        // 不可选中类型
        if (!this.isSelect)
            return;
        // 取消所有组件的焦点
        index_1.navigationService.blurAllFocusElements();
        // 将焦点元素存储在导航服务中
        index_1.navigationService.lastElementIdInFocus = this.id;
        // 设置当前为焦点元素
        this.isFocus = true;
        // dom 相关
        if (this.$el) {
            // 浏览器的焦点设置为输入元素和可聚焦元素。
            if (this.$el.tabIndex !== -1 || this.$el.nodeName === "INPUT" || this.$el.nodeName === "TEXTAREA")
                this.$el.focus();
        }
        this.triggerListener("focus");
    };
    // remove focus from element
    FocusElement.prototype.blur = function () {
        this.isFocus = false;
        this.triggerListener("blur");
    };
    // 空间导航
    /**
     * 将焦点从此元素移到 左边
     */
    FocusElement.prototype.left = function () {
        var _a;
        // 检查是否自动找到下一个默认可聚焦元素
        if (this._left === FocusElement.AutoFocus) {
            this.defaultFocusPrevious();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        }
        else if (this._left) {
            this.doFocusElement(this._left);
        }
        else {
            var id = (_a = this.getFocusElementPrevById()) === null || _a === void 0 ? void 0 : _a.id;
            if (id)
                this.doFocusElement(id);
        }
        this.triggerListener("left");
    };
    // move focus to the element/action configured as 'right' from this element
    FocusElement.prototype.right = function () {
        var _a;
        // 检查是否自动找到下一个默认可聚焦元素
        if (this._right === FocusElement.AutoFocus) {
            this.defaultFocusNext();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        }
        else if (this._right) {
            this.doFocusElement(this._right);
        }
        else {
            var id = (_a = this.getFocusElementNextById()) === null || _a === void 0 ? void 0 : _a.id;
            if (id)
                this.doFocusElement(id);
        }
        this.triggerListener("right");
    };
    // move focus to the element/action configured as 'up' from this element
    FocusElement.prototype.up = function () {
        var _a;
        // 检查是否自动找到下一个默认可聚焦元素
        if (this._up === FocusElement.AutoFocus) {
            this.defaultFocusPrevious();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        }
        else if (this._up) {
            this.doFocusElement(this._up);
        }
        else {
            var id = (_a = this.getFocusElementPrevById()) === null || _a === void 0 ? void 0 : _a.id;
            if (id)
                this.doFocusElement(id);
        }
        this.triggerListener("up");
    };
    // move focus to the element/action configured as 'down' from this element
    FocusElement.prototype.down = function () {
        var _a;
        // 检查是否自动找到下一个默认可聚焦元素
        if (this._down === FocusElement.AutoFocus) {
            this.defaultFocusNext();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        }
        else if (this._down) {
            this.doFocusElement(this._down);
        }
        else {
            var id = (_a = this.getFocusElementNextById()) === null || _a === void 0 ? void 0 : _a.id;
            if (id)
                this.doFocusElement(id);
        }
        this.triggerListener("down");
    };
    FocusElement.prototype.enter = function () {
        this.triggerListener("click");
    };
    /**
     * 触发监听器事件
     * @param type 触发类型
     */
    FocusElement.prototype.triggerListener = function (type) {
        var _a, _b;
        // 检查事件方法是否绑定到组件
        if (this._listeners[type]) {
            try {
                ((_a = this.$node) === null || _a === void 0 ? void 0 : _a.$listeners)[type](this.id);
            }
            catch (e) {
                console.log(type, e);
            }
        }
        // 更改作用域变量
        ((_b = this.$node) === null || _b === void 0 ? void 0 : _b.$scopedSlots.default)({
            isDefault: this.isDefault,
            isFocus: this.isFocus
        });
        console.log(type);
    };
    FocusElement.prototype.getFocusElementNextById = function (el) {
        var _a;
        if (el === void 0) { el = this.$node; }
        var parentElement = el === null || el === void 0 ? void 0 : el.$parent;
        // 如果没有父元素，或者父元素不是焦点元素
        if (!parentElement || (el === null || el === void 0 ? void 0 : el.$data.name) !== ((_a = this.$node) === null || _a === void 0 ? void 0 : _a.$data.name))
            return;
        // 过滤掉普通元素
        var focusChildrens = parentElement.$children.filter(function (item) { return item.$data.name === (el === null || el === void 0 ? void 0 : el.$data.name); });
        // 子节点中是否有可聚焦元素
        if (focusChildrens.length) {
            var index = focusChildrens.findIndex(function (item) { return item === el; });
            if (index === focusChildrens.length - 1) {
                console.log("已经是最后一个了！");
                return this.getFocusElementNextById(parentElement);
            }
            else {
                /**
                 * 前一个元素索引
                 */
                var elementIndex = index + 1;
                if (this.isParentFocusElement(focusChildrens[elementIndex])) {
                    var element = this.getParentElementChildrenFirst(focusChildrens[elementIndex]);
                    if (this.isParentFocusElement(element)) {
                        return this.getFocusElementNextById(focusChildrens[elementIndex]);
                    }
                    else {
                        return element.$data.focusElement;
                    }
                }
                else {
                    return focusChildrens[elementIndex].$data.focusElement;
                }
            }
        }
    };
    FocusElement.prototype.getFocusElementPrevById = function (el) {
        var _a;
        if (el === void 0) { el = this.$node; }
        var parentElement = el === null || el === void 0 ? void 0 : el.$parent;
        // 如果没有父元素，或者父元素不是焦点元素
        if (!parentElement || (el === null || el === void 0 ? void 0 : el.$data.name) !== ((_a = this.$node) === null || _a === void 0 ? void 0 : _a.$data.name))
            return;
        // 过滤掉普通元素
        var focusChildrens = parentElement.$children.filter(function (item) { return item.$data.name === (el === null || el === void 0 ? void 0 : el.$data.name); });
        // 子节点中是否有可聚焦元素
        if (focusChildrens.length) {
            var index = focusChildrens.findIndex(function (item) { return item === el; });
            if (index === 0) {
                console.log("已经是第一个了！");
                return this.getFocusElementPrevById(parentElement);
            }
            else {
                /**
                 * 后一个元素索引
                 */
                var elementIndex = index - 1;
                if (this.isParentFocusElement(focusChildrens[elementIndex])) {
                    var element = this.getParentElementChildrenLast(focusChildrens[elementIndex]);
                    if (this.isParentFocusElement(element)) {
                        return this.getFocusElementPrevById(focusChildrens[elementIndex]);
                    }
                    else {
                        return element.$data.focusElement;
                    }
                }
                else {
                    return focusChildrens[elementIndex].$data.focusElement;
                }
            }
        }
    };
    /**
     * 下一个默认焦点
     */
    FocusElement.prototype.defaultFocusNext = function () {
        var next = index_1.navigationService.getDefaultFocusNextById(this.id);
        if (next && next.id) {
            // 为组件设置焦点
            this.doFocusElement(next.id);
        }
    };
    /**
     * 上一个默认焦点
     */
    FocusElement.prototype.defaultFocusPrevious = function () {
        var previous = index_1.navigationService.getDefaultFocusPreviousById(this.id);
        if (previous && previous.id) {
            // 为组件设置焦点
            this.doFocusElement(previous.id);
        }
    };
    /**
     * 将`ID`对应的焦点组件设置为焦点
     * @param id
     */
    FocusElement.prototype.doFocusElement = function (id) {
        var el = index_1.navigationService.getFocusElementById(id);
        if (el)
            el.focus();
    };
    /**
     * 检测焦点组件是否是父组件，既容器组件
     * @param el 需要检测的组件
     * @returns 是否是父组件
     */
    FocusElement.prototype.isParentFocusElement = function (el) {
        var e_1, _a;
        if (!el.$children.length)
            return false;
        try {
            for (var _b = __values(el.$children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.$data.name === (el === null || el === void 0 ? void 0 : el.$data.name)) {
                    return true;
                }
                this.isParentFocusElement(item);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    /**
     * 查找指定父组件内的第一个子组件
     * @param parentElement 父组件
     * @returns 第一个子组件
     */
    FocusElement.prototype.getParentElementChildrenFirst = function (parentElement) {
        var _this = this;
        var element = parentElement.$children.filter(function (item) { var _a; return item.$data.name === ((_a = _this.$node) === null || _a === void 0 ? void 0 : _a.$data.name); });
        if (!element.length)
            return parentElement;
        return this.getParentElementChildrenFirst(element[0]);
    };
    /**
     * 查找指定父组件内的最后一个子组件
     * @param parentElement 父组件
     * @returns 最后一个子组件
     */
    FocusElement.prototype.getParentElementChildrenLast = function (parentElement) {
        var _this = this;
        var element = parentElement.$children.filter(function (item) { var _a; return item.$data.name === ((_a = _this.$node) === null || _a === void 0 ? void 0 : _a.$data.name); });
        if (!element.length)
            return parentElement;
        return this.getParentElementChildrenLast(element[element.length - 1]);
    };
    FocusElement.AutoFocus = "AUTOFOCUS";
    return FocusElement;
}());
exports.FocusElement = FocusElement;
