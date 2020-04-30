import {SpyneTrait, ChannelPayloadFilter} from 'spyne';
import {compose,ifElse,propEq} from 'ramda';
export class FiltersTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'filter$';
    super(context, traitPrefix);

  }

  static filter$BarHolderOnInternalUIEvent(props=this.props){
    const {subNavHolder,vsid} = props;
    const addPred = propEq('barId', subNavHolder);
    const deletePred = propEq('holderId', vsid);
    const isAdd = propEq('routeBarEvent', 'add');
    const fn = ifElse(isAdd,addPred,deletePred);
    return new ChannelPayloadFilter({
      propFilters:{
       payload: fn
      }
    });

  }

  static filter$BarItemOnInternalUIEvent(props=this.props){
    const {vsid} = props;
    return new ChannelPayloadFilter({
      propFilters:{
        barId: vsid
      }
    });

  }



  static filter$InitDraggingItem(props=this.props){
    const {vsid} = props;
    return new ChannelPayloadFilter({
          propFilters:{
            id: vsid
          }
        });
  }

  static filter$CheckForSwappedItems(props=this.props){
    const {vsid} = props;
    return new ChannelPayloadFilter({
      propFilters:{
        swapItemsIds: (arr)=>arr.indexOf(vsid)>=0
      }
    })

  }


}