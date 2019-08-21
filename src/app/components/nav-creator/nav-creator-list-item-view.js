import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {NavCreatorListView} from './nav-creator-list-view';

export class NavCreatorListItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.sendLifecyleEvents=true;
    props.class='nav-creator-list-item';
    props.dataset = props.data;
    props.template = require('./templates/nav-creator-list-item.tmpl.html');
    super(props);

  }

  addActionListeners() {



    // return nexted array(s)
    return [
        ["CHANNEL_UI_CLICK_EVENT", 'onClickEvent']
    ];
  }

  onClickEvent(e){
    let {type} = e.props();
    console.log("CLICK EVENT ",{type,e});
    if (type==='delete'){
      this.disposeViewStream();
    } else if (type==='expand') {
      //this.appendView(new NavCreatorListView());
    }

  }



  broadcastEvents() {
    // return nexted array(s)
    return [
        ['i', 'click', 'local']
    ];
  }

  onRendered() {
    const theI = this.props.el$('i');
    console.log("I is ",theI.el);

    this.addChannel("CHANNEL_UI");
  }

}