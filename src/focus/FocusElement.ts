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
    parentId!: string;
    // is element 'focussed'
    isFocus = false;
    // is element 'selected'
    isSelect = true;
    /**
     * 是否为父节点
     *
     * @memberof FocusElement
     */
    isParent = false;

    // directive initialisation
    constructor(vnode: VNode) {
        const node = vnode.componentInstance as Vue;
        // 如未设定 id 就随机生成
        this.id = node?.$attrs["id"] || "focus-el-" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
        node.$data.id = this.id;
        if (vnode && vnode.elm) {
            const elm: HTMLElement = <HTMLElement>vnode.elm;
            if (!elm.id) {
                elm.id = this.id;
            }
        }
        this.parentId = node.$parent.$data?.name === node.$data.name ? node.$parent.$data?.focusElement?.id : null;
        this.isParent = this.isParentFocusElement(node);
        // 默认容器组件不可选中
        if (this.isParent) {
            this.isSelect = false;
            // 可指定选中
            this.isSelect = (node?.$attrs["data-select"] === "" || node?.$attrs["data-select"] === "true" || node.$attrs["select"] == "");
        }


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

    /**
     * 获取`dom`的引用
     *
     * @readonly
     * @private
     * @type {(HTMLElement | null)}
     * @memberof FocusElement
     */
    private get $el(): HTMLElement | null {
        return document.getElementById(this.id);
    }
    /**
     * 获取所对应的 VNode
     *
     * @readonly
     * @type {(Vue | null)}
     * @memberof FocusElement
     */
    private get $node(): Vue | undefined {
        return navigationService.getFocusElementVNodeById(this.id)?.componentInstance;
    }
    // css3 dataset 标准
    /**
     * 是否为默认
     *
     * @readonly
     * @private
     * @memberof FocusElement
     */
    get isDefault():boolean {
        return (this.$node?.$attrs["data-default"] === "" || this.$node?.$attrs["data-default"] === "true" || this.$node?.$attrs["default"] == "");
    }
    /**
     * 响应`left`事件时所要跳转的元素 `ID`
     */
    private get _left() {
        return (this.$node?.$attrs["data-left"] || this.$node?.$attrs["left"] || "");
    }
    /**
     * 响应`right`事件时所要跳转的元素 `ID`
     */
    private get _right() {
        return (this.$node?.$attrs["data-right"] || this.$node?.$attrs["right"] || "");
    }
    /**
     * 响应`up`事件时所要跳转的元素 `ID`
     */
    private get _up() {
        return (this.$node?.$attrs["data-up"] || this.$node?.$attrs["up"] || "");
    }
    /**
     * 响应`down`事件时所要跳转的元素 `ID`
     */
    private get _down() {
        return (this.$node?.$attrs["data-down"] || this.$node?.$attrs["down"] || "");
    }

    // cleanup when directive is destroyed
    destroy(): void {
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
            // 浏览器的焦点设置为输入元素和可聚焦元素。
            if (this.$el.tabIndex !== -1 || this.$el.nodeName === "INPUT" || this.$el.nodeName === "TEXTAREA") this.$el.focus();
        }
        this.triggerListener("focus");
    }

    // remove focus from element
    blur(): void {
        this.isFocus = false;
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
            const id = this.getFocusElementPreById()?.id;
            if(id) this.doFocusElement(id);
        }
        this.triggerListener("left");
    }

    // move focus to the element/action configured as 'right' from this element
    right(): void {
        // 检查是否应该自动找到下一个可聚焦元素
        if (this._right === FocusElement.AutoFocus) {
            this.defaultFocusNext();
            // 检查是否设置基于 DOM 的下一个可聚焦元素
        } else if (this._right) {
            this.doFocusElement(this._right);
        } else {
            const id = this.getFocusElementNextById()?.id;
            if(id) this.doFocusElement(id);
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
        } else {
            const id = this.getFocusElementPreById()?.id;
            if(id) this.doFocusElement(id);
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
        } else {
            const id = this.getFocusElementNextById()?.id;
            if(id) this.doFocusElement(id);
        }
        this.triggerListener("down");
    }

    enter(): void {
        this.triggerListener("click");
    }

    /**
     * 触发监听器事件
     * @param type 触发类型
     */
    private triggerListener(type: VNodeFocusListenerType): void {
        // 检查事件方法是否绑定到组件
        if (this._listeners[type]) {
            try {
                (this.$node?.$listeners as Record<string, (id: string) => void>)[type](this.id);

            } catch (e) {
                console.log(type, e);
            }
        }
        // 更改作用域变量
        (this.$node?.$scopedSlots.default as NormalizedScopedSlot)({
            isDefault: this.isDefault,
            isFocus: this.isFocus
        })
        console.log(type);
    }
    getFocusElementNextById(node = this.$node): FocusElement | undefined {
        const parentElement = node?.$parent;
        // 如果没有父元素，或者父元素不是焦点元素
        if (!parentElement || node?.$data.name !== this.$node?.$data.name) return;
        // 过滤掉普通元素
        const focusChildrens = parentElement.$children.filter(item => item.$data.name === node?.$data.name);
        // 子节点中是否有可聚焦元素
        if (focusChildrens.length) {
            const index = focusChildrens.findIndex(item => item === node);
            if (index === focusChildrens.length - 1) {
                console.log("已经是最后一个了！");
                return this.getFocusElementNextById(parentElement);
            } else {
                /**
                 * 前一个元素索引
                 */
                 const elementIndex = index + 1;
                if (this.isParentFocusElement(focusChildrens[elementIndex])) {
                    const element = this.getParentElementChildrenFirst(focusChildrens[elementIndex]);
                    if (this.isParentFocusElement(element)) {
                        return this.getFocusElementNextById(focusChildrens[elementIndex])
                    } else {
                        return element.$data.focusElement;
                    }
                } else {
                    return focusChildrens[elementIndex].$data.focusElement;
                }
            }
        }
    }
    getFocusElementPreById(node = this.$node): FocusElement | undefined {
        const parentElement = node?.$parent;
        // 如果没有父元素，或者父元素不是焦点元素
        if (!parentElement || node?.$data.name !== this.$node?.$data.name) return;
        // 过滤掉普通元素
        const focusChildrens = parentElement.$children.filter(item => item.$data.name === node?.$data.name);
        // 子节点中是否有可聚焦元素
        if (focusChildrens.length) {
            const index = focusChildrens.findIndex(item => item === node);
            if (index === 0) {
                console.log("已经是第一个了！");
                return this.getFocusElementPreById(parentElement);
            } else {
                /**
                 * 后一个元素索引
                 */
                const elementIndex = index - 1;
                if (this.isParentFocusElement(focusChildrens[elementIndex])) {
                    const element = this.getParentElementChildrenLast(focusChildrens[elementIndex]);
                    if (this.isParentFocusElement(element)) {
                        return this.getFocusElementPreById(focusChildrens[elementIndex])
                    } else {
                        return element.$data.focusElement;
                    }
                } else {
                    return focusChildrens[elementIndex].$data.focusElement;
                }
            }
        }
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

    private isParentFocusElement(el: Vue): boolean {
        if (!el.$children.length) return false;
        for (const item of el.$children) {
            if (item.$data.name === el?.$data.name) {
                return true;
            }
            this.isParentFocusElement(item)
        }
        return false;
    }
    private getParentElementChildrenFirst(parentElement: Vue): Vue {
        const element = parentElement.$children.filter(item => item.$data.name === this.$node?.$data.name);
        if (!element.length) return parentElement;
        return this.getParentElementChildrenFirst(element[0])
    }
    private getParentElementChildrenLast(parentElement: Vue): Vue {
        const element = parentElement.$children.filter(item => item.$data.name === this.$node?.$data.name);
        if (!element.length) return parentElement;
        return this.getParentElementChildrenLast(element[element.length - 1])
    }
}
