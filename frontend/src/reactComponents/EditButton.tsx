"use client";

import Link from "next/link";

interface EditButtonProps {
  ID: number;
}

export default function EditButton({ ID }: EditButtonProps) {
  return (
    <Link href={`/bluray/edit?id=${ID}`}>
      <td>✏️</td>
    </Link>
  );
}
