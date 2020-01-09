// 编译器
// 递归遍历dom树
// 判断节点类型，如果是文本，则判断是否是插值绑定
// 如果是元素，则遍历其属性判断时候是指令或事件，然后递归子元素 
class compile{
  constructor(el,vm){
    this.$vm = vm;
    // 返回与指定id匹配的第一个元素
    this.$el=document.querySelector(el); 
    if(this.$el){
      // 存在则执行编译
      this.compile(this.$el)
    } 
  }

  compile(el){
    // =遍历el树
    const childNodes =el.childNodes;
    Array.from(childNodes).forEach(node=>{
      // 判断是否是元素
      // debugger
      if(this.isElement(node)){
        this.compileElement(node)
      }else if(this.isInter(node)){
        this.compileText(node)
      }
      // 递归子节点 
      if(node.childNodes && node.childNodes.length>0){
        this.compile(node)
      }
    })
  }

isElement(node) {
    return node.nodeType===1
 }

 isInter(node){
  //  debugger
  //  首先判断是文本标签 ，其次内容是{{xxx}}
  return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  //  return node.nodeType===3 && /\{\{(.*)}\}\}/.test(node.textContent)
 }

compileText(node){
  // debugger
  this.update(node,RegExp.$1,'text')
  // this.update(node, RegExp.$1, 'text')
}

//  元素编译 
compileElement(node){
  //  节点是元素
  // 遍历其属性列表
  const nodeAttrs = node.attributes
  Array.from(nodeAttrs).forEach(attr=>{
    // 规定指令以k-xx="oo"定义
    const attrName = attr.name 
    const exp = attr.value 
    if(this.isDirective(attrName)){
      const dir = attrName.substring(2)
      // if(dir=="click"){
      //   clickUpdater(node,attr)
      // }
      this[dir] && this[dir](node,exp)
    }

    // 事件处理
    if(this.isEvent(attrName)){
      const dir = attrName.substring(1)
      // 事件监听
      this.eventHandler(node,exp,dir)
    }
  })
 }

 isDirective(attr){
   return attr.indexOf('k-')===0
 }

 
 //  更新函数作用 
 // 1、初始化
 // 2、创建watcher实列
 update(node,exp,dir){
   const fn = this[dir + 'Updater']
   fn && fn(node,this.$vm[exp])
   
   // 更新处理，封装一个更新函数，可以更新对应的dom元素
   new Watcher(this.$vm,exp,function(val){
     fn && fn(node,val)
    })
  }
  
  text(node,exp){
    this.update(node,exp,'text')
  }
  textUpdater(node,value){
    node.textContent = value
  }
  
  // k-html
  html(node, exp) {
    this.update(node, exp, 'html')
  }

  htmlUpdater(node, value) {
    node.innerHTML = value
  }
  // 事假函数
  click(node,exp){
    this.update(node, exp, 'click')
  }
  clickUpdater(node,value){
    node.outerHTML =node.outerHTML.replace('k-','on')
  }
  // k-model

  model(node, exp) {
    this.update(node, exp, 'model')

    // 事件监听
    node.addEventListener('input',e=>{
      this.$vm[exp] = e.target.value
    })
  }
  modelUpdater(node,value){
    node.value = value
  }

  // @方法
  isEvent(dir){
    return dir.indexOf('@')==0
  }

  eventHandler(node,exp,dir){
    debugger
    const fn=this.$vm.$options.methods && this.$vm.$options.methods[exp]
    node.addEventListener(dir,fn.bind(this.$vm))
  }
}

