import {SpyneTrait} from 'spyne';
import {TweenMax, TimelineMax} from 'gsap';
import {mapObjIndexed, reduce, add, slice, clamp, map, filter, reject, multiply, range, compose, pathEq, prop, path, values} from 'ramda';
import {NodeItemView} from '../components/nav-creator/node-item-view';

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
      this.appendView(new NodeItemView({data, terminate, allowEmpty, parentId}));
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

}