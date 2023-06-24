// Coordinate transformations for Elliptical mercator projections.
// https://wiki.openstreetmap.org/wiki/Mercator#JavaScript_(or_ActionScript)_implementation

import { Location } from "./types";

export type Mercator = {
  x: number;
  y: number;
};

const WGS84 = {
  r_major: 6378137.0, //Equatorial Radius, WGS84
  r_minor: 6356752.314245179, //defined as constant
  f: 298.257223563, //1/f=(a-b)/a , a=r_major, b=r_minor
} as const;

function deg2rad(degree: number): number {
  return degree * (Math.PI / 180.0);
}

function rad2degree(radians: number): number {
  return radians / (Math.PI / 180.0);
}

export function latLongToMercator({ lng, lat }: Location): Mercator {
  const x = WGS84.r_major * deg2rad(lng);

  if (lat > 89.5) lat = 89.5;
  if (lat < -89.5) lat = -89.5;

  const temp = WGS84.r_minor / WGS84.r_major;
  const es = 1.0 - temp * temp;
  const eccent = Math.sqrt(es);

  const phi = deg2rad(lat);

  const sinphi = Math.sin(phi);

  const con = eccent * sinphi;
  const com = 0.5 * eccent;
  const con2 = Math.pow((1.0 - con) / (1.0 + con), com);
  const ts = Math.tan(0.5 * (Math.PI * 0.5 - phi)) / con2;
  const y = 0 - WGS84.r_major * Math.log(ts);

  return { x, y };
}

export function mercatorToLatLong({ x, y }: Mercator): Location {
  const lng = rad2degree(x / WGS84.r_major);

  const temp = WGS84.r_minor / WGS84.r_major;
  const e = Math.sqrt(1.0 - temp * temp);
  const lat = rad2degree(pj_phi2(Math.exp(0 - y / WGS84.r_major), e));

  return { lat, lng };
}

function pj_phi2(ts: number, e: number): number {
  const N_ITER = 15;
  const HALFPI = Math.PI / 2;

  const TOL = 0.0000000001;
  const eccnth = 0.5 * e;
  let Phi = HALFPI - 2 * Math.atan(ts);
  let i = N_ITER;
  let dphi;
  do {
    const con = e * Math.sin(Phi);
    dphi =
      HALFPI -
      2 * Math.atan(ts * Math.pow((1 - con) / (1 + con), eccnth)) -
      Phi;
    Phi += dphi;
  } while (Math.abs(dphi) > TOL && --i);
  return Phi;
}

export function isPointInPolyon(point: Location, polygon: Location[]): boolean {
  // Initialize the crossing number counter.
  let numCrossings = 0;

  // Loop over the edges of the polygon.
  for (let i = 0; i < polygon.length; i++) {
    const start = polygon[i];
    const end = polygon[i + (1 % polygon.length) - 1];

    // If the point is to the right of the edge (from the edge's first point to its second point)...
    if (
      (start.lat <= point.lat && end.lat > point.lat) || // an upward crossing
      (start.lat > point.lat && end.lat <= point.lat)
    ) {
      // a downward crossing

      // compute the actual edge-ray intersect x-coordinate
      let vt = (point.lat - start.lat) / (end.lat - start.lat);
      if (point.lng < start.lng + vt * (end.lng - start.lng)) {
        // point.lng < intersect
        ++numCrossings; // a valid crossing of y=point.lat right of point.lng
      }
    }
  }

  // The point is inside the polygon if the crossing number is odd.
  return numCrossings % 2 !== 0;
}
