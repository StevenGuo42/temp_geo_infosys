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


        //surfaceImage////////////////////////////////////////////////////////////////
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
        
        
        
        
        //img opacity slider
        var opacity_slider = document.getElementById("opacity_slider");
        opacity_slider.addEventListener("change", function() {
            surfaceImage1.opacity = opacity_slider.value/100;
        }, false);
        
        //var coords_p;
        //mousemove EventListener, for getting coordinates
        var coords_p_last = null; var coords_p_now;
        wwd.addEventListener("mousemove", function (event) {
            //coords_p = document.getElementById("coords_p");
            //if null, same as last
            coords_p_last = coords_p_now;
            if (CoordLayer.terrainPosition==null){
                coords_p_now=coords_p_last;
            }else{
                coords_p_now=CoordLayer.terrainPosition;
            }
            
            //coords_p.innerHTML="coordinates: "+coords_p_now;
        });
        
        
        
        //placemark///////////////////////////////////////////////////////////////////

        var pm_img = "../images/pushpins/castshadow-red.png",
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks"),
            placemark, highlightAttributes;
        
        
        // Set up the common placemark attributes.
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);
        placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
        placemarkAttributes.drawLeaderLine = true;
        placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;
        
        
        ///add list of placemarks to layer
        var pm_list = [[0.0,0.0,1e2,"test pm 1"],[90.0,90.0,1e2,"test pm 2"]]
        var pm_info = ["some info here...", "some more info here..."]
        var pm_count = pm_list.length; //count number of placemark
        var pm_idx_list = [...Array(pm_count).keys()] //list of idx
        
        for (var i = 0, len = pm_list.length; i < len; i++) {
            add_pm(i+1, pm_list[i]);
        }
        
        
        //function add a placemark to layer
        function add_pm(idx, pm_i){
            var x,y,h,label_text;[x,y,h,label_text] = pm_i;
            // Create the placemark and its label.
            placemark = new WorldWind.Placemark(new WorldWind.Position(x, y, h), true, null);
            placemark.label = idx.toString()+".\ufeff "+label_text + " \ufeff@\n"
                + "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n"
                + "Lon " + placemark.position.longitude.toPrecision(5).toString();
            placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

            // Create the placemark attributes for this placemark. Note that the attributes differ only by their
            // image URL.
            placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            placemarkAttributes.imageSource = pm_img;
            placemark.attributes = placemarkAttributes;

            // Create the highlight attributes for this placemark. Note that the normal attributes are specified as
            // the default highlight attributes so that all properties are identical except the image scale. You could
            // instead vary the color, image, or other property to control the highlight representation.
            highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
            highlightAttributes.imageScale = 1.2;
            placemark.highlightAttributes = highlightAttributes;

            // Add the placemark to the layer.
            placemarkLayer.addRenderable(placemark);
        }
        
        
        // Add the placemarks layer to the WorldWindow's layer list.
        wwd.addLayer(placemarkLayer);
        ﻿
        
        //get distance from a point to the mouse
