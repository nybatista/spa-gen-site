import {ViewStream} from 'spyne';
//import hljs from 'highlight.js/lib/core';
//import javascript from 'highlight.js/lib/languages/javascript';
import {RouteCreatorToDataTraits} from 'traits/route-creator-to-data-traits';
import {LocalStorageTraits} from 'traits/local-storage-traits';

export class RouteJsonViewer extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'article';
    props.id = 'route-json-viewer';
    const code =  RouteJsonViewer.getTestRouteObj();
   // hljs.registerLanguage('javascript', javascript);
   // hljs.initHighlightingOnLoad()
    const html = code;// Prism.highlight(code, Prism.languages.javascript, 'javascript');
    props.data = {code,html};
    props.traits=[RouteCreatorToDataTraits];
    props.template = require('./templates/route-json-view.tmpl.html');

    props.class ='customize-panel';

    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_ROUTE_CREATOR_GENERATE_DEFAULT_JSON_EVENT', 'onResetDefaultJson'],
      ["CHANNEL_ROUTE_CREATOR_GENERATE_JSON_EVENT", 'onGenerateJson'],
      ['CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT', 'onStartJson']

    ];
  }

  onResetDefaultJson(e){
    const routes = this.routeCreatorToData$GenerateJSON(true);
    this.updateRouteChannel(routes);

   // console.log("RESET DEFAULT JSON -- REMOVE BAR HOLDERS ",e);

  }


  onStartJson(e){
    const delay = ()=> this.routeCreatorToData$GenerateJSON();
    this.setTimeout(delay, 100);

  }

  onGenerateJson(e){
    const routes = this.routeCreatorToData$GenerateJSON();
    this.updateRouteChannel(routes);
  }




  updateRouteChannel(routes){
    const action = 'CHANNEL_ROUTE_UPDATE_CONFIG_EVENT';
    this.sendInfoToChannel("CHANNEL_ROUTE", {action,routes}, action);
  }


  static getTestRouteObj(){
    const obj = {
      "routes": {
        "routePath": {
          "routeName": "pageId",
          "home1": "home",
          "work": {
            "routePath": {
              "routeName": "workId",
              "acme": "acme",
              "widgets": "widgets",
              "globex": "globex"
            }
          },
          "about": {
            "routePath": {
              "routeName": "aboutId",
              "contact": "contact"
            }
          },
          "404" : ".*"
        }
      }
    }

    return JSON.stringify(obj,null,4);


  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        ['.btn-blue', 'click']
    ];
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE_CREATOR");

  }

}
