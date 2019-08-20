import {ViewStream} from 'spyne';
import {NavCreatorListItemView} from './nav-creator-list-item-view';

export class NavCreatorListView extends ViewStream {

  constructor(props = {}) {
    props.tagName='ul';
    props.id = 'nav-creator-list';
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

  addItems(){
    let arr = ['item-1', 'item-2', 'item-3'];

    const addItem = (text)=>{
     let data = {text};
     this.appendView(new NavCreatorListItemView({data}));
    };

    arr.forEach(addItem);


  }

  onRendered() {

    this.addItems();

  }

}