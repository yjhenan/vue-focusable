import { VNode } from "vue";
import { NormalizedScopedSlot } from "vue/types/vnode";
import { navigationService } from "./focus";

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
    isSelect = true;
    // should element be 'focussed' by default on rendering
    isDefault = false;
    isParent = false;

    // directive initialisation
    constructor(vnode: VNode) {
        const node = vnode.componentInstance as Vue;
        this._node = node;

        this.id = "focus-el-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
        if (vnode && vnode.elm) {
            const elm: HTMLElement = <HTMLElement>vnode.elm;
            if (!elm.id) {
                elm.id = this.id;
            }
        }
        this.isParent = this.isParentFocusElement(this._node);
        // 默认容器组件不可选中
        if (this.isParent) {
            this.isSelect = false;
            // 可指定选中
            this.isSelect = (node?.$attrs["data-select"] === "" || node?.$attrs["data-select"] === "true" || node.$attrs["select"] == "");
        }
        // css3 dataset 标准
        this.isDefault = (node?.$attrs["data-default"] === "" || node?.$attrs["data-default"] === "true" || node.$attrs["default"] == "");
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
    destroy(): void {
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
    get $el(): HTMLElement | null {
        return document.getElementById(this.id);
    }
    /**
     * 触发监听器事件
     * @param type 触发类型
     */
    triggerListener(type: VNodeFocusListenerType): void {
        // 检查事件方法是否绑定到组件
        if (this._listeners[type]) {
            try {
                (this._node?.$listeners as Record<string, (id: string) => void>)[type](this.id);
                
            } catch (e) {
                console.log(type, e);
            }
        }
        // 更改作用域变量
        (this._node?.$scopedSlots.default as NormalizedScopedSlot )({
            isDefault: this.isDefault,
            isFocus: this.isFocus
        })
                console.log(this._node);
    }
    //// focus handling
    // set focus to element
    focus(): void {
        // 不可选中类型
        if (!this.isSelect) return;
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
    blur(): void {
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
    left(): void {
        // 检查是否应该自动找到下一个可聚焦元素
        if (this._left === FocusElement.AutoFocus) {
            this.defaultFocusPrevious();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        } else if (this._left) {
            this.doFocusElement(this._left);
        } else {
            const parentElement = this._node?.$parent;
            // 如果没有父元素，或者父元素不是焦点元素
            if (!parentElement) return;
            const focusChildren = parentElement.$children.filter(item => item.$data.name === this._node?.$data.name);
            if (focusChildren.length > 1) {
                const index = focusChildren.findIndex(item => item == this._node);
                if (index <= 0) {
                    return;
                } else {
                    focusChildren[index - 1].$data.focusElement.focus();
                }
            }
        }
    }

    // move focus to the element/action configured as 'right' from this element
    right(): void {
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
    up(): void {
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
    down(): void {
        // 检查是否应该自动找到下一个可聚焦元素
        if (this._down === FocusElement.AutoFocus) {
            this.defaultFocusNext();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        } else if (this._down) {
            this.doFocusElement(this._down);
        }
        this.triggerListener("down");
    }

    enter(): void {
        this.triggerListener("click");
    }

    /**
     * 下一个默认焦点
     */
    private defaultFocusNext(): void {
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
    private defaultFocusPrevious(): void {
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
        const el = navigationService.getFocusElementById(id);
        if (el) el.focus();
    }

    private isParentFocusElement(vnode: Vue):boolean {
        if (!vnode.$children.length) return false;
        for (const item of vnode.$children) {
            if (item.$data.name === this._node?.$data.name) {
                return true;
            }
            this.isParentFocusElement(item)
        }
        return false;
    }
}
