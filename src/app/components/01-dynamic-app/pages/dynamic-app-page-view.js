import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {PageSecondaryTopicView} from 'components/01-dynamic-app/pages/page-secondary-topic-view';
import {DynamicAppPageTraits} from 'traits/dynamic-app-page-traits';
import {path, pick, merge} from 'ramda';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';

export class DynamicAppPageView extends ViewStream {

  constructor(props = {}) {
    props.class = 'dynamic-app-page';
    props.traits = DynamicAppPageTraits;

    props.dataNew = DynamicAppDataTraits.dynAppData$GetData(pick(['pageId'], props.data));
    const cache = {};
    function importAll (r) {
      r.keys().forEach(key => cache[key] = r(key));
    }

    props.data = merge(props.data, props.dataNew);

    //importAll(require.context('./templates/', true, /\.html$/));
   // props.template = cache['./page.tmpl.html'];
    const fileName = "./templates/page.tmpl.html";
    props.template = require('' + fileName);
    //props.template = require('./templates/page.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const pageId = this.props.data.pageId;


    const pageIdChangeFilter = new ChannelPayloadFilter({
      propFilters: {
          routeData: (v)=>v.pageId !== pageId
      }

    })

    return [
        ['CHANNEL_ROUTE_CONFIG_UPDATED_EVENT', 'onRouteChangeEvent'],
      ['CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT', 'onRouteChangeEvent', pageIdChangeFilter],
        ['CHANNEL_DYNAMIC_APP_ROUTE_SUBNAV_CHANGE_EVENT', 'onSecondaryPageEvent']

    ];
  }

  onSecondaryPageEvent(e){
    const {pageId, pageTopicKey} = this.props.subTopicData;
   // const pageTopicKey = path(['routePath', 'routeName'], this.props.routes);
    const {routeData} = e.props();
    this.props.subTopicData.pageTopicVal = routeData[pageTopicKey];
    this.dynPage$CheckToAddSecondaryTopicPage(this.props.subTopicData)


  }

  onAddSecondaryTopic(){

  }


  onRouteChangeEvent(e){
/*
    const {routeData, routeConfigHasUpdated} = e.props();
    const {pageId} = routeData;

    if (pageId!==this.props.data.pageId || routeConfigHasUpdated === true){
      this.disposeViewStream()
    }
*/

   this.disposeViewStream()
  }

  onSubnavChangeEvent(e){
    const {routeData} = e.props();

    this.dynPage$CheckToAddSubnavContent(routeData);

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
    this.addChannel("CHANNEL_ROUTE");
      this.dynPage$AddPageContent(this.props.data.pageId);
      const {routes} = this.dynPage$CheckToAddSubnavContent();

      this.props.subTopicData = this.dynPage$GetSubTopicData(this.props.data);
      this.dynPage$CheckToAddSecondaryTopicPage();

      console.log("SUB NAV CONTENT ",this.props);

      this.props.routes=routes;
  }

}