/*         function dist2mouse(p){//[lat, lon]
            //mouse
            var lat2 = coords_p_now.latitude* Math.PI/180, 
                lon2 = coords_p_now.longitude* Math.PI/180;
            //point
            var lat1 = p[0]* Math.PI/180, lon1 = p[1]* Math.PI/180;
            
            var x = ((lon2-lon1)) * Math.cos((lat1+lat2)/2);
            var y = (lat2-lat1);
            var d = Math.sqrt(x*x + y*y) * R;
            
            return d;
        } */
        
        
        
        
        //mouse move, pick handling///////////////////////////////////////////////////
        var highlightedItems = [];
        var handlePick = function (recognizer) {
            // The input argument is either an Event or a TapRecognizer. Both have the same properties for determining
            // the mouse or tap location.
            var x = recognizer.clientX,
                y = recognizer.clientY;

            var redrawRequired = highlightedItems.length > 0; // must redraw if we de-highlight previously picked items

            // De-highlight any previously highlighted placemarks.
            for (var h = 0; h < highlightedItems.length; h++) {
                highlightedItems[h].highlighted = false;
            }
            highlightedItems = [];

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            if (pickList.objects.length > 0) {
                redrawRequired = true;
            }

            // Highlight the items picked by simply setting their highlight flag to true.
            if (pickList.objects.length > 0) {
                for (var p = 0; p < pickList.objects.length; p++) {
                    pickList.objects[p].userObject.highlighted = true;

                    // Keep track of highlighted items in order to de-highlight them later.
                    highlightedItems.push(pickList.objects[p].userObject);

                    // Detect whether the placemark's label was picked. If so, the "labelPicked" property is true.
                    // If instead the user picked the placemark's image, the "labelPicked" property is false.
                    // Applications might use this information to determine whether the user wants to edit the label
                    // or is merely picking the placemark as a whole.
                    if (pickList.objects[p].labelPicked) {
                        //console.log("Label picked");
                        //console.log(pickList.objects[p]);
                    }
                }
                //console.log(highlightedItems);
                
            }

            // Update the window if we changed anything.
            if (redrawRequired) {
                wwd.redraw(); // redraw to make the highlighting changes take effect on the screen
            }
        };
        
        
        //var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);
        
        // Listen for mouse moves and highlight the placemarks that the cursor rolls over.
        wwd.addEventListener("mousemove", handlePick);

        // Listen for taps on mobile devices and highlight the placemarks that the user taps.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handlePick);
        
        
        //get p, and textarea for select pm
        var pm_info_title = document.getElementById("pm_info_title");
        var info_txt = document.getElementById("info_txt");
        var current_pm = null;
        
        //handle mouse click//////////////////////////////////////////////////////////
        var handleClick = function (recognizer) {
            var x = recognizer.clientX,
                y = recognizer.clientY;
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
            
            if (recognizer.button==0){//right, select pm, display info in textarea
                if (pickList.objects.length>0){
                    if (pickList.objects[0].userObject instanceof WorldWind.Placemark && pickList.objects[1].isTerrain){//pm selected 
                        //set title to the placemark label, set textarea to info
                        pm_info_title.innerHTML = "📌 "+pickList.objects[0].userObject.label+": ";
                        var full_idx = parseInt(pickList.objects[0].userObject.label.split(".")[0])-1, idx = pm_idx_list.indexOf(full_idx); 
                        info_txt.value = pm_info[idx];
                        current_pm = idx;
                    }
                }
                else{//pm not selected 
                    pm_info_title.innerHTML = "Select placemark 📌 to display info:";
                    info_txt.value = "Click update to store the text here to the selected placemark...";
                    current_pm = null;
                }
            }
            else if (recognizer.button==2){//left, remove/add placemark
                
                //console.log(pm_list)
                
                //if click on placemark prompt remove------------------------------------
                if (pickList.objects[0].userObject instanceof WorldWind.Placemark && pickList.objects[1].isTerrain){
                    if (confirm("Press OK to remove placemark: "+pickList.objects[0].userObject.label.split("@")[0])) {
                        var full_idx = parseInt(pickList.objects[0].userObject.label.split(".")[0])-1, idx = pm_idx_list.indexOf(full_idx);
                        pm_idx_list.splice(idx, 1);
                        pm_list.splice(idx, 1);
                        pm_info.splice(idx, 1);
                        placemarkLayer.renderables.splice(idx, 1);
                        
                    }
                }
                
                //if click on terrain, add-----------------------------------------------
                else if ((pickList.objects[0].userObject instanceof WorldWind.SurfaceImage && pickList.objects[1].isTerrain) || pickList.objects[0].isTerrain) {
                    var input = prompt("Enter label for placemark: "); //.split("`");
                    //console.log([coords_p_now.latitude, coords_p_now.longitude, 1e2, input]);
                    if (input != null){//add placemark, increase count
                        pm_idx_list.push(pm_count);
                        var p = [coords_p_now.latitude, coords_p_now.longitude, 1e2, input];
                        pm_list.push(p);
                        pm_info.push("");
                        add_pm((pm_count++)+1, p);
                    }
                }
                
                
                //console.log(pm_list)
            } 
            else if (recognizer.button==1){//mid, 
                
            } 
            
        };
        
        wwd.addEventListener("mouseup", handleClick);
        
        
        //handle button click/////////////////////////////////////////////////////////
        var bt_update = document.getElementById("bt_update");
        var data_txt = document.getElementById("data_txt");
        var bt_import = document.getElementById("bt_import");
        var bt_export = document.getElementById("bt_export");
        
        //update button
        bt_update.addEventListener("click", update_info); 
        function update_info() {
            pm_info[current_pm] = info_txt.value;
        }
        
        
        //export button
        bt_export.addEventListener("click", export_pm); 
        function export_pm() {
            var pm_list_text_list = [];
            for (let pm_i of pm_list) {
                pm_list_text_list.push(pm_i.join("\ufeff,"))};
            var pm_list_text = pm_list_text_list.join("\ufeff\n+");
            
            var pm_info_text = pm_info.join("\ufeff\n+");
            
            var pm_export = [pm_list_text, pm_info_text].join("\ufeff\n|\ufeff\n");
            
            data_txt.value = pm_export;
        }
        
        
        //import button
        bt_import.addEventListener("click", import_pm); 
        function import_pm() {
            if (confirm ("Press OK to import and overwrite the placemarks.")){
            
                var pm_import = data_txt.value;
                
                var split_pm_import = pm_import.split("\ufeff\n|\ufeff\n");
                var pm_list_text = split_pm_import[0], pm_info_text = split_pm_import[1];
                
                pm_info = pm_info_text.split("\ufeff\n+");
                
                var pm_list_text_list = pm_list_text.split("\ufeff\n+");
                
                var pm_list_import = []
                for (let pm_i of pm_list_text_list) {
                    var temp_pm_i = pm_i.split("\ufeff,");
                    for (var i = 0; i < 3; i++){
                        temp_pm_i[i]=parseFloat( temp_pm_i[i]);};//x,y,h are floats
                    pm_list_import.push(temp_pm_i);
                };
                
                pm_list = pm_list_import;
                
                
                //update placemark layer
                placemarkLayer.renderables.length = 0; //clear existing pm
                for (var i = 0, len = pm_list.length; i < len; i++) {
                    //console.log(pm_list[i]);
                    add_pm(i+1, pm_list[i]);
                }
                pm_count = pm_list.length;
                pm_idx_list = [...Array(pm_count).keys()]
                // console.log(pm_list);
                // console.log(pm_info);
            };
        };
        
        
        
        
        
        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
        
        
        //console.log(placemarkLayer);
    });
