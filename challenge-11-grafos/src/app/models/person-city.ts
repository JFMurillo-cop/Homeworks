export type CityData = {
  kind: 'city';
  name: string;
};

export type PersonData = {
  kind: 'person';
  name: string;
  age: number;
  cityId: string; // a qué ciudad está referenciada esta persona
};

export type NodeData = CityData | PersonData;
