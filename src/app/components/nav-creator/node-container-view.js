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

   // let  propFilters = {class:  (c) => c.indexOf(`node-item-${this.props.vsid}`)>=0 };
    let  propFilters = {class:  (c) => c.indexOf(`node-item-`)>=0 };
   let payloadClassFilter = new ChannelPayloadFilter({propFilters});

   // console.log("TRIGGER BTN ",this.props.vsid, this.props.triggerBtn);

    return [
      ['CHANNEL_UI_CLICK_EVENT', 'onAddNewItem', this.props.triggerBtn],
      ['CHANNEL_LIFECYCLE_DISPOSED_EVENT', 'onLifeCycleEvent', payloadClassFilter],
      ['CHANNEL_LIFECYCLE_RENDERED_EVENT', 'onLifecycleNewItemAdded'],
        ['CHANNEL_NODE_LIST_.*EVENT', 'onChannelNodeList']
    ];
  }

  onChannelNodeList(e){

    console.log("CHANNEL NODE LIST ",e);
  }

  addNewItem(text='new item'){
    let data = {text};
    const parentId = this.props.vsid;
    const {terminate, allowEmpty} = this.props;
    this.appendView(new NodeItemView({data, terminate, allowEmpty, parentId}));

  }


  onAddNewItem(e){
    //console.log("ADD NEW ITEM ",e);

    /** TODO:
     *
     *  TEST TO MAKE SURE ADD NEW IS FOR CURRENT ITEM ONLY
     */

    const itemClass = `.node-item-${this.props.vsid}`;
    const num2 = this.props.el$(itemClass).len;
    //const num = Math.random()*8;//this.props.el$(itemClass).len;
    //const num = this.props.el.querySelectorAll(itemClass).length;
    const txt = `item-${num2+1}`;
    //console.log("NUM LI ",{itemClass, num2, num2});
    this.addNewItem(txt);
    const delayer = ()=>this.dragState$InitDraggable();
     // window.setTimeout(delayer, 10);
    //delayer();
  //  this.drag$InitDraggable();
    this.dragState$InitDraggable()

  }

  onLifecycleNewItemAdded(e){
    //console.log("new item added ",e.props().class, this.props.vsid);;
    //this.drag$ResetPositions();

    this.dragState$ResetPositions();
  }


  onLifeCycleEvent(e){
    let {id} = e.props();
      //console.log('lifecycle events ',e,this.props.vsid);
    this.props.dragItems = this.dragMethod$RemoveDeletedDragItem(id);
   // this.drag$InitDraggable(false);
    this.dragState$InitDraggable(false)

    this.dragState$ResetPositions();


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

    //console.log("THIS CONTAINER ",this.props.vsid);

    this.props.listClass = '.'+this.dragMethod$GetListClass();
   // this.addItems();
    if (this.props.addInitItem === true){
      this.addItems();
    }

    this.props.rowHeight = 40;
    this.props.items$ = this.props.el$('.node-item');
    this.dragState$InitDraggable();
    this.addChannel("CHANNEL_UI");
    this.addChannel("CHANNEL_LIFECYCLE");
    this.addChannel("CHANNEL_NODE_LIST");

  }

}