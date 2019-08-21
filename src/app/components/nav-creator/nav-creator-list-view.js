import {ViewStream} from 'spyne';
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
    // return nexted array(s)
    return [
      ['CHANNEL_UI_CLICK_EVENT', 'onAddNewItem', '.btn-blue']

    ];
  }

  onAddNewItem(e){
    console.log("add new item");
    let text = 'new item';
    let data = {text};
    this.appendView(new NavCreatorListItemView({data}));
    this.drag$InitDraggable();

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

  }

}