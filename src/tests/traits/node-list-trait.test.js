import {NodeListTrait} from '../../app/traits/node-list-trait';
import {nodeListElement} from '../mocks/node-list-element';

describe('root test', () => {

  const beforeFn = ()=>document.body.insertAdjacentHTML('afterbegin', nodeListElement);
  const afterFn =  ()=>document.getElementById('creative-list-holder');;

  beforeEach(beforeFn);
  afterEach(afterFn);

  it('should run node list traits', () => {
      const el = document.querySelector('ul.node-container');

      const heightsArr = NodeListTrait.nodeList$GetHeightsArr(el);

     // console.log('el is ',el);
    return true;

  });

});