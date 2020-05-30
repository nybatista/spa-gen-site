import {DomEl, ViewStream} from 'spyne';
import {DynamicAppTraits} from 'traits/dynamic-app-traits';

export class MenuDrawer extends ViewStream {

  constructor(props = {}) {
    props.id = 'menu-drawer';
    props.class = 'menu-drawer open';
    props.data = DynamicAppTraits.dynApp$FormatRouteConfigForMenuDrawer();

    console.log("PROPS DATA IS ",props.data);
  //  props.template = require('./templates/menu-drawer.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  addAnchors(){
    const addAnchor=(d)=>{
      console.log("ANCHOR DATA ",{d})
      //d['workId']="";
      d['workIdValue']="";
      d['aboutIdValue']="";
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
    return [];
  }



  onRendered() {
    this.addAnchors();
    console.log("MENU DRAWER");
    this.addChannel("CHANNEL_DYNAMIC_APP_ROUTE");
  }

}