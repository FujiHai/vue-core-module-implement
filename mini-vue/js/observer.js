class Observer {
  constructor(data) {
    this.walk(data);
  }

  // 遍历 data 中的所有属性，对每个属性调用 defineReactive
  walk(data) {
    /**
     *  1. 判断 data 是否是对象
     *  2. 遍历 data 对象的所有属性
     * */

    if (!data || typeof data !== "object") {
      return;
    }

    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }

  // 将 data 中的属性转换成 getter/setter
  defineReactive(obj, key, value) {
    let that = this;
    // 负责收集依赖，并发送通知
    let dep = new Dep();
    // value 为对象，将 value 中的属性设置为响应式
    this.walk(value);

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set(newValue) {
        if (value === newValue) {
          return;
        }

        value = newValue;

        // 属性设置为对象时，也转换成响应式
        that.walk(value);
        // 发送通知
        dep.notify();
      },
    });
  }
}
