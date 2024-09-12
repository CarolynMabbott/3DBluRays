"use client";

import { fetchSingleBluRay, patchSingleBluray } from "../../util";
import styles from "../../page.module.css";
import { useQuery } from "react-query";
import { useState } from "react";
import ConfirmEdit from "../../../reactComponents/ConfirmEdit";

export default function Page({
  searchParams,
}: {
  searchParams?: {
    id?: number;
  };
}) {
  const id = Number(searchParams?.id) || 1;
  const {
    isLoading,
    error,
    data: bluray,
  } = useQuery(["bluray", id], () => fetchSingleBluRay(id));
  const [showConfirm, setShowConfirm] = useState(false);
  const [blurayToBeEdited, setBlurayTobeEdited] = useState(0);

  if (isLoading) return "Loading...";
  if (error) return "An error occurred: " + error;

  const handleEditBluray = async (editedBluray: any) => {
    setShowConfirm(true);
    setBlurayTobeEdited(editedBluray);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card__content}>
        <h2>Edit Blu Ray</h2>
        <form>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" defaultValue={bluray.Name} />
          <label htmlFor="series">Series</label>
          <input
            type="text"
            id="series"
            name="series"
            defaultValue={bluray.Series}
          />
          <label htmlFor="Includes 2D Version">Includes 2D Version</label>
          <input
            type="checkbox"
            id="Includes 2D Version"
            name="Includes 2D Version"
            defaultChecked={bluray.Includes2D}
          />
          <label htmlFor="Includes 4K Version">Includes 4K Version</label>
          <input
            type="checkbox"
            id="Includes 4K Version"
            name="Includes 4K Version"
            defaultChecked={bluray.Includes4K}
          />
          <label htmlFor="Steelbook Edition">Steelbook Edition</label>
          <input
            type="checkbox"
            id="Steelbook Edition"
            name="Steelbook Edition"
            defaultChecked={bluray.SteelbookEdition}
          />
          <label htmlFor="Has Slipcover">Has Slipcover</label>
          <input
            type="checkbox"
            id="Has Slipcover"
            name="Has Slipcover"
            defaultChecked={bluray.HasSlipcover}
          />
          <label htmlFor="barcode">Barcode</label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            defaultValue={bluray.Barcode}
          />
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
              let editedBluray = {
                Name: nameElement.value,
                Series: seriesElement.value,
                Includes2D: includes2DVersionElement.checked,
                Includes4K: includes4KVersionElement.checked,
                SteelbookEdition: steelbookEditionElement.checked,
                HasSlipcover: hasSlipcoverElement.checked,
                Barcode: barcodeElement.value,
                ID: id,
              };

              handleEditBluray(editedBluray);
            }}
          >
            Make Changes
          </button>
        </form>
      </div>
      <ConfirmEdit
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        originalBluray={bluray}
        blurayToBeEdited={blurayToBeEdited}
      />
    </main>
  );
}
