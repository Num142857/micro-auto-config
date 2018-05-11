const chokidar = require('chokidar');
const fs = require('fs');
const fse = require('fs-extra');
const PROJECT_PATH = '.'
console.log('配置自动化已经启动')
//监听文件变化
chokidar.watch(PROJECT_PATH, {
    ignored: /(^|[\/\\])\..|.git|project.config.js|node_modules/,
    awaitWriteFinish: {
        pollInterval: 20000
    }
}).on('all', (event, path) => {
    console.log(event, path);
    let config = generateConfig(PROJECT_PATH,[]) 
    fs.writeFileSync(`${PROJECT_PATH}/project.config.js`, `module.exports={projects:${JSON.stringify(config)}}`, {
        encoding: 'utf-8'
      });
    console.log('配置文件已经重新生成',config)
}); 

// 生成配置文件
function generateConfig(path, config) {
    var files = fs.readdirSync(path);
    files.forEach((element)=>{
      var stat = fs.statSync(path + '/' + element);
      if (stat.isDirectory()) {
        //递归读取文件
        let json = fse.readJsonSync(path + '/' + element + '/project.json',{ throws: false });
        if(json){ config.push(json); }
      }
    })
    return config;
  }