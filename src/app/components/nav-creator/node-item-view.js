import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {NodeContainerView} from './node-container-view';

export class NodeItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.sendLifecyleEvents=true;
    //props.class=`node-item`;
    props.class=`node-item list-item-${props.parentId}`;
    props.dataset = props.data;
    props.template = require('./templates/node-item.tmpl.html');
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
    let isLastEl = this.props.el.parentElement.querySelectorAll('.node-item').length;
    if (type==='delete' && isLastEl>=2){
      this.disposeViewStream();
    } else if (type==='expand') {
      this.appendView(new NodeContainerView(), '.list-holder');
    }

  }



  broadcastEvents() {
    // return nexted array(s)
    return [
        ['i', 'click', 'local']
    ];
  }

  onRendered() {
    this.addChannel("CHANNEL_UI");
  }

}