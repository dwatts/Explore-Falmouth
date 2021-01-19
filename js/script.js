      require([
        "esri/WebScene",
        "esri/views/SceneView",
        "esri/layers/SceneLayer",
        "esri/layers/FeatureLayer",
        "esri/layers/VectorTileLayer",
        "esri/symbols/PolygonSymbol3D",
        "esri/symbols/ExtrudeSymbol3DLayer",
        "esri/renderers/SimpleRenderer",
        "esri/widgets/Editor",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/core/watchUtils",
        "esri/Map"  
          
      ], function (WebScene, SceneView, SceneLayer, FeatureLayer, VectorTileLayer, PolygonSymbol3D,
      ExtrudeSymbol3DLayer, SimpleRenderer, Editor, MapView, Graphic, watchUtils, Map) {
        
        var arcadeExpressions = [
            {
                name: "Image",
                title: "Image",
                expression: "IIF($feature.URL_I == '', '', $feature.URL_I)"
            }, 
        ]; 
          
          
        var uniqueValueInfos = [
          {
            value: 1,
            symbol: {
              type: "web-style",
              name: "Pinus",
              styleName: "EsriThematicTreesStyle"
            }
          },
          {
            value: 2,
            symbol: {
              type: "web-style",
              name: "Taxodium",
              styleName: "EsriThematicTreesStyle"
            }
          },
          {
            value: 3,
            symbol: {
              type: "web-style", 
              name: "Sabal",
              styleName: "EsriThematicTreesStyle"
            }
          },
          {
            value: 4,
            symbol: {
              type: "web-style",
              name: "Aiphanes",
              styleName: "EsriThematicTreesStyle"
            }
          },
          {
            value: 5,
            symbol: {
              type: "web-style",
              name: "Cordyline",
              styleName: "EsriThematicTreesStyle"
            }
          }    
        ];

        var trees = new FeatureLayer({
          url:
            "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Trees_Clip/FeatureServer",
  
          elevationInfo: {
            mode: "on-the-ground"
          },        
          renderer: {
            type: "unique-value",
            field: "Type",
            defaultSymbol: {
              type: "web-style",
              name: "Ligustrum",
              styleName: "EsriThematicTreesStyle"
            },
            uniqueValueInfos: uniqueValueInfos,
            visualVariables: [
              {
                type: "size",
                field: "Hght",
                axis: "height" 
              },
              /*{
                type: "rotation",
                valueExpression: "random() * 360" 
              }*/
            ]
          }
        });
          
          
        var labelRenderer = new SimpleRenderer({
            symbol: new PolygonSymbol3D({
              symbolLayers: [
                  {
                    type: "extrude", 
                    material: {
                      color: [117, 117, 117, 1]
                    },
                    edges: {
                      type: "solid",
                      color: "#ffffff",
                      size: 1
                    }
                  }
                ]
            }),
            visualVariables: [{
              type: "size",
              field: "Hght",
              valueUnit: "feet"
            }]
          });      
          
        const labels = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Alphabet_Super_Simple/FeatureServer",
            maxScale: 0,
            minScale: 1500,
            opacity: 0.8,
            visible: true,
            renderer: labelRenderer
        });  
          
/*       const ocean = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Fal_Ocean/FeatureServer",
            maxScale: 0,
            minScale: 0,
            opacity: 0.8,
            //definitionExpression: "Frt_Type <> 'Fort'",
            elevationInfo: {
              mode: "on-the-ground",    
            },
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-fill",
                color: [56, 204, 245, 0.3],
                outline: {
                  color: [0,0,0,0.2],
                  width: 1,
                  style: "solid"    
                }
              }
            }
        });*/
          
        const shipRenderer = {
            type: "simple",
            symbol: {
                type: "point-3d",
                symbolLayers: [
                    {
                        type: "object",
                        resource: {
                            href: "./3d/CruiseShip.glb"
                        },
                        //height: 15,
                        anchor: "relative",
                        //heading: 80
                    }
                ]
            },
            visualVariables: [
                {
                    type: "size",
                    field: "SIZE_",
                    axis: "height",
                    valueUnit: "meters"
                },
                {
                    type: "rotation",
                    field: "ROTATION",
                }
            ]
        };  
          
        const ship = new FeatureLayer ({
           url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Cruise_Point/FeatureServer",
           elevationInfo: {
               mode: "absolute-height"
           },    
           renderer: shipRenderer,
           visible: false,
           opacity: 0.8,
        });  
          
        const terminalStreets = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Terminal_Streets/FeatureServer",
            maxScale: 0,
            minScale: 0,
            opacity: 1,
            visible: false,
            elevationInfo: {
              mode: "relative-to-ground",    
            },
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-fill", 
                color: [117, 117, 117],
                outline: {
                  color: [0,0,0],
                  width: 1,
                  style: "solid"    
                }
              }
            }
        });
          
    var termRenderer = new SimpleRenderer({
        symbol: new PolygonSymbol3D({
          symbolLayers: [
              {
                type: "extrude", 
                material: {
                  color: [191, 191, 191, 0.8]
                },
                edges: {
                  type: "solid",
                  color: "#757575",
                  size: 1
                }
              }
            ]
        }),
        visualVariables: [{
          type: "size",
          field: "Hght",
          valueUnit: "feet"
        }]
      });      
          
       const terminal = new FeatureLayer({
            url: "https://services5.arcgis.com/CmuSiXApoWtqLYty/arcgis/rest/services/Terminal_Outline/FeatureServer",
            maxScale: 0,
            minScale: 0,
            opacity: 0.8,
            visible: false,
            renderer: termRenderer
        });
          
