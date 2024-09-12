"use client";

import { deleteSingleBluRay } from "@/app/util";
import { useRef } from "react";
import { useQueryClient } from "react-query";
import styles from "../app/page.module.css";

interface ConfirmDeleteProps {
  showConfirm: boolean;
  blurayToBeDeleted: number;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  refreshToHome: boolean;
}

export default function ConfirmDelete({
  showConfirm,
  blurayToBeDeleted,
  setShowConfirm,
  refreshToHome,
}: ConfirmDeleteProps) {
  const queryClient = useQueryClient();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleConfirm = async () => {
    await deleteSingleBluRay(blurayToBeDeleted);
    if (refreshToHome) {
      window.location.href = "/";
    }
    queryClient.invalidateQueries("blurays");
    queryClient.invalidateQueries("seriesOfBlurays");
    queryClient.invalidateQueries("ultra");
    queryClient.invalidateQueries("steelbooks");
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    dialogRef.current?.showModal();
  } else {
    dialogRef.current?.close();
  }

  return (
    <dialog ref={dialogRef} className={styles.confirmDelete}>
      <h2>Are you sure you want to delete?</h2>
      <button onClick={handleConfirm}>Yes</button>
      <button autoFocus={true} onClick={handleCancel}>
        No
      </button>
    </dialog>
  );
}
