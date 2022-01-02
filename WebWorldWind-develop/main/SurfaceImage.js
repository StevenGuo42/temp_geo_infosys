/*
 * Copyright 2003-2006, 2009, 2017, 2020 United States Government, as represented
 * by the Administrator of the National Aeronautics and Space Administration.
 * All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License
 * at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * NASAWorldWind/WebWorldWind also contains the following 3rd party Open Source
 * software:
 *
 *    ES6-Promise – under MIT License
 *    libtess.js – SGI Free Software License B
 *    Proj4 – under MIT License
 *    JSZip – under MIT License
 *
 * A complete listing of 3rd Party software notices and licenses included in
 * WebWorldWind can be found in the WebWorldWind 3rd-party notices and licenses
 * PDF found in code  directory.
 */
/**
 * Illustrates how to display and pick SurfaceImages.
 */
 
// requirejs(['./WorldWindShim',
        // './LayerManager'],
        // main(WorldWind, LayerManager)
// );




requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var CoordLayer = new WorldWind.CoordinatesDisplayLayer(wwd);
        var layers = [
            // Imagery layers.
            {layer: new WorldWind.BMNGLayer(), enabled: true},
            {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            // Add atmosphere layer on top of all base layers.
            {layer: new WorldWind.AtmosphereLayer(), enabled: true},
            // WorldWindow UI layers.
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: CoordLayer, enabled: true},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);
        }



        // Create a surface image using a static image.
                                                        //S, N, W, E
        var surfaceImage1 = new WorldWind.SurfaceImage(new WorldWind.Sector(20.9, 49.5, 18.35, 76.2),
            "./HellenisticCityFoundations2.jpg");
        surfaceImage1.opacity = 0.5;
        

        // Add the surface images to a layer and the layer to the WorldWindow's layer list.
        var surfaceImageLayer = new WorldWind.RenderableLayer();
        surfaceImageLayer.displayName = "Surface Images";
        surfaceImageLayer.addRenderable(surfaceImage1);
        wwd.addLayer(surfaceImageLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
        
        
        
        
        //img opacity slider
        var opacity_slider = document.getElementById("opacity_slider");
        opacity_slider.addEventListener("change", function() {
            surfaceImage1.opacity = opacity_slider.value/100;
        }, false);
        
        
        //mousemove EventListener, for getting coordinates
        var coords_p_last = null; var coords_p_now;
        wwd.addEventListener("mousemove", function (event) {
            var coords_p = document.getElementById("coords_p");
            //if null, same as last
            coords_p_last = coords_p_now;
            if (CoordLayer.terrainPosition==null){
                coords_p_now=coords_p_last;
            }else{
                coords_p_now=CoordLayer.terrainPosition;
            }
            
            coords_p.innerHTML="coordinates: "+coords_p_now;
            

        });
        
        
    });
