import {ViewStream, DomEl} from 'spyne';
import {prop,path,map,head,values,toPairs,toPairsIn, flatten,fromPairs, omit,compose,is, mapAccum, forEachObjIndexed} from 'ramda';
import {DynamicAppTraits} from 'traits/dynamic-app-traits';

export class DynamicAppHeaderContentView extends ViewStream {

  constructor(props = {}) {
    props.tagName='nav';
    props.data = DynamicAppTraits.dynApp$FormatRouteConfigForDom(props.routes);
    props.class='dynamic-app-header-content';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ['CHANNEL_DYNAMIC_APP_ROUTE_CONFIG_UPDATED_EVENT', 'onDisposeViewStream']
    ];
  }

  onDisposeViewStream(e){
    console.log("BEFORE DISPOSE ", {e}, this.props.data);

   // this.disposeViewStream();
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
    this.addAnchors()
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");

  }

}