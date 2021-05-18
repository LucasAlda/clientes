import React, { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp, FiCode } from "react-icons/fi";
import "../assets/styles/Table.css";

export const Table = React.memo(
  ({
    reference,
    columns,
    data,
    separator = false,
    filterStatus = false,
    style,
    className,
    loading = false,
    loadingHeight = 10,
    tableTotal,
    colTotals = [],
  }) => {
    const [sort, setSort] = useState({
      colIndex: false,
      dir: 0,
    });

    const [filter, setFilter] = useState({});

    useEffect(() => {
      if (!filterStatus) setFilter({});
    }, [filterStatus]);

    const handleSort = (e, colIndex, el) => {
      if (!e.target.className.includes("table-th")) return;
      if (!columns[colIndex].sortable) return;
      let newSort = { colIndex };
      if (sort.colIndex === colIndex) {
        newSort.dir = sort.dir === 1 ? -1 : sort.dir === -1 ? 0 : 1;
      } else {
        newSort.dir = 1;
      }
      setSort(newSort);
    };

    const handleFilter = (value, colIndex) => {
      setFilter((prev) => ({ ...prev, [colIndex]: value }));
    };

    let renderData = [...data];

    if (filterStatus) {
      renderData = renderData.filter((row) => {
        if (row.header) return true;
        let status = true;
        Object.keys(filter).forEach((filt) => {
          if (
            !(row.cells[filt].content.type === "span" ? row.cells[filt].order : row.cells[filt].content)
              .toString()
              .toLowerCase()
              .includes(filter[filt].toLowerCase())
          )
            status = false;
        });
        return status;
      });
    }

    const allTotal = colTotals.map((tot) => 0);

    if (separator && sort.dir === 0) {
      const sectionedData = [];
      let lastSection = [];
      const sectionTotal = colTotals.map((tot) => 0);

      renderData.forEach((row) => {
        if (row.header) {
          if (colTotals) {
            row.cells = [{ content: row.title, colspan: colTotals[0] }];
            for (let i = colTotals[0]; i < columns.length; i++) {
              const colTotIndex = colTotals.findIndex((tot) => tot === i);
              if (colTotIndex > -1) {
                row.cells.push({
                  className: "text-right",
                  content: sectionTotal[colTotIndex].format(),
                  order: sectionTotal[colTotIndex],
                });
                sectionTotal[colTotIndex] = 0;
              } else {
                row.cells.push({ className: "text-right", content: "", order: 0 });
              }
            }
          } else {
            row.cells = [{ content: row.title, colspan: columns.length }];
          }
          if (lastSection.length < 1) return;
          if (row.position === "top") sectionedData.push(row, ...lastSection);
          else sectionedData.push(...lastSection, row);
          lastSection = [];
        } else {
          lastSection.push(row);
          colTotals.forEach((col, i) => {
            sectionTotal[i] += row.cells[col].order;
            allTotal[i] += row.cells[col].order;
          });
        }
      });

      renderData = sectionedData;
    } else {
      if (sort.dir !== 0) {
        renderData = renderData
          .filter((row) => !row.header)
          .sort((a, b) => {
            const validation = a.cells[sort.colIndex].order
              ? a.cells[sort.colIndex].order > b.cells[sort.colIndex].order
              : a.cells[sort.colIndex].content > b.cells[sort.colIndex].content;

            if (validation) {
              return sort.dir;
            } else {
              return -sort.dir;
            }
          });
      }
      renderData.forEach((row) => {
        if (row.header) return;
        colTotals.forEach((col, i) => {
          allTotal[i] += row.cells[col].order;
        });
      });
    }

    if (tableTotal) {
      const totalRow = { className: "total", cells: [{ content: "Totales", colspan: colTotals[0] }] };

      for (let i = colTotals[0]; i < columns.length; i++) {
        const colTotIndex = colTotals.findIndex((tot) => tot === i);
        if (colTotIndex > -1) {
          totalRow.cells.push({
            className: "text-right",
            content: allTotal[colTotIndex].format(),
            order: allTotal[colTotIndex],
          });
        } else {
          totalRow.cells.push({ className: "text-right", content: "", order: 0 });
        }
      }
      renderData.push(totalRow);
    }

    return (
      <table ref={reference} className={`table${className ? ` ${className}` : ""}`} style={style}>
        <thead>
          {columns.length > 0 && (
            <tr>
              {columns.map((col, i) => (
                <th
                  className={`table-th${col.className ? " " + col.className : ""}`}
                  style={col.style || {}}
                  key={i}
                  onClick={(e) => handleSort(e, i, this)}
                >
                  {col.content}
                  {col.sortable && sort.colIndex !== i && (
                    <span className="sort-icon">
                      <FiCode style={{ transform: "rotate(90deg)" }} />
                    </span>
                  )}
                  {col.sortable && sort.colIndex === i && (
                    <span className="sort-icon">
                      {sort.dir === 1 && <FiChevronDown />}
                      {sort.dir === -1 && <FiChevronUp />}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          )}

          {filterStatus && (
            <tr>
              {columns.map((col, i) =>
                col.filterable ? (
                  <th key={i} className="th-filter">
                    <div>
                      <input
                        size="sm"
                        placeholder="filtrar"
                        onChange={(e) => handleFilter(e.target.value, i)}
                        value={filter[i] || ""}
                      />
                    </div>
                  </th>
                ) : (
                  <th key={i} className="th-filter">
                    <div></div>
                  </th>
                )
              )}
            </tr>
          )}
        </thead>
        <tbody>
          {renderData.map((tr, i) => (
            <tr
              className={tr.className || ""}
              style={tr.style}
              onClick={tr.handleClick || function () {}}
              key={i}
            >
              {tr.cells.map((td, j) => (
                <Cell
                  className={td.className}
                  title={td.title}
                  style={td.style || {}}
                  colspan={td.colspan}
                  key={j}
                >
                  {td.content}
                </Cell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
);

export const Cell = ({ children, style, className = "", title, colspan = 1 }) => {
  return (
    <td className={`cell ${className}`} title={title} style={style} colSpan={colspan}>
      {children}
    </td>
  );
};
