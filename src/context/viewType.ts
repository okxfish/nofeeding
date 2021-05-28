import React from "react";
export enum ViewType {
  list = 'LIST',
  magazine = 'MAGZ',
  threeway = '3WAY',
  card = 'CARD',
}

export const ViewTypeContext = React.createContext<any>(ViewType.magazine);
