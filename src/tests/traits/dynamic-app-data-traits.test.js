import {DynamicAppDataTraits} from 'traits/dynamic-app-data-traits';
import {AppDataGeneratorTraits} from 'traits/app-data-generator-traits';
import {DataSource} from '../mocks/app-data-source-mock';

import {Routes} from '../mocks/routes-data-mock';

describe('should get data based on routeProps', () => {

  it('should get all routeNameIds', () => {

    const routeObj = DynamicAppDataTraits.dynAppData$GetRouteNameProps(Routes);

    //console.log("ROUTE OBJ ", {routeObj});

    return true;

  });

  it('should generate data based on routes config', () => {

    let dataFromRoutes = AppDataGeneratorTraits.appDataGen$CreateDataFromRoutes(Routes, DataSource);
    console.log('data from routes ',JSON.stringify(dataFromRoutes));
    return true;
  })


});