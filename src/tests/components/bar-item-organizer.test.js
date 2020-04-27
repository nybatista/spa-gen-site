import {BarItemsSorter} from "components/other/bar-items-sorter";
import {RouteCreatorDom} from '../mocks/route-creator-mock';
import {RouteAnimTraits} from 'traits/route-anim-traits';
const R = require('ramda');
describe('bar items sorter tests', () => {
  const props = {};
  props.el$ = (sel)=>document.querySelectorAll(sel);
  const mainUl = 'djyxzqa';
  const subUl = 'beqywzl';
  const draggerId = 'rotuwc';

  before(function() {
    document.body.insertAdjacentHTML('afterbegin', RouteCreatorDom);
  });
  after(function() {
    document.body.removeChild(document.getElementById('route-creator-main'));
  });

/*
  it('should create organizer sorter object', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props, mainUl);
    const barItemsSorter = new BarItemsSorter(liItems, draggerId);
    expect(barItemsSorter.listItems.length).to.equal(liItems.length);
  });


  it('should create element box data', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props, mainUl);
    const boxData = BarItemsSorter.getDataFromBoundingBox(liItems[2]);
    const {height} = boxData;
    expect(height).to.equal(liItems[2].offsetHeight);
  });

  it('should create organizer sorter array', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props, mainUl);
    const barItemsSorterArr =  BarItemsSorter.createSorterObject(liItems, draggerId);
    expect(barItemsSorterArr[0].initialized).to.equal(true);
  });

  it('should create find the draggerItem in sorter array', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props, mainUl);
    const barItemsSorterArr =  BarItemsSorter.createSorterObject(liItems, draggerId);
    const draggerItem = BarItemsSorter.getDraggerObj(barItemsSorterArr);
    return expect(draggerItem.id).to.equal(draggerId);
  });*/
  it('should get y positions array', () => {
    const liItems = RouteAnimTraits.routeAnim$GetBarItems(props, mainUl);
    const barItemsSorter = new BarItemsSorter(liItems, draggerId);
    barItemsSorter.updateBarItemsSorter(253);


    return true;
  });

  it('should find the new index for dragger yPos', ()=>{

    return true;
  })


});