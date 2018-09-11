'use strict'

const path = require('path')

const qiniu = require('qiniu')
const ora = require('ora')
const is = require('is_js')

const progress = (uploaded, total) => {
  return `Uploading to Qiniu: ${uploaded}/${total} files uploaded`
}

class QiniuPlugin {
  constructor (options = {}) {
    this.qiniuConfig = new qiniu.conf.Config()

    this.accessKey = options.accessKey
    this.secretKey = options.secretKey

    this.exclude = is.regexp(options.exclude) && options.exclude
    this.include = is.regexp(options.include) && options.include
    this.uploadPath = options.path

    this.batch = options.batch || 20

    this.bucket = options.bucket
    let zone = qiniu.zone[options.zone]
    if (zone) {
      this.qiniuConfig.zone = zone
    }
  }

  apply (compiler) {
    const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
    const qiniuConfig = this.qiniuConfig

    compiler.hooks.afterEmit.tap('after-emit', (compilation) => {
      let assets = compilation.assets
      let filesNames = Object.keys(assets)
      let totalFiles = 0
      let uploadedFiles = 0

      let finish = () => {
        spinner.succeed()
        console.log('\n')
      }

      filesNames = filesNames.filter(fileName => {
        let file = assets[fileName] || {}

        if (!file.emitted) {
          return false
        }
        if (this.exclude && this.exclude.test(fileName)) {
          return false
        }
        if (this.include) {
          return this.include.test(fileName)
        }
        return true
      })

      totalFiles = filesNames.length

      let spinner = ora({
        text: progress(0, totalFiles),
        color: 'green'
      }).start()

      const performUpload = fileName => {
        let file = assets[fileName] || {}
        let key = path.posix.join(this.uploadPath, fileName)
        let putPolicy = new qiniu.rs.PutPolicy({
          scope: this.bucket + ':' + key
        })
        let uploadToken = putPolicy.uploadToken(mac)
        let formUploader = new qiniu.form_up.FormUploader(qiniuConfig)
        let putExtra = new qiniu.form_up.PutExtra()

        return new Promise((resolve, reject) => {
          let begin = Date.now()
          formUploader.putFile(uploadToken, key, file.existsAt, putExtra, function (err, body) {
            uploadedFiles++
            spinner.text = progress(uploadedFiles, totalFiles)

            if (err) {
              return reject(err)
            }
            body.duration = Date.now() - begin
            resolve(body)
          })
        })
      }

      const execStack = err => {
        if (err) {
          console.log('\n')
          return Promise.reject(err)
        }

        let files = filesNames.splice(0, this.batch)

        if (files.length) {
          return Promise.all(
            files.map(performUpload)
          ).then(() => execStack(), execStack)
        } else {
          return Promise.resolve()
        }
      }

      execStack().then(() => finish(), finish)
    })
  }
}

module.exports = QiniuPlugin
