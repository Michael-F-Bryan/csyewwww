"use client";

import {
  GoogleMap,
  LoadScript,
  Polygon as PolygonElement,
} from "@react-google-maps/api";
import { Ref, useEffect, useRef, useState } from "react";
import { Location, WarningArea } from "../../types";
import { isPointInPolyon } from "../coordinates";

const perth: Location = {
  lat: -31.951640981181253,
  lng: 115.85195701582528,
};

interface Props {
  onClick?: (polygon: WarningArea, location: Location) => void;
}

export default function Map({ onClick }: Props) {
  const warningAreas = useWarningAreas();
  const { width, height, ref } = useParentDimensions();

  const polygons = warningAreas.map((poly, i) => {
    const options = polygonOptions(poly);
    return <PolygonElement path={poly.vertices} options={options} key={i} />;
  });
  console.log({ warningAreas, polygons });

  const onMapClicked = (e: google.maps.MapMouseEvent) => {
    const location = e.latLng?.toJSON();
    if (!location) {
      return;
    }

    console.log("Clicked", location);

    const selectedWarningAreas = warningAreas.filter((area) =>
      isPointInPolyon(location, area.vertices)
    );
    console.log("Selected", selectedWarningAreas);
  };

  return (
    <div
      ref={ref}
      style={{
        flex: "0 1 auto",
      }}
    >
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={{ width, height }}
          center={perth}
          zoom={10}
          onClick={onMapClicked}
        >
          <>{...polygons}</>
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

function useWarningAreas(): WarningArea[] {
  const [warningAreas, setWarningAreas] = useState<WarningArea[]>([]);

  useEffect(() => {
    fetch("/api/warnings")
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.text();
          console.log("Error", body);
          throw new Error(response.status + " " + response.statusText);
        }

        const warningAreas = await response.json();
        console.log("Setting warning areas", warningAreas);
        setWarningAreas(warningAreas);
      })
      .catch(console.error);
  }, []);

  console.log("Warning areas", warningAreas);

  return warningAreas;
}

function useParentDimensions(): { width: string, height: string, ref: Ref<HTMLDivElement> } {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState("400px");
  const [height, setHeight] = useState("400px");

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) {
      return;
    }

    const observer = new ResizeObserver((event) => {
      const width = event[0].contentBoxSize[0].inlineSize;
      setWidth(`${width}px`);
      const height = event[0].contentBoxSize[0].blockSize;
      setHeight(`${height}px`);
    });
    observer.observe(parent);
  }, [ref]);

  return { ref, width, height };
}
