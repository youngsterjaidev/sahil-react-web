import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import firebase from "firebase/app";
//import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker'

//const worker = new Worker('./worker.js')

//mapbox.workerClass = MapboxWorker
mapboxgl.accessToken =
    "pk.eyJ1IjoiamFpZGV2djk5OSIsImEiOiJja25vcHhkNjExYmR4MnZwcmU3MG9wd2hlIn0.YV5iqi1TiI1nSWQd-bQBmA";

const tMapStyle = {
    position: "absolute",
    top: 0,
    right: 0,
    lelft: 0,
    bottom: 0,
    width: "100%",
    height: "100vh",
};

const App = () => {
    const mapContainer = useRef();
    const [lng, setLng] = useState(0);
    const [lat, setLat] = useState(0);
    const [zoom, setZoom] = useState(9);

    // send location to the server
    const sendUserLocation = () => {
        setInterval(() => {
            //console.log("sending")
            navigator.geolocation.getCurrentPosition((e) => {
                console.log("------", e.coords);
                firebase
                    .database()
                    .ref()
                    .child("web")
                    .child("location")
                    .set(
                        {
                            currentLocation: {
                                latitude: e.coords.latitude,
                                longitude: e.coords.longitude,
                                time: Math.random(),
                            },
                        },
                        (err) => {
                            if (err) {
                                console.log(
                                    "Error occured while sending the location",
                                    err
                                );
                            } else {
                                console.log("Location is send", err);
                            }
                        }
                    );
            });
        }, 1000);
    };

    // initialze the map before render and react create element that contain map
    /*useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current, // reference where the map will be shows
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: zoom,
        });

        let bounds = [
            [76.2188, 31.2674],
            [77.1743, 31.229],
        ];

        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true,
            },
            trackingUserLocation: true,
            trackUserLocation: true,
            showAccuracyCircle: false,
            showUserLocation: true,
        });

        firebase
            .database()
            .ref()
            .child("web")
            .child("location")
            .on("value", (snap) => {
                console.log("The value from the firebase", snap.val());
            });
            
        sendUserLocation();

        map.on("load", () => {
            // no need the press the  uselocation button
            geolocate.trigger();
        });

        geolocate.on("geolocate", (e) => {
            console.log("On geo Locate", e);
            //setLng(e.coords.longitude);
            //setLat(e.coords.latitude);
            //map.flyTo({ center: [e.coords.longitude, e.coords.latitude], zoom: 9})
            //navigator.geolocation.getCurrentPosition((e) => {
                /*firebase.database().ref().child("web").child("location").set({
                    currentLocation: {
                        latitude: e.coords.latitude,
                        longitude: e.coords.longitude,
                        timestamp: e.timestamp
                    }
                }, err => {
                    if(err) {
                        console.log("Error comes")
                    } else {
                        console.log("Hurry ! Location send")
                    }
                })*/
    /*map.flyTo({
                    center: [e.coords.longitude, e.coords.latitude],
                    zoom: 15,
                });
            //});
        });

        //map.setMaxBounds(bounds)

        map.addControl(geolocate);

        map.on("move", () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        return () => map.remove();
    }, []);*/

    const callWebWorker = () => {
        //worker.postMessage({ state: true })
    }


    const initialzeMap = async () => {
        try {
            var map = await new mapboxgl.Map({
                container: mapContainer.current, // reference where the map will be shows
                style: "mapbox://styles/mapbox/streets-v11",
                center: [lng, lat],
                zoom: zoom,
            });
            var geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackingUserLocation: true,
                trackUserLocation: true,
                showAccuracyCircle: false,
                showUserLocation: true,
            });

            const animateMarker = () => {

            firebase
            .database()
            .ref()
            .child("web")
            .child("location")
            .on("value", (snap) => {
                console.log("The value from the firebase", snap.val());
                var marker = new mapboxgl.Marker({
                    draggable: true
                }).setLngLat([
                    lng, 
                    lat
                ]).addTo(map)
            });

                requestAnimationFrame(animateMarker)
            }

            map.on("load", () => {
                // no need the press the  uselocation button
                geolocate.trigger();
            });

            geolocate.on("geolocate", (e) => {
                console.log("On geo Locate", e);
                //setLng(e.coords.longitude);
                //setLat(e.coords.latitude);
                //map.flyTo({ center: [e.coords.longitude, e.coords.latitude], zoom: 9})
                map.flyTo({
                    center: [e.coords.longitude, e.coords.latitude],
                    zoom: 15,
                });
            });

            map.addControl(geolocate);

            map.on("move", () => {
                setLng(map.getCenter().lng.toFixed(4));
                setLat(map.getCenter().lat.toFixed(4));
                setZoom(map.getZoom().toFixed(2));
            });
            requestAnimationFrame(animateMarker)

        } catch (e) {
            console.log("Error Occured", e);
        }
    };

    useEffect(() => {
        initialzeMap();
        sendUserLocation();
    }, []);

    return (
        <div>
            <div style={tMapStyle} ref={mapContainer}></div>
        </div>
    );
};

export default App;
