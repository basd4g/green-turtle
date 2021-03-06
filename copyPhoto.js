const fs = require('fs')
const config = require('./md2json-config.js')
const articleIdPaths = require(config.extendsNuxtConfig)
const allArticles = require('./assets/allArticles.json')

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
      copy(copyFrom, copyTo)
      if (articleIdPath === `/article/${allArticles[0].id}`) {
        copy(copyFrom, `${config.generateDir}/${file}`)
      }
    })
  })
}

const copy = (copyFrom, copyTo) => {
  fs.copyFile(copyFrom, copyTo, (err) => {
    if (err) {
      console.log(err)
      throw err
    }
    console.log(`Copy: ${copyFrom} => ${copyTo}`)
  })
}

articleIdPaths.forEach((path) => {
  copyArticlePhotos(path)
})

const isExistFile = (file) => {
  try {
    fs.statSync(file)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
  }
}

const mkdirIfDirIsNotExist = (dirName, callback) => {
  if (isExistFile(dirName)) {
    callback()
    return
  }
  fs.mkdir(dirName, (e) => {
    if (e) {
      throw e
    }
    callback()
  })
}

mkdirIfDirIsNotExist(`${config.generateDir}`, () => {
  const copyToDir = `${config.generateDir}/prism`
  mkdirIfDirIsNotExist(copyToDir, () => {
    copy('static/prism/prism.js', `${copyToDir}/prism.js`)
    copy('static/prism/prism.css', `${copyToDir}/prism.css`)
  })
})
