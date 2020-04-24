import {BarItemsSorter} from "components/other/bar-items-sorter";
import {RouteCreatorDom} from '../mocks/route-creator-mock';
import {RouteAnimTraits} from 'traits/route-anim-traits';

describe('bar items sorter tests', () => {
  const props = {};
  props.el$ = (sel)=>document.querySelectorAll(sel);


  beforeEach(function() {
    document.body.insertAdjacentHTML('afterbegin', RouteCreatorDom);
  });
  afterEach(function() {
    document.body.removeChild(document.getElementById('route-creator-main'));
  });


  it('should create organizer sorter object', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props,'fkgdxrc');
    const draggerId = 'shvxkhw';
    const barItemsSorter = new BarItemsSorter(liItems, draggerId);
    expect(barItemsSorter.listItems.length).to.equal(liItems.length);
  });

  it('should create organizer sorter array', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props,'fkgdxrc');
    const draggerId = 'ocver';
    const barItemsSorterArr =  BarItemsSorter.createSorterObject(liItems, draggerId);
    console.log(barItemsSorterArr[1]);
    return true;
  });




  it('should create element box data', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props,'fkgdxrc');
    const draggerId = 'shvxkhw';
    const boxData = BarItemsSorter.getDataFromBoundingBox(liItems[2]);
    const {height} = boxData;
    expect(height).to.equal(liItems[2].offsetHeight);
  });



});