import exp from "constants";
import * as API from "./util";
import {it, expect} from "@jest/globals";

// to test make sure backend server is already running 

it ("adds a single BluRay", async () => {
  const newBluray = {
    Name: "Test",
    Series: "Test",
    Includes2D: true,
    Includes4K: true,
    SteelbookEdition: true,
    HasSlipcover: true,
    Barcode: "1234567890123",
  };
  await API.addSingleBluRay(newBluray);
});

let bluraytodelete:number
it ("fetches BluRays", async () => {
  const blurays = await API.fetchBluRays();
  expect(blurays).toBeDefined();
  bluraytodelete = blurays[blurays.length - 1].ID;
});

it ("patches a single BluRay", async () => {
  const newBluray = {
    ID: bluraytodelete,
    Name: "Test Changed",
    Series: "Test",
    Includes2D: false,
    Includes4K: true,
    SteelbookEdition: false,
    HasSlipcover: true,
    Barcode: "1234567890123",
  };
  await API.patchSingleBluray(newBluray);
});

it ("fetches UltraHDs", async () => {
  const ultraHDs = await API.fetchUltraHDs();
  expect(ultraHDs).toBeDefined();
});

it ("fetches Steelbooks", async () => {
  const steelbooks = await API.fetchSteelbooks();
  expect(steelbooks).toBeDefined();
});

it ("fetches a single BluRay", async () => {
  const bluray = await API.fetchSingleBluRay(bluraytodelete);
  expect(bluray).toBeDefined();
  expect(bluray.Name).toBe("Test Changed");
});

it ("deletes a single BluRay", async () => {
  await API.deleteSingleBluRay(bluraytodelete);
});

it ("fetches BluRay series", async () => {
  const bluraySeries = await API.fetchBluRaySeries();
  expect(bluraySeries).toBeDefined();
});

it ("fetches BluRays in a series", async () => {
  const blurays = await API.fetchBluraysInSeries("Pokemon");
  expect(blurays).toBeDefined();
});

it ("fetches series", async () => {
  const series = await API.fetchSeries();
  expect(series).toBeDefined();
});

it ("adds a series", async () => {
  const newSeries = {
    Name: "Test",
  };
  await API.addSeries(newSeries);
});

