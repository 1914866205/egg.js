'use strict'

const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')
//故名思意 异步二进制 写入流
const awaitWriteStream = require('await-stream-ready').write
//管道读入一个虫洞。
const sendToWormhole = require('stream-wormhole')
const dayjs = require('dayjs')
class CommonController extends Controller {
  // 上传图片
  async upload() {
    const stream = await this.ctx.getFileStream()
    // 基础的目录
    const uploadBasePath = 'app/public/uploads'
    // 生成文件名
    const filename = `${Date.now()}${Number.parseInt(
      Math.random() * 1000
    )}${path.extname(stream.filename).toLocaleLowerCase()}`
    // 生成文件夹
    const dirname = dayjs(Date.now()).format('YYYY/MM/DD')
    function mkdirsSync(dirname) {
      if (fs.existsSync(dirname)) {
        return true
      } else {
        if (mkdirsSync(path.dirname(dirname))) {
          fs.mkdirSync(dirname)
          return true
        }
      }
    }
    mkdirsSync(path.join(uploadBasePath, dirname))
    // 生成写入路径
    const target = path.join(uploadBasePath, dirname, filename)
    // 写入流
    const writeStream = fs.createWriteStream(target)
    try {
      //异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream))
    } catch (err) {
      //如果出现错误，关闭管道
      await sendToWormhole(stream)
      this.ctx.throw(500, err)
    }
    const { protocol, host } = this.ctx.request
    let url = path
      .join('/public/uploads', dirname, filename)
	  // 转义 |
      .replace(/\\|\//g, '/')
    this.ctx.apiSuccess({ url })
  }
}

module.exports = CommonController