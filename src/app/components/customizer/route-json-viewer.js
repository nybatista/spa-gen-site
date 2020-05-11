import {ViewStream} from 'spyne';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import {RouteCreatorToDataTraits} from 'traits/route-creator-to-data-traits';

export class RouteJsonViewer extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'article';
    props.id = 'route-json-viewer';
    const code =  RouteJsonViewer.getTestRouteObj();
    hljs.registerLanguage('javascript', javascript);
    hljs.initHighlightingOnLoad()
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
        ["CHANNEL_ROUTE_CREATOR_GENERATE_JSON_EVENT", 'onGenerateJson'],
        ['CHANNEL_ROUTE_CREATOR_ROUTE_LASTITEM_RENDERED_EVENT', 'onStartJson']

    ];
  }

  onStartJson(e){
    const delay = ()=> this.routeCreatorToData$DomToRouteJson();
    this.setTimeout(this.onGenerateJson.bind(this), 100);

  }

  onGenerateJson(e){
    const json = this.routeCreatorToData$DomToRouteJson();
    hljs.registerLanguage('javascript', javascript);
    hljs.initHighlightingOnLoad();
   const codeEl = this.props.el$('code.json').el;
   codeEl.innerHTML = JSON.stringify(json, null, 4);
   hljs.highlightBlock(codeEl);

   const {routes} = json;
   const action = 'CHANNEL_ROUTE_UPDATE_CONFIG_EVENT';

   this.sendInfoToChannel("CHANNEL_ROUTE", {action,routes}, action);

  }

  static getTestRouteObj(){
    const obj = {
      "routes": {
        "routePath": {
          "routeName": "pageId",
          "home": "home",
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
          }
        }
      }
    }

    return JSON.stringify(obj,null,4);


  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_ROUTE_CREATOR");

  }

}