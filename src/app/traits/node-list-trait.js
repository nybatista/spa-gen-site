import {SpyneTrait} from 'spyne';
import {reduce, add, slice, fromPairs} from 'ramda';


export class NodeListTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'nodeList$';
    super(context, traitPrefix);

  }

  static nodeList$GetHeightsAddedArr(arr){
    const mapValsIndexed = (val, index)=>{
      return reduce(add,0, slice(0, index, arr));
    };
    return arr.map(mapValsIndexed);
  }


  static nodeList$GetHeightsArr(nodeListEl=this.props.nodeListEl, rowHeight=40){
    let heightObj = {};

    const createHeightArr = (id, nodeList)=> {
      heightObj[id] =  this.nodeList$GetHeightsAddedArr(nodeList);;
    };

    const getHeights = (item)=>{
      const subItems = item.querySelectorAll('ul.node-container li');
      console.log('item is ',item.id,subItems.length);

    };



    const mainItems = nodeListEl.querySelectorAll("#creative-list-holder > ul.node-container > li");

    mainItems.forEach(getHeights);

    const subNavItems = nodeListEl.querySelectorAll('li div ul.node-container li')


    console.log('el is ',mainItems.length);

      return nodeListEl;

  }
}