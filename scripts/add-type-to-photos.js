const fs = require('fs');
const PexelsAPI = require('pexels-api-wrapper');
const R = require('ramda');

const pexelsCLient = new PexelsAPI("563492ad6f91700001000001722565f2e3f54931a27f534c8195d6aa");

const termsArr = [
    ['about', 'team'],
    ['gallery', 'photographer'],
    ['services','service industry'],
    ['blog', 'chat'],
    ['contact', 'contact'],
    ['tours', 'tours'],
    ['conference', 'conference'],
    ['price', 'price'],
    ['work', 'office'],
    ['furniture', 'furniture'],
    ['architecture', 'architecture'],
    ['models', 'models'],
    ['wedding', 'wedding'],
    ['user', 'account computer'],
    ['support', 'support'],
    ['videos' , 'videos'],
    ['checkout', 'shop'],
    ['menu', 'menu'],
    ['web', 'web design']

]

let mainPhotos = [];
const fileName = "./all-photos.json";


const onComplete = (err)=>{
  console.log('file saved successfully.');
}

const onErr = (err)=>{
  console.log("ERROR IS ",err);
}

const saveToFile = (data) =>fs.writeFile(fileName, data, 'utf8', onComplete);

const onAllComplete = ()=>{
  const data = {
    photos: mainPhotos
  }
  saveToFile(JSON.stringify(data));

}






const callSearchItem = (arr)=> {
  let [type, searchTerm] = arr;

  const onReturnedResult = (results)=>{
    const addType = (obj)=>{
      obj['type']=type;
      return obj;
    }

    let {photos} = results;
    photos = photos.map(addType);

    mainPhotos = R.concat(mainPhotos, photos);
    if (termsArr.length>=1){
      callSearchItem(termsArr.shift());
    } else {
      onAllComplete();
    }

    return photos;
  }



  pexelsCLient.search(searchTerm, 15, 1).then(onReturnedResult).
      catch(onErr);

}

callSearchItem(termsArr.shift());