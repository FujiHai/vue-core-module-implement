class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }

  // 编译模板，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes;

    Array.from(childNodes).forEach((node) => {
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        this.compileElement(node);
      }

      // 如果有子节点，递归调用 compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }

  // 编译元素结点，处理指令
  compileElement(node) {
    console.log("node attr: ", node.attributes);

    // 遍历所有属性结点，判断是否为指令
    Array.from(node.attributes).forEach((attr) => {
      // 判断是否是指令
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        // 将 v-text 变成 text
        attrName = attrName.substr(2);
        let key = attr.value;
        // debugger;
        this.update(node, key, attrName);
      }
    });
  }

  update(node, key, attrName) {
    let updateFn = this[`${attrName}Updater`];
    if (updateFn) {
      updateFn(node, this.vm[key]);
    }
  }

  // v-text 指令处理函数，node 为操作结点, value 为绑定数据
  textUpdater(node, value) {
    node.textContent = value;
  }

  // v-model 指令处理函数
  modelUpdater(node, value) {
    node.value = value;
  }

  // 编译文本节点，处理差值表达式
  compileText(node) {
    // console.dir(node);

    let reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);
    }
  }

  // 判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }

  // 判断节点是否为文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }

  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
