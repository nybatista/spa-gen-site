import {SpyneTrait, ChannelPayloadFilter} from 'spyne';

export class FiltersTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'filter$';
    super(context, traitPrefix);

  }

  static filter$BarHolderOnInternalUIEvent(props=this.props){
    const {subNavHolder} = props;
    return new ChannelPayloadFilter({
      propFilters:{
       barId: subNavHolder
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