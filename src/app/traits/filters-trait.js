import {SpyneTrait, ChannelPayloadFilter} from 'spyne';

export class FiltersTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'filter$';
    super(context, traitPrefix);

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