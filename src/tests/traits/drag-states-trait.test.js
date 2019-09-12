import {DragStatesTrait} from '../../app/traits/drag-states-trait';
import {nodeListElement} from '../mocks/node-list-element';
const R = require('ramda');
window.R = R;
describe('drag states trait', () => {

  const actionsArr = [
    'CHANNEL_NODE_LIST_CREATED_EVENT',
    'CHANNEL_NODE_LIST_FIRST_LOADED_EVENT',
    'CHANNEL_NODE_LIST_ADD_NEW_ITEM_EVENT',
    'CHANNEL_NODE_LIST_AFTER_ADD_NEW_ITEM_EVENT',
    'CHANNEL_NODE_LIST_ITEM_CLICKED_EVENT',
    'CHANNEL_NODE_LIST_ITEM_CLICK_TEST_EVENT',
    'CHANNEL_NODE_LIST_ITEM_UP_EVENT',
    'CHANNEL_NODE_LIST_REMOVE_ITEM_EVENT',
    'CHANNEL_NODE_LIST_AFTER_REMOVE_ITEM_EVENT',
    'CHANNEL_NODE_LIST_ADD_NEW_SUBITEM_EVENT',
    'CHANNEL_NODE_LIST_AFTER_ADD_NEW_SUBITEM_EVENT',
    'CHANNEL_NODE_LIST_CLICKED_SUBITEM_EVENT'
  ];
  let parentEl;
  beforeEach(function() {

    document.body.insertAdjacentHTML('afterbegin', nodeListElement);
    parentEl = document.querySelector('.node-container');

  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('creative-list-holder'));
  });




  describe('draggable click tests', ()=>{

    it('should send on click test for main li item', () => {
      const item = document.querySelector('.node-item-sabwp section.input-bar');
      const payloadObj  =  DragStatesTrait.dragState$ClickTestChecks(item, parentEl);
      const isMainClickedItem = payloadObj.isButton === false && payloadObj.isSubNav === false;
      expect(isMainClickedItem).to.eq(true);
    });

    it('should send on click test for add subnav btn', () => {
      const item = document.querySelector('.node-item-sabwp p.add-subnav');
      const payloadObj  =  DragStatesTrait.dragState$ClickTestChecks(item, parentEl);
      const isButton = payloadObj.isButton === true;
      expect(isButton).to.eq(true);

    });

    it('should send on click test for remote item btn', () => {
      const item = document.querySelector('.node-item-sabwp i.material-icons');
      const payloadObj  =  DragStatesTrait.dragState$ClickTestChecks(item, parentEl);
      const isButton = payloadObj.isButton === true;
      expect(isButton).to.eq(true);
    });

    it('should send on click test for is subnav btn', () => {
      const item = document.querySelector('ul.node-container li ul.node-container li section.input-bar')
      const payloadObj  =  DragStatesTrait.dragState$ClickTestChecks(item, parentEl);
      const {isSubNav} = payloadObj;
      expect(isSubNav).to.eq(true);
    });



  });




  describe('should send channelPayload to CHANNEL_NODE_LIST', () => {

    it('should send created event', () => {
      const payloadObj  =  DragStatesTrait.dragState$OnCreatedNodeList();
      const isValidAction = actionsArr.includes(payloadObj.action);
      expect(isValidAction).to.eq(true);
    });

    it('should send first loaded event', () => {
      const payloadObj  =  DragStatesTrait.dragState$OnFirstLoaded();
      const isValidAction = actionsArr.includes(payloadObj.action);
      expect(isValidAction).to.eq(true);
    });

    it('should send on new item event', () => {
      const payloadObj  =  DragStatesTrait.dragState$OnAddNewItem();
      const isValidAction = actionsArr.includes(payloadObj.action);
      expect(isValidAction).to.eq(true);
    });

    it('should send on item clicked event', () => {
      const evt = {
        target: {
          closest: ()=>'li'
        }
      };
      const payloadObj  =  DragStatesTrait.dragState$OnItemClicked(evt);
      const isValidAction = actionsArr.includes(payloadObj.action);

      expect(isValidAction).to.eq(true);

    });



    it('should send on item up event', () => {
      const payloadObj  =  DragStatesTrait.dragState$OnItemUp();
      const isValidAction = actionsArr.includes(payloadObj.action);
      expect(isValidAction).to.eq(true);
    });

    it('should send on remove item event', () => {
      const payloadObj  =  DragStatesTrait.dragState$OnRemoveItem();
      const isValidAction = actionsArr.includes(payloadObj.action);
      expect(isValidAction).to.eq(true);
    });



  });

});