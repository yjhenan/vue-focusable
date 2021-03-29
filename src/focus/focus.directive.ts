import { NavigationService } from "./navigation.service";
import { VNode } from "vue";

interface VNodeFocusListener {
    focus: boolean;
    blur: boolean;
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    click: boolean;
}

type VNodeFocusListenerType = keyof VNodeFocusListener;

export interface SpatialNavigationOptions {
    keyCodes?: { [key: string]: number | Array<number> } | undefined;
    navigationService?: new (keys: { [key: string]: number | Array<number> }) => NavigationService;
}

// export navigation service
export let navigationService: NavigationService;

// export focus element
export class FocusElement {
    static AutoFocus = "AUTOFOCUS";

    // private properties
    private _node: Vue | undefined;
    private _left: string | undefined;
    private _right: string | undefined;
    private _up: string | undefined;
    private _down: string | undefined;
    private _listeners: VNodeFocusListener = {
        focus: false,
        blur: false,
        left: false,
        right: false,
        up: false,
        down: false,
        click: false
    };

    // directive identifier (matches related DOM id)
    id!: string;
    // is element 'focussed'
    isFocus = false;
    // is element 'selected'
    isSelect = false;
    // should element be 'focussed' by default on rendering
    isDefault = false;

    // directive initialisation
    constructor(vnode: VNode) {
        let node = vnode.componentInstance as Vue;
        this._node = node;

        this.id = "focus-el-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
        if (vnode && vnode.elm) {
            const elm:HTMLElement = <HTMLElement>vnode.elm;
            if (!elm.id) {
                elm.id = this.id;
            }
        }
        // css3 dataset 标准
        this.isDefault = (node?.$attrs["data-default"] === "" || node?.$attrs["data-default"] === "true");
        this._left = (node?.$attrs["data-left"] || "");
        this._right = (node?.$attrs["data-right"] || "");
        this._up = (node?.$attrs["data-up"] || "");
        this._down = (node?.$attrs["data-down"] || "");

        // 不要缓存侦听器逻辑以防止内存泄漏
        // 而是缓存特定侦听器
        if (vnode.componentOptions && vnode.componentOptions.listeners) {
            let listeners: VNodeFocusListener | undefined = <VNodeFocusListener>vnode.componentOptions.listeners;
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

    // cleanup when directive is destroyed
    destroy() {
        this.isDefault = false;
        this.isFocus = false;
        this.isSelect = false;
        this._node = undefined;
        this._left = undefined;
        this._right = undefined;
        this._up = undefined;
        this._down = undefined;
        this._listeners = {
            focus: false,
            blur: false,
            left: false,
            right: false,
            up: false,
            down: false,
            click: false
        };
    }

    // get dom reference of directive
    get $el() {
        return document.getElementById(this.id);
    }
    //// select handling
    // set element as selected
    select() {
        this.isSelect = true;
        if (this.$el) this.$el.className += " select";
    }

    // remove selected state from element
    deSelect() {
        this.isSelect = false;
        if (this.$el) this.$el.className.replace(/\bselect\b/, "");
    }

    /**
     * 触发监听器事件
     * @param type 触发类型
     */
    triggerListener(type: VNodeFocusListenerType) {
        // 检查事件方法是否绑定到组件
        if (this._listeners[type]) {
            try {
                (this._node?.$listeners[type] as Function)(this.id);
                (this._node?.$scopedSlots.default as Function)({
                    isDefault: this.isDefault,
                    isFocus: this.isFocus
                })
            } catch (e) {
                console.log(type, e);
            }
        }
    }
    //// focus handling
    // set focus to element
    focus() {
        // 取消所有组件的焦点
        navigationService.blurAllFocusElements();
        // 将焦点元素存储在导航服务中
        navigationService.lastElementIdInFocus = this.id;
        // 设置当前为焦点元素
        this.isFocus = true;
        // dom 相关
        if (this.$el) {
            this.$el.className += " focus";
            // 将“本机”浏览器的焦点设置为输入元素和可聚焦元素。
            if (this.$el.tabIndex !== -1 || this.$el.nodeName === "INPUT" || this.$el.nodeName === "TEXTAREA") this.$el.focus();
        }
        this.triggerListener("focus");
    }

    // remove focus from element
    blur() {
        this.isFocus = false;
        if (this.$el) {
            this.$el.className = this.$el.className.replace(/\s?\bfocus\b/, "");
        }
        this.triggerListener("blur");
    }

    // 空间导航
    /**
     * 将焦点从此元素移到 左边
     */ 
    left() {
        // 检查是否应该自动找到下一个可聚焦元素
        if (this._left === FocusElement.AutoFocus) {
            this.defaultFocusPrevious();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        } else if (this._left) {
            this.doFocusElement(this._left);
        }
        
    }

    // move focus to the element/action configured as 'right' from this element
    right() {
        // 检查是否应该自动找到下一个可聚焦元素
        if (this._right === FocusElement.AutoFocus) {
            this.defaultFocusNext();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        } else if (this._right) {
            this.doFocusElement(this._right);
        }
       
        this.triggerListener("right");
    }

    // move focus to the element/action configured as 'up' from this element
    up() {
        // 检查是否应该自动找到下一个可聚焦元素
        if (this._up === FocusElement.AutoFocus) {
            this.defaultFocusPrevious();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        } else if (this._up) {
            this.doFocusElement(this._up);
        }
        this.triggerListener("up");
    }

    // move focus to the element/action configured as 'down' from this element
    down() {
        // 检查是否应该自动找到下一个可聚焦元素
        if (this._down === FocusElement.AutoFocus) {
            this.defaultFocusNext();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        } else if (this._down) {
            this.doFocusElement(this._down);
        }
        this.triggerListener("down");
    }

    enter() {
        this.triggerListener("click");
    }

    /**
     * 下一个默认焦点
     */
    private defaultFocusNext() {
        if (this.$el) {
            // 检查是否可以找到同级元素
            const next = this.$el.nextElementSibling;
            // 检查元素是否存在并且具有id
            if (next && next.id) {
                // set focus to component
                this.doFocusElement(next.id);
            }
        }
    }
    /**
     * 上一个默认焦点
     */
    private defaultFocusPrevious() {
        if (this.$el) {
            // 检查是否可以找到同级元素
            const previous = this.$el.previousElementSibling;
            // check if element exist and has current directive selector
            if (previous && previous.id) {
                // set focus to component
                this.doFocusElement(previous.id);
            }
        }
    }

    private doFocusElement(id: string): void {
        let el = navigationService.getFocusElementById(id);
        if (el) el.focus();
    }
}

// Vue plugin
export default {
    install: function (Vue: any, options: SpatialNavigationOptions) {
        if (!options) options = <any>{};
        // initialise navigation service
        if (!options.keyCodes) {
            options.keyCodes = {
                "up": 38,
                "down": 40,
                "left": 37,
                "right": 39,
                "enter": 13
            };
        }
        navigationService = (options.navigationService) ? new options.navigationService(options.keyCodes) : new NavigationService(options.keyCodes);

        Vue.directive("focus", {
            // directive lifecycle
            bind: (el: any, binding: any, vnode: VNode) => {
                let focusElement = new FocusElement(vnode);
                navigationService.registerFocusElement(focusElement);

                // set this element in focus if no element has focus and this is marked default
                if (focusElement.isDefault && !navigationService.getFocusElementInFocus()) {
                    focusElement.focus();
                }
            },
            unbind: (el: any, binding: any, vnode: VNode) => {
                if (vnode.elm) {
                    let focusElement = navigationService.getFocusElementById((<HTMLScriptElement>vnode.elm).id);
                    if (focusElement) navigationService.deRegisterFocusElement(focusElement);
                }
            }
        });
    }
};
