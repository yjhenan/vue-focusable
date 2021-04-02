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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationServiceDirection = void 0;
/**
 * 组件可以响应的事件
 *
 * @export
 * @enum {number}
 */
var NavigationServiceDirection;
(function (NavigationServiceDirection) {
    /**
     * 上
     */
    NavigationServiceDirection["Up"] = "up";
    /**
     * 下
     */
    NavigationServiceDirection["Down"] = "down";
    /**
     * 左
     */
    NavigationServiceDirection["Left"] = "left";
    /**
     * 右
     */
    NavigationServiceDirection["Right"] = "right";
    /**
     * 确认
     */
    NavigationServiceDirection["Enter"] = "enter";
})(NavigationServiceDirection = exports.NavigationServiceDirection || (exports.NavigationServiceDirection = {}));
var NavigationService = /** @class */ (function () {
    function NavigationService(clickable) {
        if (clickable === void 0) { clickable = false; }
        /**
         * 所有焦点组件集合
         *
         * @type {Map<FocusElement,VNode>}
         * @memberof NavigationService
         */
        this.focusAbleElements = new Map();
        /**
         * 最后一个具有焦点的组件ID
         *
         * @memberof NavigationService
         */
        this.lastElementIdInFocus = "";
        this.blockAllSpatialNavigation = false;
        if (clickable) {
            this.setupMouseEvents();
        }
    }
    NavigationService.prototype.setupMouseEvents = function () {
        var _this = this;
        // enable mouseover event
        document.addEventListener("mouseover", function (e) {
            if (_this.blockAllSpatialNavigation)
                return;
            var el = _this.findFocusable(e.target);
            if (el)
                el.focus();
        });
        // enable mouseout event
        document.addEventListener("mouseout", function (e) {
            if (_this.blockAllSpatialNavigation)
                return;
            var el = _this.findFocusable(e.target);
            if (el)
                el.blur();
        });
        // enable click event
        document.addEventListener("click", function (e) {
            if (_this.blockAllSpatialNavigation)
                return;
            var el = _this.findFocusable(e.target);
            if (el)
                el.enter();
        });
    };
    // try to find focusable element on mouse hover or click
    NavigationService.prototype.findFocusable = function (target) {
        // inside loop search for focusable element
        // we need this if the focusable element has children inside
        // so e.target can point to child or grandchild of focusable element
        while (target) {
            if (target.id) {
                var focusEl = this.getFocusElementById(target.id);
                if (focusEl)
                    return focusEl;
            }
            if (!target.parentNode)
                return undefined;
            target = target.parentNode;
        }
        return undefined;
    };
    /**
     * 触发事件：进行导航
     * @param action 动作
     */
    NavigationService.prototype.spatialNavigationAction = function (action) {
        var el = this.getFocusElementInFocus();
        // let keyValue = NavigationServiceDirection[action];
        // initiate focus action if we have active element
        if (el) {
            switch (action) {
                case NavigationServiceDirection.Up:
                    el.up();
                    break;
                case NavigationServiceDirection.Down:
                    el.down();
                    break;
                case NavigationServiceDirection.Left:
                    el.left();
                    break;
                case NavigationServiceDirection.Right:
                    el.right();
                    break;
                case NavigationServiceDirection.Enter:
                    el.enter();
                    break;
            }
            // if there is no active element, try to find last element in focus
        }
        else if (this.getFocusElementById(this.lastElementIdInFocus)) {
            var el_1 = this.getFocusElementById(this.lastElementIdInFocus);
            if (el_1)
                el_1.focus();
            // as a last resort, try to find a default focus element to 'reset' focus
        }
        else {
            var el_2 = this.getFocusElementIsDefault();
            if (el_2)
                el_2.focus();
        }
    };
    /**
     * 从集合中添加对应的组件
     * @param focusElement 所添加组件
     */
    NavigationService.prototype.registerFocusElement = function (focusElement, vnode) {
        this.focusAbleElements.set(focusElement, vnode);
        // 如果没有活动焦点且当前元素为默认值，则设置初始焦点
        if (focusElement.isDefault && !this.getFocusElementInFocus()) {
            focusElement.focus();
        }
    };
    /**
     * 从集合中删除对应的组件
     * @param focusElement 所要删除组件
     */
    NavigationService.prototype.deRegisterFocusElement = function (focusElement) {
        focusElement.destroy();
        this.focusAbleElements.delete(focusElement);
    };
    /**
     * 获取当前具有焦点的组件
     * @returns 当前焦点组件
     */
    NavigationService.prototype.getFocusElementInFocus = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.focusAbleElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 1), el = _d[0];
                if (el.isFocus)
                    return el;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return;
    };
    /**
     * 根据 id 获取对应的组件
     * @param id 组件 id
     * @returns id 所对应的组件 `FocusElement`
     */
    NavigationService.prototype.getFocusElementById = function (id) {
        var e_2, _a;
        try {
            for (var _b = __values(this.focusAbleElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 1), el = _d[0];
                if (el.id === id)
                    return el;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return;
    };
    /**
     * 根据`id`获取对应的`VNode`
     * @param id 组件 `id`
     * @returns id 所对应的`VNode`
     */
    NavigationService.prototype.getFocusElementVNodeById = function (id) {
        var e_3, _a;
        try {
            for (var _b = __values(this.focusAbleElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), el = _d[0], vnode = _d[1];
                if (el.id === id)
                    return vnode;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return;
    };
    /**
     * 获取默认的焦点组件
     * @returns 默认焦点组件
     */
    NavigationService.prototype.getFocusElementIsDefault = function () {
        var e_4, _a;
        try {
            for (var _b = __values(this.focusAbleElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 1), el = _d[0];
                if (el.isDefault)
                    return el;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return;
    };
    /**
     * 获取下一个默认焦点元素
     *
     * @param {string} id 当前组件 ID
     * @returns {(FocusElement  | undefined)} 下一个组件
     * @memberof NavigationService
     */
    NavigationService.prototype.getDefaultFocusNextById = function (id) {
        var e_5, _a;
        var flag = false;
        try {
            for (var _b = __values(this.focusAbleElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 1), el = _d[0];
                if (el.id === id)
                    flag = true;
                if (flag && el.isDefault)
                    return el;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return;
    };
    /**
     * 获取上一个默认焦点元素
     *
     * @param {string} id 当前组件 ID
     * @returns {(FocusElement  | undefined)} 上一个组件
     * @memberof NavigationService
     */
    NavigationService.prototype.getDefaultFocusPreviousById = function (id) {
        var focusElements = [];
        this.focusAbleElements.forEach(function (_value, key) {
            if (key.isDefault) {
                focusElements.push(key);
            }
            if (key.id == id)
                return;
        });
        return focusElements.pop();
    };
    /**
     * 清楚所有组件的焦点状态
     */
    NavigationService.prototype.blurAllFocusElements = function () {
        var e_6, _a;
        try {
            for (var _b = __values(this.focusAbleElements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 1), el = _d[0];
                if (el.isFocus)
                    el.blur();
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    return NavigationService;
}());
exports.default = NavigationService;
