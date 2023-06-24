"use client";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const perth = {
    lat: -31.951640981181253,
    lng: 115.85195701582528,
};

export default function Map() {
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

            console.log("Updating dimensions", { width, height });
        });
        observer.observe(parent);
    }, [containerRef]);

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
                >
                    { /* Child components, such as markers, info windows, etc. */}
                    <></>
                </GoogleMap>
            </LoadScript>
        </div>
    )
}

