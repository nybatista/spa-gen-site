import {ViewStream, DomEl, ChannelPayloadFilter} from 'spyne';
import {prop,path,map,head,values,toPairs,toPairsIn, flatten,fromPairs, omit,compose,is, mapAccum, forEachObjIndexed} from 'ramda';
import {DynamicAppTraits} from 'traits/dynamic-app-traits';

export class DynamicAppHeaderContentView extends ViewStream {

  constructor(props = {}) {
    props.tagName='nav';
    props.data = DynamicAppTraits.dynApp$FormatRouteConfigForDom(props.routes);

    //console.log("HEADER SUBNAV ",props.data, props.routes);
    props.class='dynamic-app-header-content';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    const curentUpdateConfigNum = this.props.updateConfigNum;
    const updatePayloadFilter = new ChannelPayloadFilter({
      propFilters: {
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

  broadcastEvents() {
    // return nexted array(s)
    return [
        ['a', 'click']
    ];
  }

  addAnchors(){
    const addAnchor=(d)=>{
      //console.log("ANCHOR DATA ",{d})
      //d['workId']="";
      d['workIdValue']="";
      d['aboutIdValue']="";
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
    this.addAnchors()
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");

  }

}