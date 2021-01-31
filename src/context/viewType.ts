import React from "react";
export enum ViewType {
  list = 1,
  magazine,
  threeway,
  card,
}

export const ViewTypeContext = React.createContext<any>(ViewType.magazine);
