import {DomEl, ViewStream, ChannelPayloadFilter} from 'spyne';

export class DynamicAppSubnavContent extends ViewStream {

  constructor(props = {}) {
    props.tagName='nav';
    props.class='dynamic-app-subnav-content';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const currentPageId = this.props.pageId;
    const updatePayloadFilter = new ChannelPayloadFilter({
      propFilters: {
        routeData: (d)=>d.pageId !== currentPageId
      }
    })


    return [
         ['CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT', 'onDisposeViewStream'],

          ['CHANNEL_DYNAMIC_APP_ROUTE_PAGE_CHANGE_EVENT', 'onDisposeViewStream', updatePayloadFilter]

    ];
  }


  onRouteConfigUpdated(e){
    console.log("subnav route config update ",{e},this.props);

  }


  onDisposeViewStream(e){
    this.disposeViewStream();
  }

  onDeepLink(e){
    console.log("DEEP LINK");
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
      ['a', 'click']
    ];
  }

  addAnchors(){
    const addAnchor=(d)=>{
      const anchor = new DomEl({
        tagName: 'a',
        dataset: d,
        data: d.text,
        href: d.href

      })

      this.props.el.appendChild(anchor.render());

    }

    this.props.data.forEach(addAnchor);


  }

  onRendered() {
    this.addAnchors();
    //this.addChannel("CHANNEL_ROUTE");
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
  }

}