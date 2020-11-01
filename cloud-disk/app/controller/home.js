'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, world';
  }
  async list(){
	  this.ctx.body={
		  msg:"ok",
		  data:[
			  {
				  name:"微服务",
				  price:100,
			  },
			  {
				  name:"Java",
				  price:88,
			  },{
				  name:"JavaScript",
				  price:77,
			  }
		  ]
	  }
  }
}

module.exports = HomeController;

