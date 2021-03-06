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
      ['CHANNEL_CONTAINERS_TOGGLE_MAIN_CONTAINER_EVENT', 'onToggleView'],
      ['CHANNEL_CONTAINERS_DRAG_EVENT', 'onContainerDragEvent']

    ];
  }

  onContainerDragEvent(e){
    const {y, containerHeight, animateToPositionBool} = e.props();
    //console.log('container drag event ',{y},e)

    if (animateToPositionBool===true){
       gsap.to(this.props.el, {duration:.25, height:containerHeight});
    } else {
      gsap.set(this.props.el, {height:containerHeight});
    }

  }

  onRevealContainer(bool){
    const getYPos=()=>{
      const yEl = document.getElementById('route-creator-container');
      const {y,height} =  yEl.getBoundingClientRect();
      return y + height + 60;
    }



    const num = bool === true ? getYPos() : 0;
    gsap.to(this.props.el, {duration:.5, height:num});
  }



  onToggleView(e){
    const {eventType,type,value, revealContainerBool} = e.props();
    this.onRevealContainer(revealContainerBool);

    //console.log("TOGGLINGE CustomizeContainer VIEW ",{e});
   // this.props.el$.toggleClass('reveal');
   // this.props.el$.inline='';
  }


  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  animateTest(){
  //  this.props.el$.addClass('reveal');
   // gsap.to(this.props.el, {duration:.5, height:40, delay:4})
  }

  onRendered() {

  // this.setTimeout(this.animateTest.bind(this), 500);

    this.appendView(new CustomizeMainView());

    this.addChannel("CHANNEL_CONTAINERS");


  }

}