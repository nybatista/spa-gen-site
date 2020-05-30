import {SpyneTrait} from 'spyne';

export class MenuTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'menu$';
    super(context, traitPrefix);

  }

  static menu$GetMenuData(){

  }
}