class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;

    // 把 watcher 对象记录到 Dep 类的静态属性 target
    Dep.target = this;

    this.oldValue = vm[key];

    Dep.target = null;
  }

  // 数据发生变化时更新视图
  update() {
    let newValue = this.vm[this.key];

    if (this.oldValue === newValue) {
      return;
    }

    this.cb(newValue);
  }
}
