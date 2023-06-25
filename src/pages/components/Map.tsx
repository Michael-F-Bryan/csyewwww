"use client";

import {
  GoogleMap,
  LoadScript,
  Polygon as PolygonElement,
  Marker,
} from "@react-google-maps/api";
import { Ref, useEffect, useRef, useState } from "react";

import { Location, WarningArea } from "@/types";
import { isPointInPolygon } from "../coordinates";

const initialCentre: Location = {
  lat: -25.660779756858133,
  lng: 121.16933982832528,
};

interface Props {
  onClick?: (polygon: WarningArea, location: Location) => void;
  warningAreas: WarningArea[],
}

export default function Map({ onClick, warningAreas }: Props) {
  const { width, height, ref } = useParentDimensions();
  const [currentLocation, setCurrentLocation] = useState<
    Location | undefined
  >();
  const polygons = warningAreas.map((poly, i) => {
    const options = polygonOptions(poly);
    return <PolygonElement path={poly.vertices} options={options} key={i} />;
  });

  const onMapClicked = (e: google.maps.MapMouseEvent) => {
    const location = e.latLng?.toJSON();
    if (!location) {
      return;
    }

    setCurrentLocation(location);

    warningAreas
      .filter(area => isPointInPolygon(location, area.vertices))
      .forEach(area => onClick?.(area, location));
  };

  return (
    <div ref={ref} style={{ flex: "0 1 auto" }}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={{ width, height }}
          center={initialCentre}
          zoom={5}
          onClick={onMapClicked}
        >
          <>
            {...polygons}
            {currentLocation && <Marker position={currentLocation} />}
          </>
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

function polygonOptions(_: WarningArea) {
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
  return options;
}

function useParentDimensions(): {
  width: string;
  height: string;
  ref: Ref<HTMLDivElement>;
} {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState("400px");
  const [height, setHeight] = useState("400px");

  useEffect(() => {
    const parent = ref.current?.parentElement;
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
  }, [ref]);

  return { ref, width, height };
}
