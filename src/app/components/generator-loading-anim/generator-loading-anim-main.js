import {ViewStream} from 'spyne';
import {GeneratorLoadingAnimTraits} from 'traits/generator-loading-anim-traits';

export class GeneratorLoadingAnimMain extends ViewStream {

  constructor(props = {}) {
    props.id='generator-loading-anim-main';
    props.traits=GeneratorLoadingAnimTraits;
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }


  init(){
    this.genLoad$InitAnim();
    this.genLoad$HideContainer();
  }

  onRendered() {

    this.init();
  }

}