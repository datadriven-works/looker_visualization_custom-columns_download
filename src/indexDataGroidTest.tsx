import Hello from "./hello";
import React from "react";
import ReactDOM from "react-dom";

import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

import {
  createColumnsFromQueryFields,
  createDataFromLookerData,
} from "./AdvancedTable";

// @ts-ignore
looker.plugins.visualizations.add({
  // Id and Label are legacy properties that no longer have any function besides documenting
  // what the visualization used to have. The properties are now set via the manifest
  // form within the admin/visualizations page of Looker

  id: "react_test",
  label: "React Test",
  options: {
    font_size: {
      type: "string",
      label: "Font Size",
      values: [{ Large: "large" }, { Small: "small" }],
      display: "radio",
      default: "large",
    },
  },
  // Set up the initial state of the visualization
  create: function (element, config) {
    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
        .hello-world-vis {
          /* Vertical centering */
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }
        .hello-world-text-large {
          font-size: 72px;
        }
        .hello-world-text-small {
          font-size: 18px;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    let container = element.appendChild(document.createElement("div"));
    container.className = "hello-world-vis";

    // Create an element to contain the text.
    this._textElement = container.appendChild(document.createElement("div"));

    // Render to the target element
    this.chart = ReactDOM.render(
      <Hello data="loading..." />,
      this._textElement
    );
  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    console.log("data", data);
    console.log("element", element);
    console.log("config", config);
    console.log("queryResponse", queryResponse);
    console.log("details", details);
    console.log("done", done);

    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.dimensions.length == 0) {
      this.addError({
        title: "No Dimensions",
        message: "This chart requires dimensions.",
      });
      return;
    }

    // Set the size to the user-selected size
    if (config.font_size == "small") {
      this._textElement.className = "hello-world-text-small";
    } else {
      this._textElement.className = "hello-world-text-large";
    }

    // Grab the first cell of the data
    let firstRow = data[0];
    const firstCell = firstRow[queryResponse.fields.dimensions[0].name].value;

    const rows: GridRowsProp = [
      { id: 1, col1: "Hello", col2: "World" },
      { id: 2, col1: "DataGridPro", col2: "is Awesome" },
      { id: 3, col1: "MUI", col2: "is Amazing" },
    ];

    const columns = createColumnsFromQueryFields(config["query_fields"]);
    console.log("columns", columns);

    const tableData = createDataFromLookerData(data);
    console.log("tableData", tableData);
    // Finally update the state with our new data
    this.chart = ReactDOM.render(
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid rows={tableData} columns={columns} />
      </div>,
      this._textElement
    );

    // We are done rendering! Let Looker know.
    done();
  },
});
