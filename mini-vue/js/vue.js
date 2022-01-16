class Vue {
  constructor(options) {
    /**
     * 1. 通过【实例属性】保存 options 中传入的数据
     * 2. 把 data 中的成员转换成 getter/setter，注入到 vue 实例中，
     *    在 proxyData 中实现
     * 3. 调用 observer 对象，监听数据的变化
     * 4. 调用 compiler 对象，解析指令和插值表达式
     */

    this.$options = options || {};
    this.$data = options.data || {};
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;

    this._proxyData(this.$data);
  }

  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (data[key] === newValue) {
            return;
          }

          data[key] = newValue;
        },
      });
    });
  }
}
