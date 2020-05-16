import {SpyneTrait} from 'spyne';
import {path, compose, omit, is, keys,values, merge} from 'ramda';
import {DynamicAppPageSubnavContainer} from 'components/01-dynamic-app/pages/dynamic-app-page-subnav-container';
import {DynamicAppPageSubnavContent} from 'components/01-dynamic-app/pages/dynamic-app-page-subnav-content';

export class DynamicAppPageTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynPage$';
    super(context, traitPrefix);

  }

 static dynPage$CheckToAddSubnavContent(routeData=this.props.data){
    const getJsonByPageId = (pageId)=>{
      return path(['Spyne','config','channels','ROUTE','routes', 'routePath', pageId], window);
    }

    const jsonObj = getJsonByPageId(routeData.pageId);

    const addSubNavContent =  is(Object, jsonObj);

    if (addSubNavContent===true){
      const subNavRouteKey = path(['routePath', 'routeName'], jsonObj);
      const subNavRouteValue =  routeData[subNavRouteKey];
      const data= merge({subNavRouteValue,subNavRouteKey}, routeData);
      console.log("FINAL DATA ",{data});
      this.appendView(new DynamicAppPageSubnavContainer({data}));
    }



    console.log("CHECKING TO ADD SUBCONTENT ", {jsonObj},routeData);

  }

}