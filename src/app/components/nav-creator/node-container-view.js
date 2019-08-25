import {ViewStream, ChannelPayloadFilter} from 'spyne';
import {NodeItemView} from './node-item-view';
import {DraggableTrait} from '../../traits/draggable-trait';

export class NodeContainerView extends ViewStream {

  constructor(props = {}) {
    //console.log('add init item ',props.triggerBtn);
    props.addInitItem = props.addInitItem !==undefined ? props.addInitItem : true;
    props.allowEmpty = props.allowEmpty ? props.allowEmpty : false;
    props.tagName='ul';
    props.id = 'node-container';
    props.traits = DraggableTrait;
    super(props);
   // console.log("TRIGGER BTN ",this.props.vsid, this.props.triggerBtn);

  }

  addActionListeners() {

	let  propFilters = {class:  (c) => c.indexOf(`node-item-${this.props.vsid}`)>=0 };
   let payloadClassFilter = new ChannelPayloadFilter({propFilters});

   // console.log("TRIGGER BTN ",this.props.vsid, this.props.triggerBtn);

    return [
      ['CHANNEL_UI_CLICK_EVENT', 'onAddNewItem', this.props.triggerBtn],
      ['CHANNEL_LIFECYCLE_DISPOSED_EVENT', 'onLifeCycleEvent', payloadClassFilter],
        ['CHANNEL_LIFECYCLE_RENDERED_EVENT', 'onLifecycleNewItemAdded']

    ];
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
    const delayer = ()=>this.drag$InitDraggable();
     // window.setTimeout(delayer, 10);
    //delayer();
    this.drag$InitDraggable();

  }

  onLifecycleNewItemAdded(e){
    console.log("new item added ",e.props().class, this.props.vsid);;
    this.drag$ResetPositions();
  }


  onLifeCycleEvent(e){
    let {id} = e.props();
      //console.log('lifecycle events ',e,this.props.vsid);
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

    //console.log("THIS CONTAINER ",this.props.vsid);

    this.props.listClass = '.'+this.drag$GetListClass();
   // this.addItems();
    if (this.props.addInitItem === true){
      this.addItems();
    }

    this.props.rowHeight = 40;
    this.props.items$ = this.props.el$('.node-item');
    this.drag$InitDraggable();
    this.addChannel("CHANNEL_UI");
    this.addChannel("CHANNEL_LIFECYCLE");

  }

}