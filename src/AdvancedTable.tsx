import React from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

export function createColumnsFromQueryFields(
  queryFields: Object
): GridColDef[] {
  const dimensions = queryFields["dimensions"];
  const measures = queryFields["measures"];
  const calculations = queryFields["table_calculations"];

  var columns = [];

  columns = columns.concat(
    dimensions.map((obj) => ({
      field: obj["name"],
      headerName: obj["label_short"],
      type: obj["type"],
      width: 200,
    }))
  );

  columns = columns.concat(
    measures.map((obj) => ({
      field: obj["name"],
      headerName: obj["label_short"],
      type: obj["type"],
      width: 200,
    }))
  );

  columns = columns.concat(
    calculations.map((obj) => ({
      field: obj["name"],
      headerName: obj["label"],
      type: obj["type"],
      width: 200,
    }))
  );

  return columns;
}

export function createDataFromLookerData(dataLooker): Object[] {
  var data: Object[] = [];
  var id = 1;
  dataLooker.forEach((element) => {
    var obj = {};
    obj["id"] = "";
    for (var key in element) {
      if ("rendered" in element[key]) {
        obj[key] = element[key]["rendered"];
      } else {
        obj[key] = element[key]["value"];
      }
      obj["id"] = obj["id"].concat(element[key]["value"]);
    }
    obj["id"] = obj["id"].concat(id);
    id++;
    data.push(obj);
  });

  return data;
}

export default function AdvancedTable({ queryfields, dataLooker }) {
  const columns = createColumnsFromQueryFields(queryfields);
  // console.log("columns", columns);

  const data = createDataFromLookerData(dataLooker);
  // console.log("tableData", data);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
}
