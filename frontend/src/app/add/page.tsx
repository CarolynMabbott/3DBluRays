"use client";

import { addSeries, addSingleBluRay, fetchBluRaySeries } from "../util";
import styles from "../page.module.css";
import { useQuery } from "react-query";

export default function Page() {
  const {
    isLoading,
    error,
    data: series,
  } = useQuery("series", fetchBluRaySeries);

  if (isLoading) return "Loading...";
  if (error) return "An error occurred: " + error;
  if (series === undefined) return "Series not found";

  return (
    <main className={styles.main}>
      <div className={styles.card__content}>
        <h2>Add</h2>
        <form>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" />
          <label htmlFor="series">Series</label>
          <input type="text" id="series" name="series" />
          <label htmlFor="Includes 2D Version">Includes 2D Version</label>
          <input
            type="checkbox"
            id="Includes 2D Version"
            name="Includes 2D Version"
          />
          <label htmlFor="Includes 4K Version">Includes 4K Version</label>
          <input
            type="checkbox"
            id="Includes 4K Version"
            name="Includes 4K Version"
          />
          <label htmlFor="Steelbook Edition">Steelbook Edition</label>
          <input
            type="checkbox"
            id="Steelbook Edition"
            name="Steelbook Edition"
          />
          <label htmlFor="Has Slipcover">Has Slipcover</label>
          <input type="checkbox" id="Has Slipcover" name="Has Slipcover" />
          <label htmlFor="barcode">Barcode</label>
          <input type="text" id="barcode" name="barcode" />
          <button
            onClick={async (e) => {
              e.preventDefault();
              let nameElement = document.getElementById(
                "name",
              ) as HTMLInputElement;
              let seriesElement = document.getElementById(
                "series",
              ) as HTMLInputElement;
              let includes2DVersionElement = document.getElementById(
                "Includes 2D Version",
              ) as HTMLInputElement;
              let includes4KVersionElement = document.getElementById(
                "Includes 4K Version",
              ) as HTMLInputElement;
              let steelbookEditionElement = document.getElementById(
                "Steelbook Edition",
              ) as HTMLInputElement;
              let hasSlipcoverElement = document.getElementById(
                "Has Slipcover",
              ) as HTMLInputElement;
              let barcodeElement = document.getElementById(
                "barcode",
              ) as HTMLInputElement;
              if (nameElement.value === "") {
                alert("Please enter a name.");
                return;
              }
              if (seriesElement.value === "") {
                alert("Please enter a series.");
                return;
              }
              if (barcodeElement.value === "") {
                alert("Please enter a barcode.");
                return;
              }
              let newBluray = {
                Name: nameElement.value,
                Series: seriesElement.value,
                Includes2D: includes2DVersionElement.checked,
                Includes4K: includes4KVersionElement.checked,
                SteelbookEdition: steelbookEditionElement.checked,
                HasSlipcover: hasSlipcoverElement.checked,
                Barcode: barcodeElement.value,
              };
              // if series not match one of series then pop up / just add it
              if (!series.includes(newBluray.Series)) {
                //TODO - Add pop up to ask user did they want toadd series
                await addSeries(newBluray.Series);
              }
              await addSingleBluRay(newBluray);
              alert("BluRay added successfully");
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
