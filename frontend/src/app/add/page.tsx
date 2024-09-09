"use client";

import { addSingleBluRay } from "../util";
import styles from "../page.module.css";

export default function Page() {
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
          <input type="checkbox" id="Includes 2D Version" name="Includes 2D Version" />
          <label htmlFor="Includes 4K Version">Includes 4K Version</label>
          <input type="checkbox" id="Includes 4K Version" name="Includes 4K Version" />
          <label htmlFor="Steelbook Edition">Steelbook Edition</label>
          <input type="checkbox" id="Steelbook Edition" name="Steelbook Edition" />
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
                Barcode: barcodeElement.value,
              };
              await addSingleBluRay(newBluray);
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
