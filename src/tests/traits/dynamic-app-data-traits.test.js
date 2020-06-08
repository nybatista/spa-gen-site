import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {AppDataGeneratorTraits} from 'traits/app-data-generator-traits';

import {Routes} from '../mocks/routes-data-mock';

describe('should get data based on routeProps', () => {

  it('should get all routeNameIds', () => {

    const routeObj = DynamicAppDataTraits.dynAppData$GetRouteNameProps(Routes);

    //console.log("ROUTE OBJ ", {routeObj});

    return true;

  });

  it('should generate data based on routes config', () => {

    let dataFromRoutes = AppDataGeneratorTraits.appDataGen$CreateDataFromRoutes(Routes);
    //dataFromRoutes = dataFromRoutes.reverse();
    console.log('data from routes ',JSON.stringify(dataFromRoutes[0][1][2]));
    return true;
  })


});