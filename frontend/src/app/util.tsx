import { json } from "stream/consumers";

export interface BluRayWithoutID {
  Name: string;
  Series: string;
  Includes2D: boolean;
  Includes4K: boolean;
  SteelbookEdition: boolean;
  HasSlipcover: boolean;
  Barcode: string;
}

export interface BluRay extends BluRayWithoutID {
  ID: number;
}

export interface BluRaySeries {
  ID: number;
  Name: string;
}

const fetchJSON = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      "Network response was not ok. Response status is:" + response.status,
    );
  }
  return response.json();
};

export const fetchBluRays = async () => {
  return (await fetchJSON("http://localhost:8080/blurays")) as BluRay[];
};

export const fetchUltraHDs = async () => {
  return (await fetchJSON("http://localhost:8080/ultraHD")) as BluRay[];
};

export const fetchSteelbooks = async () => {
  return (await fetchJSON("http://localhost:8080/steelbooks")) as BluRay[];
};

export const fetchSingleBluRay = async (id: number) => {
  return (await fetchJSON("http://localhost:8080/bluray?id=" + id)) as BluRay;
};

export const deleteSingleBluRay = async (id: number) => {
  const response = await fetch("http://localhost:8080/bluray/delete?id=" + id, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(
      "Network response was not ok. Response status is:" + response.status,
    );
  }
};

export const addSingleBluRay = async (data: BluRayWithoutID) => {
  const response = await fetch("http://localhost:8080/bluray/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(
      "Network response was not ok. Response status is:" + response.status,
    );
  }
};

export const fetchBluRaySeries = async () => {
  return (await fetchJSON("http://localhost:8080/bluray/series")) as string[];
};

export const fetchBluraysInSeries = async (name: string) => {
  return (await fetchJSON(
    "http://localhost:8080/series/blurays?name=" + name,
  )) as BluRay[];
};

export const fetchSeries = async () => {
  return (await fetchJSON("http://localhost:8080/series")) as BluRaySeries[];
};

export const addSeries = async (seriesName: string) => {
  const response = await fetch("http://localhost:8080/series/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: seriesName,
  });
  if (!response.ok) {
    throw new Error(
      "Network response was not ok. Response status is:" + response.status,
    );
  }
};

export const patchSingleBluray = async (data: BluRay) => {
  const response = await fetch("http://localhost:8080/bluray/edit", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(
      "Network response was not ok. Response status is:" + response.status,
    );
  }
};

export const deleteSeries = async (id: number) => {
  const response = await fetch("http://localhost:8080/series/delete?id=" + id, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(
      "Network response was not ok. Response status is:" + response.status,
    );
  }
};
