"use client";

import styles from "./../page.module.css";
import { useQuery } from "react-query";
import { fetchUltraHDs } from "./../util";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import ConfirmDelete from "../../reactComponents/ConfirmDelete";

interface SearchboxProps {
  onSearch: (query: string) => void;
}

const SearchBox = ({ onSearch }: SearchboxProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div>
      <input
        className={styles.searchBox}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

export default function Home() {
  const { isLoading, error, data: ultra } = useQuery("ultra", fetchUltraHDs);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [blurayToBeDeleted, setBlurayTobeDeleted] = useState(0);

  if (isLoading) return "Loading...";
  if (error) return "An error occurred: " + error;

  const handleDelete = (ID: number) => {
    setShowConfirm(true);
    setBlurayTobeDeleted(ID);
  };

  return (
    <main className={styles.main}>
      <SearchBox
        onSearch={(query) => {
          setSearchTerm(query);
        }}
      />
      <h1>Ultra HD BluRays</h1>
      <table>
        <thead>
          <tr className={styles.rowHeading}>
            <th>Name</th>
            <th>Series</th>
            <th>Barcode</th>
          </tr>
        </thead>
        <tbody>
          {ultra
            .filter(
              (item: any) =>
                item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.Series.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((item: any, index: number) => (
              <tr key={index} className={styles.row}>
                <Link href={`/bluray?id=${item.ID}`}>
                  <td>{item.Name}</td>
                </Link>
                <td>{item.Series}</td>
                <td>{item.Barcode}</td>
                <td>
                  <button
                    onClick={async () => {
                      handleDelete(item.ID);
                    }}
                  >
                    Delete
                  </button>
                </td>
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
    </main>
  );
}
