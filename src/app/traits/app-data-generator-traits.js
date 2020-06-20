import {SpyneTrait} from 'spyne';
import {LocalStorageTraits} from 'traits/local-storage-traits';
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


   static appDataGen$ResetTitleToDefault(props=this.props){
    const {titleType} = props;
    const defaults = LocalStorageTraits.localStorage$GetStoreObj('defaults');
    const defaultValue = defaults[titleType];
    props.el.value = defaultValue;

    LocalStorageTraits.localStorage$SetStoreObjAndUpdate(titleType, defaultValue);

   }


   static appDataGen$SaveInputValue(props=this.props){
     const {titleType} = props;
     const value = props.el.value;

     LocalStorageTraits.localStorage$SetStoreObjAndUpdate(titleType, value);

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

  static appDataGen$CreatePhoto(srcData, key, parentLabel){
    const labels = R.path(['allPhotos', 'labels'], srcData);
    const photos = path(['allPhotos','photos'], srcData);
    let photoLabel = this.appDataGen$GetPhotoLabel(key, labels);
    if (photoLabel === 'abstract' && parentLabel!==undefined){
      photoLabel = this.appDataGen$GetPhotoLabel(parentLabel, labels);
    }

    const photoObj = this.appDataGen$SelectPhotoByLabel(photoLabel, photos);

/*
    const len = photos.length;
    const pickPhotoNum = Math.floor(Math.random()*len)
    const photo = photos[pickPhotoNum];*/

    return photoObj.src.landscape;
  }


  static appDataGen$CreateHeadline(str){
    return `${str.toUpperCase()} PAGE CONTENT`;
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


    //console.log("SRC DATA ",{srcData});
    const mainObj = {};

    const parseRouteConfig = (routeObj, parentLabel)=>{
      const {routePath} = routeObj;
      const routeName = getRouteName(routePath);
      const routeProps = getRouteProps(routePath);

      const generatePropObj = (pair)=>{
        //console.log("PARENT LABEL ",{parentLabel});
        const propObj = {
          [routeName]: pair[0],
          background:  this.appDataGen$CreatePhoto(srcData, pair[0], parentLabel),
          headline: AppDataGeneratorTraits.appDataGen$CreateHeadline(pair[0]),
          text: AppDataGeneratorTraits.appDataGen$CreateText(srcData),
          keyword: pair[0],
          article: AppDataGeneratorTraits.appDataGen$CreateParagraph(srcData)
        }




        if (is(Object, pair[1])){
          propObj['content'] = parseRouteConfig(pair[1], pair[0]);
        }
         return propObj;
      }
      return compose(map(generatePropObj), toPairs)(routeProps);
    }



    mainObj['content'] = parseRouteConfig(routesJson);



     return mainObj;

  }



}