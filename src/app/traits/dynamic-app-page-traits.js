import {SpyneTrait} from 'spyne';

export class DynamicAppPageTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynPage$';
    super(context, traitPrefix);

  }
}