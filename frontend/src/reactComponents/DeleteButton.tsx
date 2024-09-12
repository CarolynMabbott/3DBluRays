"use client";

interface DeleteButtonProps {
  handleDelete: (ID: number) => void;
  ID: number;
}

export default function DeleteButton({ handleDelete, ID }: DeleteButtonProps) {
  return (
    <td
      onClick={async () => {
        handleDelete(ID);
      }}
    >
      ❌
    </td>
  );
}
