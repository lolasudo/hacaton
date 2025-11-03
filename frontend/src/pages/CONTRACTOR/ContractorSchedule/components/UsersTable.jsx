import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import styles from "../styles/ContractorSchedule.module.scss";

const columnHelper = createColumnHelper();

const UsersTable = ({ data }) => {
  const columns = [
    columnHelper.accessor("name", {
      header: "ФИО / Организация",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("role", {
      header: "Роль",
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("organization", {
      header: "Организация", 
      cell: info => info.getValue(),
    }),
    columnHelper.accessor("phone", {
      header: "Контакты",
      cell: info => (
        <div className={styles.contacts}>
          <div>{info.getValue()}</div>
          <div className={styles.email}>{info.row.original.email}</div>
        </div>
      ),
    }),
    columnHelper.accessor("lastActivity", {
      header: "Последняя активность",
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Действия",
      cell: ({ row }) => (
        <div className={styles.actions}>
          <button 
            className={styles.iconBtn}
            onClick={() => window.open(`tel:${row.original.phone}`)}
          >
            <FaPhone />
          </button>
          <button 
            className={styles.iconBtn}
            onClick={() => window.open(`mailto:${row.original.email}`)}
          >
            <FaEnvelope />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;