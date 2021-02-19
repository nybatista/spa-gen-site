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








const methodHash = {
  empty: defaultFn,
  updateBaseApp: updateBaseApp,
  emptyTempDir: emptyTempDir,
}


const methodFn = methodHash[methodStr] || undefinedFn;

methodFn();
