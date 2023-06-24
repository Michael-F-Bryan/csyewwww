// Coordinate transformations for Elliptical mercator projections.
// https://wiki.openstreetmap.org/wiki/Mercator#JavaScript_(or_ActionScript)_implementation

import { Location } from "./types";

export type Mercator = {
    x: number,
    y: number,
}

const WGS84 = {
	r_major:6378137.0, //Equatorial Radius, WGS84
	r_minor:6356752.314245179, //defined as constant
	f:298.257223563, //1/f=(a-b)/a , a=r_major, b=r_minor
} as const;

function deg2rad(degree: number): number {
		return degree*(Math.PI/180.0);
}

function rad2degree(radians: number): number {
		return radians/(Math.PI/180.0);
}

export function latLongToMercator({lng, lat}: Location): Mercator {
    const x = WGS84.r_major * deg2rad(lng);

    if (lat > 89.5) lat = 89.5;
    if (lat < -89.5) lat = -89.5;

    var temp = WGS84.r_minor / WGS84.r_major;
    var es = 1.0 - (temp * temp);
    var eccent = Math.sqrt(es);

    var phi = deg2rad(lat);

    var sinphi = Math.sin(phi);

    var con = eccent * sinphi;
    var com = .5 * eccent;
    var con2 = Math.pow((1.0-con)/(1.0+con), com);
    var ts = Math.tan(.5 * (Math.PI*0.5 - phi))/con2;
    var y = 0 - WGS84.r_major * Math.log(ts);

    return { x, y };
}

export function mercatorToLatLong({x, y}: Mercator): Location {
		var lng=rad2degree((x/WGS84.r_major));

		var temp = WGS84.r_minor / WGS84.r_major;
		var e = Math.sqrt(1.0 - (temp * temp));
		var lat=rad2degree(pj_phi2( Math.exp( 0-(y/WGS84.r_major)), e));

		return {lat, lng};

}

function pj_phi2(ts: number, e: number): number {
		var N_ITER=15;
		var HALFPI=Math.PI/2;


		const TOL=0.0000000001;
		const eccnth = .5 * e;
		var Phi = HALFPI - 2. * Math.atan (ts);
		var i = N_ITER;
		do
		{
			var con = e * Math.sin (Phi);
			var dphi = HALFPI - 2. * Math.atan (ts * Math.pow((1. - con) / (1. + con), eccnth)) - Phi;
			Phi += dphi;

		}
		while ( Math.abs(dphi)>TOL && --i);
		return Phi;

}


//usage
