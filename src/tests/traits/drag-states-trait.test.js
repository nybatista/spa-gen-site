import {DragStatesTrait} from '../../app/traits/drag-states-trait';

describe('drag states trait', () => {



  describe('should send channelPayload to CHANNEL_NODE_LIST', () => {
      const actionsArr = [
        'CHANNEL_NODE_LIST_CREATED_EVENT',
        'CHANNEL_NODE_LIST_FIRST_LOADED_EVENT',
        'CHANNEL_NODE_LIST_ADD_NEW_ITEM_EVENT',
        'CHANNEL_NODE_LIST_AFTER_ADD_NEW_ITEM_EVENT',
        'CHANNEL_NODE_LIST_ITEM_CLICKED_EVENT',
        'CHANNEL_NODE_LIST_ITEM_UP_EVENT',
        'CHANNEL_NODE_LIST_REMOVE_ITEM_EVENT',
        'CHANNEL_NODE_LIST_AFTER_REMOVE_ITEM_EVENT',
        'CHANNEL_NODE_LIST_ADD_NEW_SUBITEM_EVENT',
        'CHANNEL_NODE_LIST_AFTER_ADD_NEW_SUBITEM_EVENT',
        'CHANNEL_NODE_LIST_CLICKED_SUBITEM_EVENT'
      ];


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