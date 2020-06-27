import {ChannelPayloadFilter, DomEl, ViewStream} from 'spyne';
import {DynamicAppTraits} from 'traits/dynamic-app-traits';

export class MenuDrawerContent extends ViewStream {

  constructor(props = {}) {
      props.id = 'menu-drawer-content';
    props.data = DynamicAppTraits.dynApp$FormatRouteConfigForMenuDrawer();


    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const curentUpdateConfigNum = this.props.updateConfigNum;
    const updatePayloadFilter = new ChannelPayloadFilter({
      props: {
        updateConfigNum: (val)=>val!==curentUpdateConfigNum
      }
    })

    return [
      ['CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT', 'onDisposeViewStream', updatePayloadFilter]
    ];
  }

  onDisposeViewStream(e){
    //console.log("BEFORE DISPOSE ", {e}, this.props.data);

    this.disposeViewStream();
  }

  addAnchors(){
    const addAnchor=(d)=>{
      //console.log("ANCHOR DATA ",{d})
      //d['workId']="";
      d['workIdValue']="";
      d['aboutIdValue']="";

      d["eventType"] = "menuDrawer";


      const anchor = new DomEl({
        tagName: 'a',
        class: d.class,
        dataset: d,
        data: d.text,
        href: d.href

      })

      this.props.el.appendChild(anchor.render());

    }

    this.props.data.forEach(addAnchor);


  }


  broadcastEvents() {
    // return nexted array(s)
    return [
      ['a', 'click']
    ];
  }


  onRendered() {
    this.addAnchors()
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");

  }

}