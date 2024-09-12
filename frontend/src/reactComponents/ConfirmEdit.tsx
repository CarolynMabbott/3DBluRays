"use client";

import { patchSingleBluray } from "@/app/util";
import { useRef } from "react";
import styles from "../app/page.module.css";

interface ConfirmEditProps {
  blurayToBeEdited: any;
  originalBluray: any;
  showConfirm: boolean;
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfirmEdit({
  blurayToBeEdited,
  originalBluray,
  showConfirm,
  setShowConfirm,
  }: ConfirmEditProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleConfirm = async () => {
    await patchSingleBluray(blurayToBeEdited);
    history.back();
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

  const result = [];
  for (let element in blurayToBeEdited) {
    let originalValue = String(originalBluray[element]);
    let newValue = String(blurayToBeEdited[element]);
    if (newValue != originalValue) {
      result.push({ element, originalValue, newValue });
    }
  }

  return (
    <dialog ref={dialogRef} className={styles.confirmDelete}>
      <h2>Are you sure you want to edit? this Blu ray</h2>
      <h2>You are making the following changes:</h2>
      {/* TODO Add in the changes */}
      <table>
        <thead className={styles.rowHeading}>
          <th>Attribute</th>
          <th>Original Value</th>
          <th>New Value</th>
        </thead>
        <tbody>
          {result.map((item, index) => (
            <tr key={index}>
              <td>{item.element}</td>
              <td>{item.originalValue}</td>
              <td>{item.newValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleConfirm}>Yes</button>
      <button autoFocus={true} onClick={handleCancel}>
        No
      </button>
    </dialog>
  );
}
