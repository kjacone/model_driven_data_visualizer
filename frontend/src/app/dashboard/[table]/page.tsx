// app/dashboard/[table]/page.tsx
import { chinookData } from "@/lib/chinookData";
import { useRouter } from "next/navigation";

export default function TablePage({ params }: { params: { table: string } }) {
  const { table } = params;

  if (!table || !(table in chinookData)) {
    return (
      <div>
        <h1>Invalid Table</h1>
        <p>The table "{table}" does not exist in the Chinook dataset.</p>
      </div>
    );
  }

  const tableData = chinookData[table as keyof typeof chinookData];
  const columns = Object.keys(tableData[0]);

  return (
    <div>
      <h1>{table.charAt(0).toUpperCase() + table.slice(1)}</h1>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} style={{ border: "1px solid #ddd", padding: "8px" }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white" }}>
              {columns.map((col) => (
                <td key={col} style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {row[col as keyof typeof row]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
