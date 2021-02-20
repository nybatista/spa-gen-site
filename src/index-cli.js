#! /usr/bin/env node

const fse = require('fs-extra');
const path = require('path');
const args = process.argv;

const methodStr = args.length>=3 ? args[2] : 'empty';
//console.log(method,args.length, args);
const undefinedFn = async ()=>console.log('params are undefined.');
const defaultFn = async ()=>console.log('method param is empty.');



const emptyTempDir = async()=>{

  const dir = './src/tmp/'
  fse.emptyDir(dir, err => {
    if (err) return console.error('temp dir not cleared because ',e)
    console.log('tmp dir cleared successfully!')
  })



}


const updateBaseApp = async()=>{
  const onSrcCopiedOver = async()=>{
    console.log('src has been copied in spa gen site ');
  }

  const currentDir = process.cwd();
  const pathObj = path.parse(currentDir);
  const {dir} = pathObj;
  const baseAppSrc = path.join(dir, '/base-app/src');
  const baseAppDest =  path.resolve('./src/base-app/src');

  //console.log("PAThS ",{baseAppSrc, baseAppDest, currentDir, pathObj})

  try {
    fse.copySync(baseAppSrc, baseAppDest);
  } catch(e){
    console.warn('updateBaseApp: ',e)
  }
  await onSrcCopiedOver();

}


const updateLocalTmp = async()=>{

  const currentDir = process.cwd();
  const pathObj = path.parse(currentDir);
  const {dir} = pathObj;
  const localTmpSrc = path.join(dir, '/spyne-app-generator/src/tmp/localtmp/src/')
  const localTmpDest = path.join(dir, '/spa-gen-localtmp/src/')
  const pathExists = await fse.pathExists(localTmpSrc);
  //const baseAppSrc = path.join(dir, '/base-app/src');
  try {
    fse.copySync(localTmpSrc, localTmpDest);
  } catch(e){
    console.warn('updateLocalTmp: ',e)
  }

  console.log('local tmp copied!')

  //console.log('local temp ', {currentDir, pathObj, dir, localTmpSrc, pathExists})


}





const methodHash = {
  empty: defaultFn,
  updateBaseApp: updateBaseApp,
  updateLocalTmp: updateLocalTmp,
  emptyTempDir: emptyTempDir,
}


const methodFn = methodHash[methodStr] || undefinedFn;

methodFn();
