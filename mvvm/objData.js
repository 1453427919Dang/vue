// 数组响应式
// 1.替换数组原型中的那七个方法
const arrayProto = Array.prototype 
//   备份一份，修改备份
const arrayMethods = Object.create(arrayProto);
// 数组方法
const methodsToPatch = [
    'push',
    'pop',
     'shift',
    'unshift',
    'splice',
    'reverse',
    'sort'
];
methodsToPatch.forEach(method=>{
    arrayMethods[method]=function(){
        // 原始操作
        arrayProto[method].apply(this,arguments)
        // 覆盖操作：通知更新
        console.log('数组执行'+method+'操作')

    }
})
// 对象响应式
// 获取数据
function defineReactive(obj,key,value){
  // 递归判断
  observe(value)
  Object.defineProperty(obj,key,{
    get(){
      console.log('get'+key)
      return value
    },
    set(newValue){
      if(newValue!==value){
        console.log('set'+key+newValue)
        val =newValue
      }
    },
  })
}


//observe 函数用来遍历响应的数据 遍历每个key，定义getter,setter
function observe(obj){
  if(typeof obj!=="object" || obj==null){
    return
  }

  // 判断传入的obj类型
  if(Array.isArray(obj)){
    // 覆盖原型，替换7个变更操作
    obj.__proto__=arrayMethods
    // 对数组内部的元素进行响应化
    const keys=Object.keys(obj)
    for(let i=0;i<obj.length;i++){
      observe(obj[i])
    }
  }else{
    Object.keys(obj).forEach(key=>{
      defineReactive(obj,key,obj[key])
    }) 
  }
  /* 
  Object.keys 返回一个所有元素为字符串的数组，
  其元素来自于从给定的object上面可直接枚举的属性。
  这些属性的顺序与手动遍历该对象属性时的一致。
 */
  Object.keys(obj).forEach(key=>{
    defineReactive(obj,key,obj[key])
  })
}

// 假如新增一个属性 
function set(obj,key,val) {
  defineReactive(obj,key,val)
}
// get及set是否成功调用
let student={name:'zhangsan',age:22,home:{'address':'上海'},arr:[1,2,3  ]}
defineReactive(student,'name','zhangsan')
observe(student)
student.name
student.name="刘希"
student.age
set(student,'like','喜欢你')
student.like
student.arr.push(4)