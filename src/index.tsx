import Hello from "./hello";
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import AdvancedTable from "./AdvancedTable";

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
    // console.log("element", element);
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
    this.root = createRoot(element);
    this.chart = this.root.render(<Hello data="loading..." />);
  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    // console.log("data", data);
    // console.log("element", element);
    // console.log("config", config);
    // console.log("queryResponse", queryResponse);
    // console.log("details", details);
    // console.log("done", done);

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

    this.chart = this.root.render(
      <AdvancedTable queryfields={config["query_fields"]} dataLooker={data} />
    );

    // We are done rendering! Let Looker know.
    done();
  },
});
