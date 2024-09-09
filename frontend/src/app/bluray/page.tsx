"use client";

import { useQuery } from "react-query";
import { fetchSingleBluRay } from "../util";
import styles from "../page.module.css";
import ConfirmDelete from "../../reactComponents/ConfirmDelete";
import { useState } from "react";
import Link from "next/link";

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
  const [blurayToBeDeleted, setBlurayTobeDeleted] = useState(0);

  const handleDelete = (ID: number) => {
    setShowConfirm(true);
    setBlurayTobeDeleted(ID);
  };

  if (isLoading) return "Loading...";
  if (error) return "An error occurred: " + error;

  return (
    <main className={styles.main}>
      <div className={styles.card__content}>
        <h2>{bluray.Name}</h2>
        <table>
          <thead>
            <tr className={styles.rowHeading}>
              <th>Series</th>
              <th>Includes 2D</th>
              <th>Includes 4K</th>
              <th>Steelbook Edition</th>
              <th>Has Slipcover</th>
              <th>Barcode</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.row}>
              <Link href={`/series/blurays?name=${bluray.Series}`}>
                  <td>{bluray.Series}</td>
              </Link>
              <td>{bluray.Includes2D ? "Yes" : "No"}</td>
              <td>{bluray.Includes4K ? "Yes" : "No"}</td>
              <td>{bluray.SteelbookEdition ? "Yes" : "No"}</td>
              <td>{bluray.HasSlipcover ? "Yes" : "No"}</td>
              <td>{bluray.Barcode}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button
          onClick={async () => {
            handleDelete(id);
          }}
        >
          Delete
        </button>
      </div>
      <ConfirmDelete
        showConfirm={showConfirm}
        blurayToBeDeleted={blurayToBeDeleted}
        setShowConfirm={setShowConfirm}
        refreshToHome={true}
      />
    </main>
  );
}
