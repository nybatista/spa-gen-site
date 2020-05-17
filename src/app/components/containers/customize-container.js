import {ViewStream} from 'spyne';
import {CustomizeMainView} from '../customizer/cutomize-main-view';
import {gsap} from 'gsap/all';
export class CustomizeContainer extends ViewStream {

  constructor(props = {}) {
    props.tagName='section';
    props.class='container';
    props.id='customize-container';
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT', 'onToggleView']

    ];
  }

  onToggleView(e){
    const {eventType,type,value} = e.props();
    //console.log("TOGGLINGE CustomizeContainer VIEW ",{e});
    this.props.el$.toggleClass('reveal');
    this.props.el$.inline='';
  }


  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  animateTest(){
    this.props.el$.addClass('reveal');
   // gsap.to(this.props.el, {duration:.5, height:40, delay:4})
  }

  onRendered() {

  // this.setTimeout(this.animateTest.bind(this), 500);

    this.appendView(new CustomizeMainView());

    this.addChannel("CHANNEL_CONTAINERS");


  }

}