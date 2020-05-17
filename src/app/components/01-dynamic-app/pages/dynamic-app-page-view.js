import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {DynamicAppPageTraits} from 'traits/dynamic-app-page-traits';

export class DynamicAppPageView extends ViewStream {

  constructor(props = {}) {
    props.class = 'dynamic-app-page';
    props.traits = DynamicAppPageTraits;
    props.template = require('./templates/page.tmpl.html');
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

    ];
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
      this.dynPage$CheckToAddSubnavContent();

  }

}