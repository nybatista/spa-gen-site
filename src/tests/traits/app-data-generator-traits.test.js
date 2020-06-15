import {AppDataGeneratorTraits} from 'traits/app-data-generator-traits';
import {AppData} from '../mocks/app-data-mock';
import {DataSource} from '../mocks/app-data-source-mock';
import {SrcData} from '../mocks/src-data-mock';
import {Routes} from '../mocks/routes-data-mock';

const R = require('ramda');


describe('should generate content from route data', () => {

  it('should get photo label based on menu title', ()=>{
    const labels = R.path(['allPhotos', 'labels'], SrcData);
    const keyword = 'About Us';
    const photoLabel = AppDataGeneratorTraits.appDataGen$GetPhotoLabel(keyword, labels);
    expect(photoLabel).to.eq('about');

  })

  it('should return abstract label is keyword does not exist', ()=>{
    const labels = R.path(['allPhotos', 'labels'], SrcData);
    const keyword = "Googly Eyes";
    const photoLabel = AppDataGeneratorTraits.appDataGen$GetPhotoLabel(keyword, labels);
    expect(photoLabel).to.eq('abstract');
  })


  it('should select an array of photo elements based on photo label', ()=>{

    const photos = R.path(['allPhotos', 'photos'], SrcData);
    const label = 'about';

    const photosLen = photos.length;
    const photosObj = AppDataGeneratorTraits.appDataGen$SelectPhotoByLabel(label, photos);
    const updatedPhotosLen = photos.length;
    //console.log('photos arr ', photosLen,updatedPhotosLen, photosObj);
    expect(photosLen-updatedPhotosLen).to.eq(1);

  })

  it('should select random sized lorem headline ',()=>{
    const textArr = R.path(['loremIpsum','lorem'], SrcData);
    const len = textArr.length;
    const pickTextNum = Math.floor(Math.random()*len)
    const srcText = textArr[pickTextNum];

    const randomLorem = AppDataGeneratorTraits.appDataGen$CreateRandomText(srcText);

    //console.log("STR IS ",{len,pickTextNum,srcText,randomLorem},textArr);
    console.log("random lorem ",{randomLorem});

    return true;

  })






});