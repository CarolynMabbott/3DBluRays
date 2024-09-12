"use client";

import { useQuery } from "react-query";
import { fetchBluraysInSeries } from "../../util";
import styles from "../../page.module.css";
import Link from "next/link";
import { useState } from "react";
import ConfirmDelete from "../../../reactComponents/ConfirmDelete";
import DeleteButton from "@/reactComponents/DeleteButton";
import EditButton from "@/reactComponents/EditButton";

export default function Page({
  searchParams,
}: {
  searchParams?: {
    name?: string;
  };
}) {
  const name = searchParams?.name || "";
  const {
    isLoading,
    error,
    data: bluraySeries,
  } = useQuery(["seriesOfBlurays", name], () => fetchBluraysInSeries(name));
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
        <h2>BluRay Series</h2>
        <table>
          <thead>
            <tr className={styles.rowHeading}>
              <th>Name</th>
              <th>Series</th>
              <th>Barcode</th>
            </tr>
          </thead>
          <tbody>
            {bluraySeries.map((item: any, index: number) => (
              <tr key={index} className={styles.row}>
                <Link href={`/bluray?id=${item.ID}`}>
                  <td>{item.Name}</td>
                </Link>
                <td>{item.Series}</td>
                <td>{item.Barcode}</td>
                <EditButton ID={item.ID} />
                <DeleteButton handleDelete={handleDelete} ID={item.ID} />
              </tr>
            ))}
          </tbody>
        </table>
        <ConfirmDelete
          showConfirm={showConfirm}
          blurayToBeDeleted={blurayToBeDeleted}
          setShowConfirm={setShowConfirm}
          refreshToHome={false}
        />
      </div>
    </main>
  );
}
