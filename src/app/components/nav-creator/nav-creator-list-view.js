import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {NavCreatorListItemView} from './nav-creator-list-item-view';
import {DraggableTrait} from '../../traits/draggable-trait';

export class NavCreatorListView extends ViewStream {

  constructor(props = {}) {
    props.tagName='ul';
    props.id = 'nav-creator-list';
    props.traits = DraggableTrait;
    super(props);

  }

  addActionListeners() {

    let payloadClassFilter = new ChannelPayloadFilter("", {
      class: "nav-creator-list-item"
    });

    return [
      ['CHANNEL_UI_CLICK_EVENT', 'onAddNewItem', '.btn-blue'],
      ['CHANNEL_LIFECYCLE_DISPOSED_EVENT', 'onLifeCycleEvent', payloadClassFilter]

    ];
  }

  onAddNewItem(e){
    console.log("add new item ");
    let text = 'new item';
    let data = {text};
    this.appendView(new NavCreatorListItemView({data}));
    this.drag$InitDraggable();

  }

  onLifeCycleEvent(e){
    let {id} = e.props();

    console.log('lifecycle event ',this.props.dragItems,e.props());
    this.props.dragItems = this.drag$RemoveDeletedDragItem(id);


    console.log("ID ",{id},this.props.dragItems);
    this.drag$ResetPositions();
    this.drag$InitDraggable(false);

  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  addItems(){
    let arr = ['item-1', 'item-2', 'item-3'];

    const addItem = (text)=>{
     let data = {text};
     this.appendView(new NavCreatorListItemView({data}));
    };

    arr.forEach(addItem);


  }

  initItemPositions(){

  }

  onRendered() {

    this.addItems();
    this.props.rowHeight = 40;
    this.props.items$ = this.props.el$('.nav-creator-list-item');
    this.drag$InitDraggable();
    this.addChannel("CHANNEL_UI");
    this.addChannel("CHANNEL_LIFECYCLE");

  }

}