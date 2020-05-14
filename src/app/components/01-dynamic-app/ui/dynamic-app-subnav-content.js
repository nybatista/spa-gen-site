import {DomEl, ViewStream} from 'spyne';

export class DynamicAppSubnavContent extends ViewStream {

  constructor(props = {}) {
    props.tagName='nav';
    props.class='dynamic-app-subnav-content';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
    ];
  }

  onDeepLink(e){
    console.log("DEEP LINK");
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
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
    //this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
  }

}