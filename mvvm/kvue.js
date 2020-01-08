// 获取数据
function defineReactive(obj,key,value){
  // debugger
  // 递归判断
  observe(value)
  // 创建一个Dep和当前key一一对应
  const dep = new Dep()
  Object.defineProperty(obj,key,{
    get(){
      console.log('get'+key)
      Dep.target && dep.addDep(Dep.target)
      return value
    },
    set(newValue){
      if(newValue!==value){
        console.log('set'+key+newValue)
        // 如果传入的newValue依然是obj，需要做响应化处理
        observe(newValue)
        value =newValue
        dep.notify()
      }
    },
  })
}


//observe 函数用来遍历响应的数据 遍历每个key，定义getter,setter
function observe(obj){
  if(typeof obj!=="object" || obj==null){
    return
  }
  /* 
  Object.keys 返回一个所有元素为字符串的数组，
  其元素来自于从给定的object上面可直接枚举的属性。
  这些属性的顺序与手动遍历该对象属性时的一致。
 */
  // Object.keys(obj).forEach(key=>{
  //   defineReactive(obj,key,obj[key])
  // })
  // 创建observer实列
  new Observe(obj)
}


// 创建KVue构造函数

class KVue{
  constructor(options){
    // 保存选项
    this.$options = options;
    this.$data = options.data;

    //响应化处理
    observe(this.$data)

    // 代理
    proxy(this,'$data')

    // 创建编译器 
    new compile(options.el,this)
  }
}

// 代理函数 ，方便用户直接访问$data中的数据

function proxy(vm,sourcekey){
  Object.keys(vm[sourcekey]).forEach(key=>{
    Object.defineProperty(vm,key,{
      get(){
        return vm[sourcekey][key]
      },
      set(newValue){
         vm[sourcekey][key]=newValue;
      }
    })
  })
}

// 根据对象类型决定如何做相应话
class Observe{
  constructor(value){
    this.value= value
    // 判断其类型
    if(typeof value==='object'){
      this.walk(value)
    }
  }
  
  // 对象数据响应化
  walk(obj){
    Object.keys(obj).forEach(key=>{
      defineReactive(obj,key,obj[key])
    })
  }
}


//观察者：保存更新函数，值发生变化调用更新函数

class Watcher {
  constructor(vm,key,updateFn){
    this.vm = vm
    this.key = key
    this.updateFn = updateFn
    // Dep.target 静态属性上设置为当前watcher实列
    Dep.target = this
    this.vm[this.key] 
    Dep.target = null //收集完就置空
  }

  update(){
    this.updateFn.call(this.vm,this.vm[this.key])  //.call改变this的指向问题
  }
}

// Dep:依赖，管理某个KEY相关的所有watcher实列

class Dep{
  constructor(){
    this.deps=[]
  }

  addDep(dep){
    this.deps.push(dep)
  }

  notify(){
    this.deps.forEach(dep=>dep.update())
  }
}