"use client";

import { GoogleMap, LoadScript, Polygon as PolygonElement } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { Location, WarningArea } from '../types';

const perth: Location = {
    lat: -31.951640981181253,
    lng: 115.85195701582528,
};

interface Props {
    warningAreas: WarningArea[],
    onClick?: (polygon: WarningArea, location: Location) => void,
};

export default function Map({ warningAreas, onClick }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState('400px');
    const [height, setHeight] = useState('400px');

    useEffect(() => {
        const parent = containerRef.current?.parentElement;
        if (!parent) {
            return;
        }

        const observer = new ResizeObserver(event => {
            const width = event[0].contentBoxSize[0].inlineSize;
            setWidth(`${width}px`);
            const height = event[0].contentBoxSize[0].blockSize;
            setHeight(`${height}px`);
        });
        observer.observe(parent);
    }, [containerRef]);

    const polygons = warningAreas.map((poly, i) => polygonElement(i, poly));
    console.log(warningAreas);

    const onMapClicked = (e: google.maps.MapMouseEvent) => {
        const location = e.latLng?.toJSON();
        if (!location) {
            return;
        }

        const selectedWarningAreas = warningAreas.filter(area => isPointInPolyon(location, area.vertices));
        console.log(selectedWarningAreas);
    };

    return (
        <div ref={containerRef} style={{
            flex: "0 1 auto"
        }}>
            <LoadScript
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            >
                <GoogleMap
                    mapContainerStyle={{ width, height }}
                    center={perth}
                    zoom={10}
                    onClick={onMapClicked}
                >
                    <>
                        {...polygons}
                    </>
                </GoogleMap>
            </LoadScript>
        </div>
    )
}


function polygonElement(index: number, poly: WarningArea): PolygonElement {
    const options = {
        fillColor: "lightblue",
        fillOpacity: 0.3,
        strokeColor: "red",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        draggable: false,
        editable: false,
        geodesic: false,
        zIndex: 1,
    };
    return (<PolygonElement path={poly.vertices} options={options} key={index} />);
}

function isPointInPolyon(point: Location, polygon: Location[]): boolean {
    // Initialize the crossing number counter.
    let numCrossings = 0;

    // Loop over the edges of the polygon.
    for (let i = 0; i < polygon.length; i++) {
        const start = polygon[i];
        const end = polygon[i + 1 % polygon.length - 1];

        // If the point is to the right of the edge (from the edge's first point to its second point)...
        if (((start.lat <= point.lat) && (end.lat > point.lat))    // an upward crossing
            || ((start.lat > point.lat) && (end.lat <= point.lat))) { // a downward crossing

            // compute the actual edge-ray intersect x-coordinate
            let vt = (point.lat - start.lat) / (end.lat - start.lat);
            if (point.lng < start.lng + vt * (end.lng - start.lng)) { // point.lng < intersect
                ++numCrossings;   // a valid crossing of y=point.lat right of point.lng
            }
        }
    }

    // The point is inside the polygon if the crossing number is odd.
    return numCrossings % 2 !== 0;
}
