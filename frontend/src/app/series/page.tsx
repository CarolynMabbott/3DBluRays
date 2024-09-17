"use client";

import { useQuery } from "react-query";
import { fetchBluRaySeries } from "../util";
import styles from "../page.module.css";
import Link from "next/link";

export default function Page() {
  const {
    isLoading,
    error,
    data: series,
  } = useQuery("series", fetchBluRaySeries);

  if (isLoading) return "Loading...";
  if (error) return "An error occurred: " + error;
  if (series === undefined) return "BluRay Series not found";

  return (
    <main className={styles.main}>
      <div className={styles.card__content}>
        <h2>BluRay Series</h2>
        <div>
          {series.map((item, index) => (
            <div key={index}>
              <Link href={`/series/blurays?name=${item}`}>
                <td>{item}</td>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
