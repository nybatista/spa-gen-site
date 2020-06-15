import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, evolve, map, find, reduce, ifElse, contains, findIndex, nth, clone, reverse, omit, keys, reduceRight, toPairs, equals, merge,propEq, is, prop,filter, head} from 'ramda';
import {SrcData} from '../../tests/mocks/src-data-mock';

export class AppDataGeneratorTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'appDataGen$';
    super(context, traitPrefix);

  }

  static appDataGen$GetMainPropVals(key, data){
   // console.log("KEY AND DATA ", {key, data})
    const transformations = {

    }
    return {};

  }


   static appDataGen$GetSrcData(){
    const key = window.Spyne.config.localStorageKey;
    const {srcData} = window[key];
    return clone(srcData);
   }




  static appDataGen$GetPhotoLabel(key, d){
    const keyword = String(key).toLowerCase();
    const containsKeywordFn = arrPair => arrPair[1].indexOf(keyword)>=0;
    const getLabel = compose(nth(0));
    const dataReducer = (acc, arrPair)=>{
      if (containsKeywordFn(arrPair)){
       acc = arrPair[0];
      }
      return acc;
    }
    const reduceLabelsFn = compose(reduce( dataReducer, "abstract"), toPairs);
    return reduceLabelsFn(d);
  }


  static appDataGen$SelectPhotoByLabel(label, data){
    const filterByLabel = compose(filter(propEq('type', label)))
    const filterAbstract = compose(filter(propEq('type', 'abstract')))
    const findPhotoIndexFn = o=>compose(findIndex(propEq('id', o.id)));
    let photosArr = filterByLabel(data);
    if (photosArr.length===0){
      photosArr = filterAbstract(data);
    }
    const len = photosArr.length;

    const randomPhotoIndexNum = Math.floor(Math.random()*len);
    const photoObj = photosArr[randomPhotoIndexNum];

    //console.log("label data ",{label, data, randomPhotoIndexNum,photosArr, photoObj});

    const getPhotoIndexFn = findPhotoIndexFn(photoObj);
    const mainPhotoArrIndex = getPhotoIndexFn(data);
    return data.splice(mainPhotoArrIndex, 1)[0];
  }

  static appDataGen$CreatePhoto(srcData, key){
    const labels = R.path(['allPhotos', 'labels'], srcData);
    const photos = path(['allPhotos','photos'], srcData);
    const photoLabel = this.appDataGen$GetPhotoLabel(key, labels);
    const photoObj = this.appDataGen$SelectPhotoByLabel(photoLabel, photos);

/*
    const len = photos.length;
    const pickPhotoNum = Math.floor(Math.random()*len)
    const photo = photos[pickPhotoNum];*/

    return photoObj.src.landscape;
  }


  static appDataGen$CreateHeadline(str){
    return `Section ${str.toUpperCase()}`;
  }


  static appDataGen$CreateRandomText(srcStr, min=5, max=9){
      const range = max-min;
      const num = min+(Math.floor(Math.random()*range));
      const fn = (searchText)=>searchText.replace(/^((?:\S+\s+\n?){4})([^\0]*)$/g, "$1")
      return fn(srcStr);

  }


  static appDataGen$CreateText(srcData){
    const textArr = path(['loremIpsum','lorem'], srcData);
    const len = textArr.length;
    const pickTextNum = Math.floor(Math.random()*len)
    //return textArr[pickTextNum];
    return this.appDataGen$CreateRandomText(textArr[pickTextNum]);
  }
  static appDataGen$CreateParagraph(srcData){
    const textArr = path(['loremIpsum','loremParagraphs'], srcData);
    const len = textArr.length;
    const pickTextNum = Math.floor(Math.random()*len)
    return textArr[pickTextNum];
  }




  static appDataGen$CreateDataFromRoutes(configObj=window, dataSource, srcData=this.appDataGen$GetSrcData()){
    const routesJson = path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
    const omitProps = omit(['routeName', '^$', '404']);
    const getRouteName = prop('routeName');
    const getRouteProps = compose(omitProps);

    //const srcData = this.appDataGen$GetSrcData();


    console.log("SRC DATA ",{srcData});
    const mainObj = {};

    const parseRouteConfig = (routeObj)=>{
      const {routePath} = routeObj;
      const routeName = getRouteName(routePath);
      const routeProps = getRouteProps(routePath);

      const generatePropObj = (pair)=>{
        const propObj = {
          [routeName]: pair[0],
          background:  this.appDataGen$CreatePhoto(srcData, pair[0]),
          headline: AppDataGeneratorTraits.appDataGen$CreateHeadline(pair[0]),
          text: AppDataGeneratorTraits.appDataGen$CreateText(srcData),
          article: AppDataGeneratorTraits.appDataGen$CreateParagraph(srcData)
        }

        const propsObj = AppDataGeneratorTraits.appDataGen$GetMainPropVals(pair[0], dataSource);



        if (is(Object, pair[1])){
          propObj['content'] = parseRouteConfig(pair[1]);
        }
         return propObj;
      }
      return compose(map(generatePropObj), toPairs)(routeProps);
    }



    mainObj['content'] = parseRouteConfig(routesJson);



     return mainObj;

  }



}