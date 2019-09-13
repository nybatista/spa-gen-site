import {SpyneTrait, ChannelPayloadFilter} from 'spyne';

export class ChannelPayloadFiltersTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'filter$';
    super(context, traitPrefix);

  }

  static filter$onClickNodeItemsFilter(){
    return new ChannelPayloadFilter({
      propFilters: {
        nodeListType: (k)=>k!==undefined
      }
    })


  }


}