import {SpyneTrait} from 'spyne';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, clamp, toPairs, fromPairs, map, filter, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';
import {NodeListItemView} from '../components/nav-creator/node-list-item-view';

export class DragStatesTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dragState$';
    super(context, traitPrefix);

  }

  static dragState$InitDraggable(animate=true){
    this.props.dragItems = this.dragList$CreateList(animate);
    this.props.dragHeightsArr = this.dragMethod$GetHeightsAddedArr();

    //console.log("HEIGHTS ARR IS ",this.props.dragHeightsArr);
  }


  static dragState$ResetPositions(createDragFn = this.dragList$CreateList){
    const tl = new TimelineMax({paused:true, onComplete:createDragFn});
    let heightsArr = this.dragMethod$GetHeightsArr();
    const onUpdateItem =(el, i)=>{
      const height = this.dragMethod$GetHeight(i, heightsArr) ;// i*rowHeight;
      tl.to(el, .125, {y:height, ease: Power1.easeInOut});
    };

    let items = this.props.el$(this.props.listClass).el;
    items = items.length !== undefined ? items : [items];

    items.forEach(onUpdateItem);
    tl.play();

  }

  static dragState$AddItem(e){
    const createItem = (text='new-item')=>{
      let data = {text};
      const parentId = this.props.vsid;
      const {terminate, allowEmpty} = this.props;
      this.appendView(new NodeListItemView({data, terminate, allowEmpty, parentId}));
    };

    const itemClass = `.node-item-${this.props.vsid}`;
    const num = this.props.el$(itemClass).len;
    const txt = `item-${num+1}`;
    createItem(txt);

    this.dragState$InitDraggable()
  }


  static dragState$RemoveItem(id){
    return this.dragMethod$RemoveDeletedDragItem(id);

  }

  static dragState$OnCreatedNodeList(payload={}){
    return this.dragState$SendChannelPayload('created', payload);
  }
  static dragState$OnFirstLoaded(payload={}){
    return this.dragState$SendChannelPayload('first_loaded', payload);
  }
  static dragState$OnAddNewItem(payload={}){
    return this.dragState$SendChannelPayload('add_new_item', payload);
  }

  static dragState$OnItemClicked(e){
    const {target} = e;
    const item = target.closest('li');
   // let testObj  =  this.dragState$ClickTestChecks(item, item);
   // testObj.target=target;
    return this.dragState$SendChannelPayload('item_clicked', {item});
  }


  static dragState$ClickTestChecks(item, parentEl=this.props.el){
    const tagName = item.tagName.toLowerCase();
    const subNavUl = parentEl.querySelector('div.node-hangar ul');
    const isSubNav =  subNavUl !== null && subNavUl.contains(item);
    const isButton = ['i','input','p', 'ul'].indexOf(tagName)>=0;
    const data = DragStatesTrait.dragState$ToObject(item.dataset);
    return {item, tagName, subNavUl, isSubNav, data, isButton};
  }


  static dragState$OnItemClickTest(item){
    let testObj  =  this.dragState$ClickTestChecks(item);
    let {tagName, subNavUl, isSubNav, isButton} = testObj;
    this.dragState$SendChannelPayload('item_click_test', testObj);

    return isButton  || isSubNav === true;
  }

  static dragState$OnItemUp(payload={}){
    return this.dragState$SendChannelPayload('item_up', payload);
  }
  static dragState$OnRemoveItem(payload={}){
    return this.dragState$SendChannelPayload('remove_item', payload);
  }



  static dragState$SendChannelPayload(actionStr, payload={}){
    const action = DragStatesTrait.dragState$CreateActionString(actionStr);
    payload['action']=action;
    const channel = "CHANNEL_NODE_LIST";
    console.log("send action ", {payload},this.sendInfoToChannel);
    if (this.sendInfoToChannel!==undefined) {
      this.sendInfoToChannel(channel, payload, action);
    }
    return {channel, payload, action};
  }

  static dragState$ToObject(obj){
    return compose(fromPairs, toPairs)(obj);
  }

  static dragState$CreateActionString(actionStr){
    const actionType = String(actionStr).toUpperCase();
    return `CHANNEL_NODE_LIST_${actionType}_EVENT`;
  }


}