import {SpyneTrait} from 'spyne';

export class NodeListContainerTrait extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'nListCntr$';
    super(context, traitPrefix);

  }
}