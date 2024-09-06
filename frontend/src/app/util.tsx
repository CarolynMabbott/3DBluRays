const fetchJSON = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchBluRays = async () => {
  return await fetchJSON("http://localhost:8080/blurays");
};

export const fetchSingleBluRay = async (id: number) => {
  return await fetchJSON("http://localhost:8080/bluray?id=" + id);
};

export const deleteSingleBluRay = async (id: number) => {
  const response = await fetch("http://localhost:8080/bluray/delete?id=" + id, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};

export const addSingleBluRay = async (data: any) => {
  const response = await fetch("http://localhost:8080/bluray/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
};

export const fetchBluRaySeries = async () => {
  return await fetchJSON("http://localhost:8080/series");
};

export const fetchBluraysInSeries = async (name: string) => {
  return await fetchJSON("http://localhost:8080/series/blurays?name=" + name);
};
