import {SpyneTrait, ChannelPayloadFilter} from 'spyne';
import {compose,ifElse,propEq} from 'ramda';
export class FiltersTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'filter$';
    super(context, traitPrefix);

  }

  static filter$BarHolderItemRenderedEvent(props=this.props){
    const {vsid, routeLevel} = props;
    const vsidPred = propEq('parentVsid', vsid);
    return new ChannelPayloadFilter({
      props: {
        parentVsid: (val)=>val===vsid || routeLevel===0
      }
    })

  }


  static filter$BarHolderOnInternalUIEvent(props=this.props){
    const {subNavHolder,vsid} = props;
    const addPred = propEq('barId', subNavHolder);
    const deletePred = propEq('holderId', vsid);
    const isAdd = propEq('routeBarEvent', 'add');
    const fn = ifElse(isAdd,addPred,deletePred);
    return new ChannelPayloadFilter({
      props:{
       payload: fn
      }
    });

  }

  static filter$BarItemOnInternalUIEvent(props=this.props){
    const {vsid} = props;
    return new ChannelPayloadFilter({
      props:{
        barId: vsid
      }
    });

  }

  static filter$BarItemUIClickForRouteName(props=this.props){
    const {holderId} = props;
    return new ChannelPayloadFilter({
        props: {
          masterItem: holderId
        }
    });
  }


  static filter$InitDraggingItem(props=this.props){
    const {vsid} = props;
    return new ChannelPayloadFilter({
          props:{
            id: vsid
          }
        });
  }

  static filter$CheckForSwappedItems(props=this.props){
    const {vsid} = props;
    return new ChannelPayloadFilter({
      props:{
        swapItemsIds: (arr)=>arr.indexOf(vsid)>=0
      }
    })

  }


}