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
