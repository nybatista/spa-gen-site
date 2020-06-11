import {SpyneTrait} from 'spyne';
import {whereEq, path, compose, pick, evolve, map, ifElse, nth, clone, reverse, omit, keys, reduceRight, toPairs, equals, merge, is, prop,filter, head} from 'ramda';

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


   static appDataGen$CreateHeadline(str){
    return `Section ${str.toUpperCase()}`;
   }

  static appDataGen$CreatePhoto(srcData){
    const photos = path(['allPhotos','photos'], srcData);
    const len = photos.length;
    const pickPhotoNum = Math.floor(Math.random()*len)
    const photo = photos[pickPhotoNum];

    return photo.src.landscape;
  }


  static appDataGen$CreateText(srcData){
    const textArr = path(['loremIpsum','lorem'], srcData);
    const len = textArr.length;
    const pickTextNum = Math.floor(Math.random()*len)
    return textArr[pickTextNum];
  }
  static appDataGen$CreateParagraph(srcData){
    const textArr = path(['loremIpsum','loremParagraphs'], srcData);
    const len = textArr.length;
    const pickTextNum = Math.floor(Math.random()*len)
    return textArr[pickTextNum];
  }




  static appDataGen$CreateDataFromRoutes(configObj=window, dataSource){
    const routesJson = path(['Spyne', 'config', 'channels', 'ROUTE', 'routes'], configObj);
    const omitProps = omit(['routeName', '^$', '404']);
    const getRouteName = prop('routeName');
    const getRouteProps = compose(omitProps);

    const srcData = this.appDataGen$GetSrcData();


    console.log("SRC DATA ",{srcData});
    const mainObj = {};

    const parseRouteConfig = (routeObj)=>{
      const {routePath} = routeObj;
      const routeName = getRouteName(routePath);
      const routeProps = getRouteProps(routePath);

      const generatePropObj = (pair)=>{
        const propObj = {
          [routeName]: pair[0],
          background:  this.appDataGen$CreatePhoto(srcData),
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