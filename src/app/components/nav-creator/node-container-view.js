import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {NodeItemView} from './node-item-view';
import {DraggableTrait} from '../../traits/draggable-trait';

export class NodeContainerView extends ViewStream {

  constructor(props = {}) {
    props.tagName='ul';
    props.id = 'node-container';
    props.traits = DraggableTrait;
    super(props);

  }

  addActionListeners() {

    let payloadClassFilter = new ChannelPayloadFilter("", {
      class: (c) => c.indexOf(`list-item-${this.props.vsid}`)>=0
    });

    return [
      ['CHANNEL_UI_CLICK_EVENT', 'onAddNewItem', '.btn-blue'],
      ['CHANNEL_LIFECYCLE_DISPOSED_EVENT', 'onLifeCycleEvent', payloadClassFilter]

    ];
  }

  addNewItem(text='new item'){
    let data = {text};
    const parentId = this.props.vsid;
    this.appendView(new NodeItemView({data, parentId}));

  }


  onAddNewItem(e){
    const itemClass = `.list-item-${this.props.vsid}`;
    const num2 = this.props.el$(itemClass).len;
    //const num = Math.random()*8;//this.props.el$(itemClass).len;
    //const num = this.props.el.querySelectorAll(itemClass).length;
    const txt = `item-${num2+1}`;
    console.log("NUM LI ",{itemClass, num2, num2});
    this.addNewItem(txt);
    const delayer = ()=>this.drag$InitDraggable();
     // window.setTimeout(delayer, 10);
    //delayer();
    this.drag$InitDraggable();

  }


  onLifeCycleEvent(e){
    let {id} = e.props();

    this.props.dragItems = this.drag$RemoveDeletedDragItem(id);
    this.drag$InitDraggable(false);
    this.drag$ResetPositions();


  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  addItems(){
    let arr = ['item-1'];

    const addItem = (text)=>{
      let parentId = this.props.vsid;
     let data = {text};
     this.appendView(new NodeItemView({data,parentId}));
    };

   // arr.forEach(addItem);
    this.addNewItem('item-num-1');

  }

  initItemPositions(){

  }

  onRendered() {

    this.props.listClass = '.'+this.drag$GetListClass();
    this.addItems();
    this.props.rowHeight = 40;
    this.props.items$ = this.props.el$('.node-item');
    this.drag$InitDraggable();
    this.addChannel("CHANNEL_UI");
    this.addChannel("CHANNEL_LIFECYCLE");

  }

}