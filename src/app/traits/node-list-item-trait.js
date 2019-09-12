import {SpyneTrait} from 'spyne';

export class NodeListItemTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'nListItem$';
    super(context, traitPrefix);

  }
}