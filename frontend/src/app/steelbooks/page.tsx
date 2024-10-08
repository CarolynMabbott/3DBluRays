"use client";

import styles from "./../page.module.css";
import { useQuery } from "react-query";
import { fetchSteelbooks } from "./../util";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import ConfirmDelete from "../../reactComponents/ConfirmDelete";
import DeleteButton from "@/reactComponents/DeleteButton";
import EditButton from "@/reactComponents/EditButton";

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
  const {
    isLoading,
    error,
    data: steelbooks,
  } = useQuery("steelbooks", fetchSteelbooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [blurayToBeDeleted, setBlurayTobeDeleted] = useState(0);

  if (isLoading) return "Loading...";
  if (error) return "An error occurred: " + error;
  if (steelbooks === undefined) return "Steelbook BluRays not found";

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
      <h1>Steelbook BluRays</h1>
      <table>
        <thead>
          <tr className={styles.rowHeading}>
            <th>Name</th>
            <th>Series</th>
            <th>Barcode</th>
          </tr>
        </thead>
        <tbody>
          {steelbooks
            .filter(
              (item) =>
                item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.Series.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((item, index) => (
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
    </main>
  );
}
