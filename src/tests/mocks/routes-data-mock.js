const Routes = {


  Spyne: {

    config: {

      channels: {

        ROUTE: {

          routes: {
            "routePath": {
              "404": ".*",
              "routeName": "pageId",
              "home": "^$",
              "work": {
                "routePath": {
                  "404": ".+",
                  "routeName": "workId",
                  "acme": "acme",
                  "widgets": "widgets",
                  "globex": "globex"
                }
              },
              "about": {
                "routePath": {
                  "404": ".+",
                  "routeName": "aboutId",
                  "contact": "contact"
                }
              }
            }
          }

        }

      }

    }

  }





};


export {Routes}