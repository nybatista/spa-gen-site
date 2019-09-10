import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {NodeItemView} from './node-item-view';
import {DraggableTrait} from '../../traits/draggable-trait';
import {DragMethodsTrait} from '../../traits/drag-methods-trait';
import {DragListTrait} from '../../traits/drag-list-trait';
import {DragStatesTrait} from '../../traits/drag-states-trait';

export class NodeContainerView extends ViewStream {

  constructor(props = {}) {
    //console.log('add init item ',props.triggerBtn);
    props.addInitItem = props.addInitItem !==undefined ? props.addInitItem : true;
    props.allowEmpty = props.allowEmpty ? props.allowEmpty : false;
    props.tagName='ul';
    props.class = 'node-container';
    props.traits = [DragMethodsTrait, DragListTrait, DragStatesTrait];
    super(props);
   // console.log("TRIGGER BTN ",this.props.vsid, this.props.triggerBtn);

  }

  addActionListeners() {
   let  propFilters = {class:  (c) => c.indexOf(`node-item-`)>=0 };
   let payloadClassFilter = new ChannelPayloadFilter({propFilters});

    return [
      ['CHANNEL_UI_CLICK_EVENT', 'dragState$AddItem', this.props.triggerBtn],
      ['CHANNEL_LIFECYCLE_DISPOSED_EVENT', 'onLifeCycleEvent', payloadClassFilter],
      ['CHANNEL_LIFECYCLE_RENDERED_EVENT', 'onLifecycleNewItemAdded'],
        ['CHANNEL_NODE_LIST_.*EVENT', 'onChannelNodeList']
    ];
  }

  onChannelNodeList(e){
    console.log("CHANNEL NODE LIST ",e);
  }



  onLifecycleNewItemAdded(e){
    this.dragState$ResetPositions();

  }


  onLifeCycleEvent(e){
    let {id} = e.props();
    this.props.dragItems = this.dragState$RemoveItem(id);
    this.dragState$InitDraggable(false);
    this.dragState$ResetPositions();
    //const recreateDragList = ()=>this.dragState$ResetPositions();
    //window.setTimeout(recreateDragList, 750);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }


  onRendered() {

    //console.log("THIS CONTAINER ",this.props.vsid);
    this.props.dragHeightsArr = [0];
    this.props.listClass = '.'+this.dragMethod$GetListClass();
   // this.addItems();
    if (this.props.addInitItem === true){
      this.dragState$AddItem();
    }

    this.props.rowHeight = 40;
    this.props.items$ = this.props.el$('.node-item');
    this.dragState$InitDraggable();
    this.addChannel("CHANNEL_UI");
    this.addChannel("CHANNEL_LIFECYCLE");
    this.addChannel("CHANNEL_NODE_LIST");

  }

}