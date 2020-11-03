'use strict';

const SMSClient = require('@alicloud/sms-sdk');

const config = {
  AccessKeyId:'LTAI4G3rkARQwiGGkprRZwGm',  // 访问密钥编号
  AccessKeySecret: 'Okx5ZZrlOveWo6WzQR3tHtCrDx5Mdq' // 密钥
};

// 签名模板
const sign = {
  REG_CODE: {
    SignName: '签名', // 签名
    TemplateCode: '模板', // 模板
  },
};

/**
 * 阿里云短信发送类
 */
class AliSmsService{  

  /**
   * 短信发送接口
   * @param {*} phone 发送手机号
   * @param {*} code 验证码
   */
  async sendCode(phone, code) {

    const { ctx } = this;

    const signCode = sign[code];
    const codeRandom = ctx.helper.randomInt(100000, 999999); // 标注2：随机数生成方法，自己写一个即可
    const templateParam = JSON.stringify({ code: codeRandom.toString() });

    const accessKeyId = config.AccessKeyId;
    const secretAccessKey = config.AccessKeySecret;
    const smsClient = new SMSClient({ accessKeyId, secretAccessKey }); // 实例化SDK

    const params = {
      PhoneNumbers: phone,
      SignName: signCode.SignName,
      TemplateCode: signCode.TemplateCode,
      TemplateParam: templateParam,
    };

    try {
      const rs = await this.sendSms(smsClient, params);
      if (rs.Code === 'OK') {
        return { code: codeRandom, sta: 1 };
      }
      return { msg: '操作失败', sta: -1 };

    } catch (err) {

      if (err.data.Code === 'isv.BUSINESS_LIMIT_CONTROL') { // 短信限制
        return { msg: err.data.Message.match(/(\S*)Permits/)[1], sta: 0 };
      }
      return { msg: '操作失败', sta: -1 };
    }

  }

  /**
   * 发送短信
   * @param {*} smsClient SDK实例
   * @param {*} params 参数信息
   */
  async sendSms(smsClient, params) {
    return new Promise((resolve, reject) => {
      smsClient.sendSMS(params).then(result => {
        resolve(result);
      }, ex => {
        reject(ex);
      });
    });
  }
}

module.exports = AliSmsService;

