'use strict'
const Service = require('egg').Service

class CacheService extends Service{
	/**
	 * 获取列表
	 * key 键
	 * isChildObject 元素是否为对象
	 * 返回数组
	 */
	async getList(key,isChildObject =false){
		const {redis}=this.app;
		let data=await redis.lrange(key,0,-1);
		if(isChildObject){
			data=data.map((item)=>{
				return JSON.parse(item)
			})
		}
		return data
	}
	
	
	/**
	 * 设置列表
	 * key 键
	 * value 值
	 * type 类型  push和unshift
	 * expir 过期时间 单位秒
	 */
  async setList(key, value, type = 'push', expir = 0) {
    const { redis } = this.app
    if (expir > 0) {
      await redis.expire(key, expir)
    }
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    if (type === 'push') {
      return await redis.rpush(key, value)
    }
    return await redis.lpush(key, value)
  }
	
	
	
	
	
	
	
	
	/**
	 * 设置redis缓存
	 * key 键
	 * value 值
	 * expir 过期时间 单位秒
	 * 
	 */
	async set(key,value,expir=0){
		const {redis}=this.app
		if(expir===0){
			return await redis.set(key,JSON.stringify(value))
		}
		return await redis.set(key,JSON.stringify(value),'EX',expir)
	}
	
	
	/**
	 * 获取redis缓存
	 */
	async get(key){
		const {redis}=this.app
		const result =await redis.get(key)
		return JSON.parse(result)
	}
	
	
	
	/**
	 * redis自增
	 */
	async incr(key,number=1){
		const{redis}=this.app
		if(number===1){
			return await redis.incr(key)
		}
		return await redis.incrby(key,number)
	}
	
	
	/**
	 * 查询长度
	 */
	async strlen(key){
		const {redis} =this.app
		return await redis.strlen(key)
	}
	
	
	/**
	 * 删除指定key
	 */
	async remove(key){
		const {redis}=this.app;
		return await redis.del(key)
	}
	
	/**
	 * 清空缓存
	 */
	async clear(){
		return await this.app.redis.flushall()
	}
}

module.exports=CacheService