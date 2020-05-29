import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {PageSecondaryTopicView} from 'components/01-dynamic-app/pages/page-secondary-topic-view';
import {DynamicAppPageTraits} from 'traits/dynamic-app-page-traits';
import {path} from 'ramda';

export class DynamicAppPageView extends ViewStream {

  constructor(props = {}) {
    props.class = 'dynamic-app-page';
    props.traits = DynamicAppPageTraits;
    const cache = {};
    function importAll (r) {
      r.keys().forEach(key => cache[key] = r(key));
    }

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

    console.log("SECONDARY PAGE EVENT ",{e, pageTopicKey,routeData},this.props);

  }

  onAddSecondaryTopic(){

  }


  onRouteChangeEvent(e){
    this.disposeViewStream()
  }

  onSubnavChangeEvent(e){
    const {routeData} = e.props();

    console.log("E SUBNAV DATA ",{e});
    this.dynPage$CheckToAddSubnavContent(routeData);

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
      this.dynPage$AddPageContent(this.props.data.pageId);
      const {routes} = this.dynPage$CheckToAddSubnavContent();

      this.props.subTopicData = this.dynPage$GetSubTopicData(this.props.data);
      this.dynPage$CheckToAddSecondaryTopicPage();

      console.log("SUBTOPIC DATA ",this.props.subTopicData);
      this.props.routes=routes;
  }

}