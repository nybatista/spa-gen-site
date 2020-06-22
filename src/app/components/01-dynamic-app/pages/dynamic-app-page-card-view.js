import {ViewStream} from 'spyne';
import {forEachObjIndexed} from 'ramda';
import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {merge} from 'ramda';

export class DynamicAppPageCardView extends ViewStream {

  constructor(props = {}) {
    props.tagName = 'li';
    props.dataNew = DynamicAppDataTraits.dynAppData$GetData(props.data);
    props.data = merge(props.data, props.dataNew);
    props.data.cardTitle = props.data.keyword.toUpperCase();

    props.class='page-card';
    //console.log("PROPS DATA IS ",props.data,{props});
    props.template = require('./templates/page-cards.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
        ['a', 'click']
    ];
  }
  addDataSet(){
    const anchorEl = this.props.el$('a').el;
    const addToDataset = (val,key)=>{
      anchorEl.dataset[key]=val;
     //console.log("VALUE AND KEY ",{val,key})
    }

    forEachObjIndexed(addToDataset, this.props.data);

   // this.props.el$('a').el.dataset = this.props.data.dataset;
  }

  onRendered() {
    this.addDataSet();
    //console.log("subnav card ",this.props);
  }

}