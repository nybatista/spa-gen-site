import {ViewStream} from 'spyne';
import {DynamicAppPageView} from 'components/01-dynamic-app/pages/dynamic-app-page-view';

export class DynamicAppPageContainer extends ViewStream {

  constructor(props = {}) {
    props.id = 'dynamic-app-page-container';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT', 'onRouteChangeEvent'],

    ];
  }

  onRouteChangeEvent(e){
    const {pathsChanged, routeData, routeConfigHasUpdated, isDeepLink} = e.props();
    if (pathsChanged.indexOf('pageId')>=0 || routeConfigHasUpdated){
      this.appendView(new DynamicAppPageView({data:routeData, isDeepLink}));
    }
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
  }

}