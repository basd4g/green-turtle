const fs = require('fs')
const config = require('./md2json-config.js')
const articleIdPaths = require(config.extendsNuxtConfig)

const copyArticlePhotos = (articleIdPath) => {
  fs.readdir(`assets${articleIdPath}`, (err, files) => {
    if (err) {
      console.log(err)
      throw err
    }
    const photoFileNames = files.filter((file) => { return /.*\.(jpg|png|gif|svg)$/.test(file) })
    photoFileNames.forEach((file) => {
      const copyFrom = `assets${articleIdPath}/${file}`
      // ${config.generateDir}と${articleIdPath}の間に/がないのは正常 ${articleIdPath}が/を内包
      const copyTo = `${config.generateDir}${articleIdPath}/${file}`
      fs.copyFile(copyFrom, copyTo, (err) => {
        if (err) {
          console.log(err)
          throw err
        }
        console.log(`Copy: ${copyFrom} => ${copyTo}`)
      })
    })
  })
}

articleIdPaths.forEach((path) => {
  copyArticlePhotos(path)
})