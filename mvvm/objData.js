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
let student={name:'zhangsan',age:22,home:{'address':'上海'}}
defineReactive(student,'name','zhangsan')
observe(student)
student.name
student.name="刘希"
student.age
set(student,'like','喜欢你')
student.like