/********Historic Buildings**********/  
          
        var symbol1 = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: "#66C2A5"
              }  
            } 
          ]  
        };
          
        var symbol2 = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: "#8DA0CB"
              }  
            } 
          ]  
        };  
          
        var renderer = {
          type: "unique-value",
          defaultSymbol: {
            type: "mesh-3d",
            symbolLayers: [
              {
                type: "fill", 
                material: {
                  color: "#FC8D62" // color for value 1851 - 1900
                },
              }
            ]
          },
          field: "Date",
          uniqueValueInfos: [
            {
              value: "1751 - 1800",
              symbol: symbol1,
            },
            {
              value: "1801 - 1850",
              symbol: symbol2,
            }
          ],
        };
          
        const histBuildings = new SceneLayer({           url:"https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/Historic_Buildings_NEW/SceneServer",
        popupEnabled: true,                                
        renderer: renderer,
        elevationInfo: {
              mode: "on-the-ground",    
        },                                      
        popupTemplate: {
              //title: "{name_e}",
              content: "<table><tbody><tr><td><img class='siteImage' src='{URL_I}' style='min-width:400px; height:auto; padding-right: 5px;'></td></tr></tbody></table><h1>{Title}</h1><table><tbody><tr><td><h2>Construction Era:</h2></td><td><h3>{Date}</h3></td></tr><tr><td><h2>Building Use:</h2></td><td><h3>{Usage}</h3></td></tr><tr><td><h2>Condition:</h2></td><td><h3>{building_c}</h3></td></tr><tr><td><h2>Survey Date:</h2></td><td><h3>{DateTxt}</h3></td></tr><tr><td><h2>Building Report:</h2></td><td><h3><a href='{URL_R}' target='_blank'>Read the UVa report</a></h3></td></tr><tr></tbody></table><h2 class='desc'>Description:</h2><h3 class='desc'>{Desc1}{Desc2}{Desc3}{Desc4}{Desc5}{Desc6}</h3></div>",
              expressionInfos: arcadeExpressions 
          }, 
                                              
                                              
                                             
        });

