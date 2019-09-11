import {NodeListChannel} from '../../app/channels/node-list-channel';

describe('channel node list', () => {

  it('action is auto sendpayload', () => {
      const action = 'CHANNEL_NODE_LIST_ITEM_CLICKED_EVENT';
      const isAutoSendAction = NodeListChannel.checkForAutoSendPayload(action);
    expect(isAutoSendAction).to.eq(true);

  });

});