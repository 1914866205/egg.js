'use strict'
const Service = require('egg').Service
const SMSClient = require('@alicloud/sms-sdk')
const await = require('await-stream-ready/lib/await')


const config = {
	AccessKeyId: 'LTAI4G3rkARQwiGGkprRZwGm', // 访问密钥编号
	AccessKeySecret: 'Okx5ZZrlOveWo6WzQR3tHtCrDx5Mdq' // 密钥
};

// 签名模板，注意修改
const sign = {
	REG_CODE: {
		SignName: '智慧园区',
		TemplateCode: 'SMS_190277609',
	},
}

/**
 * 阿里云短信发送类
 */
class SmsService extends Service {
	/**
	 * 短信发送接口
	 * @param {*} phone 发送手机号
	 * @param {*} code 验证码
	 */
	async sendCode(phone) {
		const {
			ctx,
			service
		} = this


		const signCode = sign.REG_CODE
		// 标注2：随机数生成方法
		const codeRandom = Math.random().toFixed(6).slice(-6)
		const templateParam = JSON.stringify({
			code: codeRandom.toString()
		})
		//存储验证码
		service.cache.set('code', codeRandom, 60 * 5)
		console.log("验证码" + service.cache.get('code'))
		const accessKeyId = config.AccessKeyId
		const secretAccessKey = config.AccessKeySecret
		const smsClient = new SMSClient({
			accessKeyId,
			secretAccessKey
		})


		// 实例化SDK
		const params = {
			//手机号
			PhoneNumbers: phone,
			//签名
			SignName: signCode.SignName,
			//模板手机号
			TemplateCode: signCode.TemplateCode,
			//验证码
			TemplateParam: templateParam,
		}


		try {
			
			console.log("++++++++++")
			const rs = await this.sendSms(smsClient, params)
			console.log("----------")
			console.log("rs>>>>>>>" + rs)
			console.log("rscode>>>>>>>" + rs.Code)
			if (rs.Code === 'OK') {
				return {
					code: codeRandom,
					sta: 1
				}
			}
			return {
				msg: '操作失败',
				sta: -1
			}
		} catch (err) {
			if (err.data.Code === 'isv.BUSINESS_LIMIT_CONTROL') {
				console.log("err.data.Code>>>" + err.data.Code)
				// 短信限制
				return {
					msg: err.data.Message.match(/(\S*)Permits/)[1],
					sta: 0
				}
			}
			console.log("出错>>>>>>>")
			return {
				msg: '操作失败',
				sta: -1
			}
		}
	}


	/**
	 * 发送短信
	 * @param {*} smsClient SDK实例
	 * @param {*} params 参数信息
	 */
	async sendSms(smsClient, params) {
		
		console.log("进入发送短信的方法")
		console.log("sms"+smsClient.toString())
		console.log("params"+params.toString())
		return new Promise((resolve, reject) => {
			smsClient.sendSMS(params).then(
				(result) => {
					console.log("result-----"+result),
					resolve(result)
				},
				(ex) => {
					console.log("ex-----"+ex),
					reject(ex)
				}
			)
		})
	}
}

module.exports = SmsService
