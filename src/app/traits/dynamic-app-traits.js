import {SpyneTrait} from 'spyne';

export class DynamicAppTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'dynApp$';
    super(context, traitPrefix);

  }
}