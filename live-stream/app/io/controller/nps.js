'use strict'
const Controller =require('egg').Controller

class NspController extends Controller{
	async test(){
		const {ctx,app}=this
		console.log(ctx)
	}
}
module.exports=NspController