/********Non-Historic Buildings**********/  
          
        const nonHistBuildings = new SceneLayer({ url:"https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/Non_Historic_Buildings/SceneServer",
          popupEnabled: false,
          definitionExpression: "FID <> 624", 
        });
          
        var nonHistSymbol = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: [224, 224, 224]
              }
            }
          ]
        };

        nonHistBuildings.renderer = {
          type: "simple", 
          symbol: nonHistSymbol
        };
        
        const terminalBuildings = new SceneLayer({ url:"https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/Terminal_Buildings/SceneServer",
        popupEnabled: false,
        visible: false,
        });
        var termSymbol = {
          type: "mesh-3d",
          symbolLayers: [
            {
              type: "fill",
              material: {
                color: [224, 224, 224]
              }
            }
          ]
        };

        terminalBuildings.renderer = {
          type: "simple",
          symbol: termSymbol
        };          
          
        const tileBaseMap = new VectorTileLayer({
        url:"https://tiles.arcgis.com/tiles/uX5kr9HIx4qXytm9/arcgis/rest/services/Falmouth_Basemap/VectorTileServer",
        opacity: 0.9
        });   
          
        var map = new WebScene({
          layers: [tileBaseMap, histBuildings, nonHistBuildings, terminalBuildings,  terminal, terminalStreets, /*ocean,*/ trees, ship, labels],
          //ground: "world-elevation"
        });
          
        // Test Overview Map//  
        var overviewMap = new Map({
            basemap: "satellite"
        })
        // End Test Overview Map//
        
           
        map.ground.opacity = 0

        var view = new SceneView({
         container: "viewDiv",
          map: map,
          viewingMode: "global",
          qualityProfile: "high",
          alphaCompositingEnabled: true,
          popup: {
              collapseEnabled: false,
              dockOptions: {
                  buttonEnabled: false,
                  breakpoint: {
                      height: 1000
                  }
              } 
          },
          ui: {
              components: ["zoom"]
          },    
          environment: {
            background:{
                type: "color", 
                color: [0, 0, 0, 0]
            },
          lighting: {
            directShadowsEnabled: true,
            date: new Date("Sun Mar 15 2019 19:00:00 GMT+0100 (CET)")    
          },  
            atmosphereEnabled: false,
            starsEnabled: false,
          },
          camera: {
            position: {
              latitude: 18.50926977306011,  //18.50936977306011 
              longitude: -77.656, //-77.65350820650134  
              z: 1500
            },
            tilt: 50,
            heading: 180
          },
          constraints: {
              altitude: {
                min: 30,
                max: 200000,
                //tilt: 100
              },
            }
        });
          
        view.ui.move( "zoom", "bottom-right");  
          
        view.popup.viewModel.actions = false;  
          
        /*var editor = new Editor({
            view: view
        });
        
        view.ui.add(editor, "top-right");*/ 
          
        // More Test Overview Map //
        var mapView = new MapView({
          container: "overview",
          map: overviewMap,
          constraints: {
            rotationEnabled: false
          },
          zoom: 13,
          center: [-77.6561900839394, 18.492866175319225], 
        });
        
        mapView.ui.components = [];

        mapView.when(function () {
          view.when(function () {
            setup();
          });
        });
          
        function setup() {
          const extent3Dgraphic = new Graphic({
            geometry: null,
            symbol: {
              type: "simple-fill",
              color: [0, 0, 0, 0],
              outline: {
                  color: "#FC8D62",
                  width: 1.5,
                  style: "solid"    
              }
            }
          });
          mapView.graphics.add(extent3Dgraphic);

          watchUtils.init(view, "extent", function (extent) {
            // Sync the overview map location
            // whenever the 3d view is stationary
            if (view.stationary) {
              mapView
                .goTo({
                  center: view.center,
                  scale:
                    view.scale *
                    2 *
                    Math.max(
                      view.width / mapView.width,
                      view.height / mapView.height
                    )
                })
                .catch(function (error) {
                  // ignore goto-interrupted errors
                  if (error.name != "view:goto-interrupted") {
                    console.error(error);
                  }
                });
            }

            extent3Dgraphic.geometry = extent;
          });
        }
        // End Test Overview Map//   
          
        /*********Layer Controls*************/
                   
        var cruiseButton = document.getElementById("cruiseButton");

        cruiseButton.addEventListener("click", function() {
            if (terminal.visible == false) {
                terminal.visible = true;
                terminalBuildings.visible = true;
                terminalStreets.visible = true;
                ship.visible = true;
                nonHistBuildings.definitionExpression = "FID NOT IN (1164, 1166, 1167, 1168, 1169, 1170, 1171, 1172, 1173, 1174, 1175, 1176, 1177, 1178, 1179, 1180, 1181, 1182, 1183, 1184, 1185, 1186, 1187, 1188, 1189, 1190, 1191, 1192, 1193, 1194, 1195, 1196, 1197, 1198, 1199, 1200, 1201, 1202, 1203, 1204, 1205, 1417, 1418, 1421, 1425, 1426, 1432, 624)"
            } else {
               terminal.visible = false;
               terminalBuildings.visible = false;
               terminalStreets.visible = false;
               ship.visible = false;
               nonHistBuildings.definitionExpression = "FID <> 624"
            }
        });  
          
          
        /************Info Window Jquery**********/     
        
        $(document).ready(function(){
          $("#infoButton").click(function(){
            if ( $('#overview').css('visibility') == 'hidden' )
                $('#overview').css('visibility','visible');
              else
                $('#overview').css('visibility','hidden');  
          });
        });    

        /*$("#infoButton").click(function() {
          $(".esri-icon-maps").toggleClass("esri-icon-maps-clicked");   
        });*/
          
        $('#infoButton').click(function()
        {
             $('#infoButton').toggleClass('esri-icon-maps esri-icon-collapse'); //Adds 'a', removes 'b' and vice versa
        });  
 
          
          
      });