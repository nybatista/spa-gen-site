import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {NodeListContainerView} from './node-list-container-view';
import {NodeListItemTrait} from '../../traits/node-list-item-trait';

export class NodeListItemView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.sendLifecyleEvents=true;
    props.data.terminateClass = props.terminate ? 'no-subnav' : 'nope';
    props.data.parentId = props.parentId;
    props.class=`node-item node-item-${props.parentId} ${props.terminateClass}`;
    props.dataset = props.data;
    props.traits = NodeListItemTrait;
    props.template = require('./templates/node-list-item.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
        ["CHANNEL_UI_CLICK_EVENT", 'onClickEvent']
    ];
  }

  onClickEvent(e){
    if (this.isLocalEvent(e)===false){
      return;
    }
    let {type} = e.props();
    let isLastEl = this.props.el.parentElement.querySelectorAll('.node-item').length;
    const allowDelete = isLastEl >=2 || this.props.allowEmpty === true;
    if (type==='delete' && allowDelete === true){
      this.disposeViewStream();
    } else if (type==='expand') {
    } else if (type==='subnav' && this.props.nodeContainer === undefined){
      this.addSubNodeContainer();
    }

  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        ['i', 'click', 'local'],
        ['p.add-subnav', 'click']
    ];
  }

  addSubNodeContainer(){
    let triggerBtn = `${this.props.id$} p.add-subnav`;
    let addInitItem = true;
    let terminate = true;;
    let allowEmpty = true;
    this.props.nodeContainer = new NodeListContainerView({triggerBtn, allowEmpty, terminate, addInitItem});
    this.appendView(this.props.nodeContainer, '.node-hangar');
  }

  onRendered() {
    this.addChannel("CHANNEL_UI");
  }

}