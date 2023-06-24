export interface MessageArea {
  type: string;
  features: Feature[];
}

export interface Feature {
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Properties {
  alertLevel?: string;
  x?: number;
  y?: number;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  longitude?: number;
  latitude?: number;
}

export type Geometry = Point | Polygon;

export type Point = {
  type: "Point";
  coordinates: [number, number];
};

export type Polygon = {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
};
