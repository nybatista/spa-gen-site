import {SpyneTrait} from 'spyne';
import {path, compose, omit, defaultTo, is, keys,values, merge} from 'ramda';
import {DynamicAppPageSubnavContainer} from 'components/01-dynamic-app/pages/dynamic-app-page-subnav-container';
import {DynamicAppPageSubnavContent} from 'components/01-dynamic-app/pages/dynamic-app-page-subnav-content';
import {PageContentHomeView} from 'components/01-dynamic-app/pages/page-types/page-content-home-view';
import {PageContentDefaultView} from 'components/01-dynamic-app/pages/page-types/page-content-default-view';
import {PageSecondaryTopicView} from 'components/01-dynamic-app/pages/page-secondary-topic-view';

export class DynamicAppPageTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynPage$';
    super(context, traitPrefix);

  }


  static dynPage$GetPageClassById(pageId){
    const defaultToClass = defaultTo(PageContentDefaultView);

    const classHashObj = {
      home: PageContentHomeView
     }
     return defaultToClass(classHashObj[pageId]);
  }

  static dynPage$AddPageContent(pageId){

    const PageContentClass = this.dynPage$GetPageClassById(pageId);
    this.appendView(new PageContentClass({pageId, pageData: this.props.data}));

    //console.log("PAGE ID IS ",{pageId,PageContentClass});
  }

  static dynPage$GetSubTopicData(routeData=this.props.data){
    const getJsonByPageId = (pageId)=>{
      return path(['Spyne','config','channels','ROUTE','routes', 'routePath', pageId], window);
    }
    const routes = getJsonByPageId(routeData.pageId);
    const pageTopicKey = path(['routePath', 'routeName'], routes);
    const pageTopicVal = routeData[pageTopicKey];

    return {routes, pageTopicKey, pageTopicVal};

  }

  static dynPage$CheckToAddSecondaryTopicPage(data=this.props.subTopicData){
    //subTopicData needs {pageId, pageTopicKey, pageTopicVal};


    if (data.pageTopicVal!==undefined){
      this.appendView(new PageSecondaryTopicView({data}) );

    }


  }


 static dynPage$CheckToAddSubnavContent(routeData=this.props.data){
    const getJsonByPageId = (pageId)=>{
      return path(['Spyne','config','channels','ROUTE','routes', 'routePath', pageId], window);
    }

    const routes = getJsonByPageId(routeData.pageId);

    const addSubNavContent =  is(Object, routes);

    if (addSubNavContent===true){
      const subNavRouteKey = path(['routePath', 'routeName'], routes);
      const subNavRouteValue =  routeData[subNavRouteKey];
      const data= merge({subNavRouteValue,subNavRouteKey}, routeData);
      //console.log("FINAL DATA ",{data});
      this.appendView(new DynamicAppPageSubnavContainer({data,routes}), '.page-content');
    }



    //console.log("CHECKING TO ADD SUBCONTENT ", {routes},routeData);

    return {routes};

  }

}