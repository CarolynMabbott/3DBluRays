"use client";

import { useQuery } from "react-query";
import { fetchSingleBluRay } from "../util";
import styles from "../page.module.css";
import ConfirmDelete from "../../reactComponents/ConfirmDelete";
import { useState } from "react";

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
        <p>{bluray.Series}</p>
        <p>{bluray.Barcode}</p>
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
