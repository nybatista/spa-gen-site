import {ViewStream} from 'spyne';
import {DynamicAppTraits} from 'traits/dynamic-app-traits';
import {DynamicAppSubnavContent} from 'components/01-dynamic-app/ui/dynamic-app-subnav-content';

export class DynamicAppSubnav extends ViewStream {

  constructor(props = {}) {
    props.class='dynamic-app-subnav';
    props.traits = DynamicAppTraits;
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT', 'onRouteChangeEvent'],
      ['CHANNEL_DYNAMIC_APP_ROUTE_SUBNAV_CHANGE_EVENT', 'onRouteChangeEvent']


    ];
  }

  onRouteChangeEvent(e){
    const {subNavDataArr, pageHasChanged, pageId} = this.dynApp$CheckToAddSubnav(e);

    //console.log("DYN ROUTE CHANGE ",{subNavDataArr, pageHasChanged,e});
    if (subNavDataArr.length>0){
      this.appendView(new DynamicAppSubnavContent({data:subNavDataArr,pageId}))
      this.dynApp$SelectActiveSubNav(e);
    }

    if (pageHasChanged === false){
      this.dynApp$SelectActiveSubNav(e);
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