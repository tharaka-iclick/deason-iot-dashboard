import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { ChevronDown, Undo, Redo } from "lucide-react";
import {
  Pipe01,
  PipeView01,
  createPipe,
} from "../../../Widgets/PortLinks/PipeLink";
import * as joint from "@joint/plus";
import MotorPumpSVG from "../../../WidgetSVG/MotorPumpSVG";
import HeatPumpSVG from "../../../WidgetSVG/HeatPumpSVG";
import {
  listenForDeviceEUIs,
  listenForDeviceIDs,
  listenForDeviceData,
} from "../../../../../src/services/firebase/dataService";

class TemplateImage extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "TemplateImage",
      attrs: {
        image: {
          width: "calc(w)",
          height: "calc(h)",
        },
        label: {
          textVerticalAnchor: "top",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: "calc(h + 10)",
          fontSize: 10,
          fill: "#333333",
        },
      },
    };
  }

  preinitialize() {
    this.dataURLPrefix = "data:image/svg+xml;utf8,";
    this.markup = [
      { tagName: "image", selector: "image" },
      { tagName: "text", selector: "label" },
    ];
  }

  initialize(...args) {
    super.initialize(...args);
    this.setImageColor(); // One-time color setup
  }

  setImageColor() {
    const svg = this.get("svg") || "";
    const color = this.get("color") || "red"; // Set your desired color here
    this.attr(
      "image/href",
      this.dataURLPrefix + encodeURIComponent(svg.replace(/\$color/g, color))
    );
  }
}

// export class TemplateImage extends joint.dia.Element {
//   defaults() {
//     return {
//       ...super.defaults,
//       type: "TemplateImage",
//       size: { width: 100, height: 100 },

//       color: "blue",
//       attrs: {
//         image: {
//           width: "calc(w)",
//           height: "calc(h)",
//         },
//         label: {
//           text: "Image",
//           textVerticalAnchor: "top",
//           textAnchor: "middle",
//           x: "calc(0.5*w)",
//           y: "calc(h+10)",
//           fontSize: 10,
//           fontFamily: "sans-serif",
//           fill: "#333333",
//         },
//       },
//       portMarkup: [
//         {
//           tagName: "path",
//           selector: "portBody",
//           attributes: {
//             fill: "#FFFFFF",
//             stroke: "#333333",
//             "stroke-width": 2,
//           },
//         },
//       ],

//       ports: {
//         groups: {
//           in: {
//             // position: "left",
//             position: {
//               name: "line",
//               args: {
//                 start: { x: "calc(w)", y: "calc(h/2 + 80)" },
//                 end: { x: "calc(w)", y: 40 },
//               },
//             },
//             markup: joint.util.svg`
//                             <rect @selector="pipeBody" />
//                             <rect @selector="pipeEnd" />
//                         `,
//             size: { width: 30, height: 30 },
//             // label: { position: { name: "outside", args: { offset: 30 } } },
//             z: 1,
//             attrs: {
//               portRoot: {
//                 magnet: "active", // Allow outgoing connections
//               },
//               portLabelBackground: {
//                 ref: "portLabel",
//                 fill: "#FFFFFF",
//                 fillOpacity: 0.7,
//                 x: "calc(x - 2)",
//                 y: "calc(y - 2)",
//                 width: "calc(w + 4)",
//                 height: "calc(h + 4)",
//                 pointerEvents: "none",
//               },
//               pipeBody: {
//                 width: "calc(w)",
//                 height: "calc(h)",
//                 y: "calc(h / -2)",
//                 x: "calc(-1 * w)",
//                 fill: {
//                   type: "linearGradient",
//                   stops: [
//                     { offset: "0%", color: "gray" },
//                     { offset: "30%", color: "white" },
//                     { offset: "70%", color: "white" },
//                     { offset: "100%", color: "gray" },
//                   ],
//                   attrs: {
//                     x1: "0%",
//                     y1: "0%",
//                     x2: "0%",
//                     y2: "100%",
//                   },
//                 },
//               },
//               pipeEnd: {
//                 width: 10,
//                 height: "calc(h+6)",
//                 y: "calc(h / -2 - 3)",
//                 x: "calc(w -40)",
//                 stroke: "gray",
//                 strokeWidth: 3,
//                 fill: "white",
//               },
//               portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
//               portBody: {
//                 d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
//                 magnet: "active",
//               },
//             },
//           },
//           out: {
//             // position: "right",

//             // label: { position: { name: "outside", args: { offset: 30 } } },
//             position: {
//               name: "line",
//               args: {
//                 start: { x: "calc(w)", y: "calc(h/2)" },
//                 end: { x: "calc(w)", y: 40 },
//               },
//             },
//             size: { width: 30, height: 30 },
//             markup: joint.util.svg`
//                              <g @selector="portBodyGroup" transform="rotate(180)">
//       <rect @selector="pipeBody" />
//       <rect @selector="pipeEnd" />
//     </g>
//                         `,
//             z: 1,
//             attrs: {
//               portRoot: {
//                 magnet: "active", // Allow outgoing connections
//               },
//               portLabelBackground: {
//                 ref: "portLabel",
//                 fill: "#FFFFFF",
//                 fillOpacity: 0.8,
//                 x: "calc(x - 2)",
//                 y: "calc(y - 2)",
//                 width: "calc(w + 4)",
//                 height: "calc(h + 4)",
//                 pointerEvents: "none",
//               },
//               pipeBody: {
//                 width: "calc(w)",
//                 height: "calc(h)",
//                 y: "calc(h / -2)",
//                 fill: {
//                   type: "linearGradient",
//                   stops: [
//                     { offset: "0%", color: "gray" },
//                     { offset: "30%", color: "white" },
//                     { offset: "70%", color: "white" },
//                     { offset: "100%", color: "gray" },
//                   ],
//                   attrs: {
//                     x1: "0%",
//                     y1: "0%",
//                     x2: "0%",
//                     y2: "100%",
//                   },
//                 },
//               },
//               pipeEnd: {
//                 width: 10,
//                 height: "calc(h+6)",
//                 y: "calc(h / -2 - 3)",
//                 x: "calc(w -30)",
//                 stroke: "gray",
//                 strokeWidth: 3,
//                 fill: "white",
//               },
//               portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
//               portBody: {
//                 d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
//                 magnet: "active",
//               },
//             },
//           },
//         },
//         items: [
//           {
//             id: "in1",
//             group: "in",
//           },
//           {
//             id: "out1",
//             group: "out",
//           },
//         ],
//       },
//     };
//   }

//   preinitialize() {
//     this.dataURLPrefix = "data:image/svg+xml;utf8,";
//     this.markup = [
//       {
//         tagName: "image",
//         selector: "image",
//       },
//       {
//         tagName: "text",
//         selector: "label",
//       },
//     ];
//   }

//   initialize(...args) {
//     super.initialize(...args);
//     this.on("change:color", this.setImageColor);
//     this.setImageColor();
//   }

//   setImageColor() {
//     const svg = this.get("svg") || "";
//     const color = this.get("color") || "black";
//     this.attr(
//       "image/href",
//       this.dataURLPrefix + encodeURIComponent(svg.replace(/\$color/g, color))
//     );
//   }
// }

const DashboardEditor = () => {
  const paperContainerRef = useRef(null);
  const stencilContainerRef = useRef(null);
  const paperRef = useRef(null);
  const stencilRef = useRef(null);
  const portIdCounterRef = useRef(1);
  const inspectorContainerRef = useRef(null);
  const inspectorInstanceRef = useRef(null);

  const commandManagerRef = useRef(null);
  const [currentFileName, setCurrentFileName] = useState("Untitled.joint*");
  const [currentFileHandle, setCurrentFileHandle] = useState(null);
  const [currentCmdId, setCurrentCmdId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [deviceEUIs, setDeviceEUIs] = useState([]);
  const [selectedEUI, setSelectedEUI] = useState(null);
  const [deviceIDs, setDeviceIDs] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceData, setDeviceData] = useState(null);

  const logsContainerRef = useRef(null);
  const lastViewRef = useRef(null);
  const timerRef = useRef(null);
  let linkIdCounter = 0;
  const [logs, setLogs] = useState([]);

  const log = (event, text) => {
    setLogs((prevLogs) => [...prevLogs, { event, text }]);
    console.log("logs: ", logs);
  };

  const clearTools = () => {
    if (!lastViewRef.current) return;
    lastViewRef.current.removeTools();
    lastViewRef.current = null;
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuSelect = (action) => {
    console.log(`Selected: ${action}`);
    handleMenuClose();
  };

  const getLastCmdId = (commandManager) => {
    const lastCmd =
      commandManager.undoStack[commandManager.undoStack.length - 1];
    if (!lastCmd) return null;
    if (!Array.isArray(lastCmd)) return lastCmd.id;
    return lastCmd[0].id;
  };

  const isSaved = (commandManager, id) => {
    const currentId = getLastCmdId(commandManager);
    return currentId === id;
  };

  const saveAsRoutine = async () => {
    try {
      const fileHandle = await window.showSaveFilePicker({
        excludeAcceptAllOption: true,
        suggestedName: currentFileName.replace("*", ""),
        types: [
          {
            description: "JointJS diagram file",
            accept: { "application/json": [".joint"] },
          },
        ],
      });
      const str = JSON.stringify(paperRef.current.model.toJSON());
      const bytes = new TextEncoder().encode(str);
      const accessHandle = await fileHandle.createWritable();
      await accessHandle.write(bytes);
      await accessHandle.close();
      setCurrentFileHandle(fileHandle);
      setCurrentFileName(fileHandle.name);
      commandManagerRef.current.reset();
      setCurrentCmdId(null);
    } catch (error) {
      console.error("Save As failed:", error);
    }
  };

  const handleNew = async () => {
    try {
      const fileHandle = await window.showSaveFilePicker({
        excludeAcceptAllOption: true,
        suggestedName: "diagram.joint",
        types: [
          {
            description: "JointJS diagram file",
            accept: { "application/json": [".joint"] },
          },
        ],
      });
      paperRef.current.model.clear();
      const str = JSON.stringify(paperRef.current.model.toJSON());
      const bytes = new TextEncoder().encode(str);
      const accessHandle = await fileHandle.createWritable();
      await accessHandle.write(bytes);
      await accessHandle.close();
      setCurrentFileHandle(fileHandle);
      setCurrentFileName(fileHandle.name);
      commandManagerRef.current.reset();
      setCurrentCmdId(null);
    } catch (error) {
      console.error("New file creation failed:", error);
    }
  };

  const handleSave = async () => {
    if (currentFileHandle) {
      try {
        const str = JSON.stringify(paperRef.current.model.toJSON());
        const bytes = new TextEncoder().encode(str);
        const accessHandle = await currentFileHandle.createWritable();
        await accessHandle.write(bytes);
        await accessHandle.close();
        setCurrentCmdId(getLastCmdId(commandManagerRef.current));
        setCurrentFileName(currentFileName.replace("*", ""));
      } catch (error) {
        console.error("Save failed:", error);
      }
    } else {
      await saveAsRoutine();
    }
  };

  const handleOpen = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        excludeAcceptAllOption: true,
        types: [
          {
            description: "JointJS diagram file",
            accept: { "application/json": [".joint"] },
          },
        ],
      });
      const file = await fileHandle.getFile();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        paperRef.current.model.fromJSON(JSON.parse(fileReader.result));
        commandManagerRef.current.reset();
        setCurrentFileHandle(fileHandle);
        setCurrentFileName(fileHandle.name);
        setCurrentCmdId(null);
      };
      fileReader.readAsText(file);
    } catch (error) {
      console.error("Open file failed:", error);
    }
  };

  const handleUndo = () => {
    commandManagerRef.current.undo();
  };

  const handleRedo = () => {
    commandManagerRef.current.redo();
  };

  joint.shapes.custom = joint.shapes.custom || {};
  joint.shapes.custom.TemplateImage = TemplateImage;

  useEffect(() => {
    const unsubscribe = listenForDeviceEUIs((euis) => {
      setDeviceEUIs(Array.isArray(euis) ? euis : []);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedEUI) {
      const unsubscribe = listenForDeviceIDs(selectedEUI, (ids) => {
        setDeviceIDs(Array.isArray(ids) ? ids : []);
      });
      return () => unsubscribe();
    } else {
      setDeviceIDs([]); // Clear deviceIDs if no EUI is selected
    }
  }, [selectedEUI]);

  useEffect(() => {
    if (selectedEUI && selectedDevice) {
      const unsubscribe = listenForDeviceData(
        selectedEUI,
        selectedDevice,
        (data) => {
          setDeviceData(data);
        }
      );
      return () => unsubscribe();
    }
  }, [selectedEUI, selectedDevice]);

  useEffect(() => {
    const { dia, shapes, mvc, ui, highlighters, util } = joint;
    // const graph = new dia.Graph({}, { cellNamespace: shapes });
    const namespace = {
      ...shapes,
      TemplateImage,
    };
    const graph = new dia.Graph(
      {},
      {
        cellNamespace: namespace,
      }
    );
    const commandManager = new dia.CommandManager({ graph: graph });
    commandManagerRef.current = commandManager;

    commandManager.on("stack:push", (cmd) => {
      const cmdId = joint.util.uuid();
      cmd.forEach((c) => (c.id = cmdId));
    });

    commandManager.on("stack", () => {
      if (currentFileHandle) {
        setCurrentFileName((prev) =>
          isSaved(commandManager, currentCmdId)
            ? prev.replace("*", "")
            : prev.replace("*", "") + "*"
        );
      }
    });

    const paper = new dia.Paper({
      model: graph,
      cellViewNamespace: shapes,
      width: "100%",
      height: "100%",
      gridSize: 20,
      drawGrid: { name: "mesh" },
      async: true,
      sorting: dia.Paper.sorting.APPROX,
      background: { color: "#F3F7F6" },
      // defaultLink: () => new joint.shapes.standard.Link(),
      defaultLink: () => {
        const linkIdNumber = ++linkIdCounter;
        return createPipe(linkIdNumber);
      },
      defaultConnectionPoint: { name: "boundary" },
      clickThreshold: 10,
      magnetThreshold: "onleave",
      linkPinning: false,
      validateMagnet: (sourceView, sourceMagnet) => {
        const sourceGroup = sourceView.findAttribute(
          "port-group",
          sourceMagnet
        );
        const sourcePort = sourceView.findAttribute("port", sourceMagnet);
        const source = sourceView.model;

        if (sourceGroup !== "out") {
          log(
            "paper<validateMagnet>",
            "It's not possible to create a link from an inbound port."
          );
          return false;
        }

        if (
          graph
            .getConnectedLinks(source, { outbound: true })
            .find((link) => link.source().port === sourcePort)
        ) {
          log(
            "paper<validateMagnet>",
            "The port has already an outbound link (we allow only one link per port)"
          );
          return false;
        }

        return true;
      },
      validateConnection: (
        sourceView,
        sourceMagnet,
        targetView,
        targetMagnet
      ) => {
        if (sourceView === targetView) return false;

        const targetGroup = targetView.findAttribute(
          "port-group",
          targetMagnet
        );
        const targetPort = targetView.findAttribute("port", targetMagnet);
        const target = targetView.model;

        if (target.isLink()) return false;
        if (targetGroup !== "in") return false;

        if (
          graph
            .getConnectedLinks(target, { inbound: true })
            .find((link) => link.target().port === targetPort)
        ) {
          return false;
        }

        return true;
      },
      snapLinks: { radius: 10 },
      snapLabels: true,
      markAvailable: true,
    });

    paperRef.current = paper;
    paperContainerRef.current.appendChild(paper.el);

    // Paper event handlers
    paper.on("element:magnet:pointerclick", (elementView, evt, magnet) => {
      paper.removeTools();
      elementView.addTools(new dia.ToolsView({ tools: [new Ports()] }));
    });

    paper.on("blank:pointerdown cell:pointerdown", () => {
      paper.removeTools();
    });

    paper.on("element:mouseenter", (elementView) => {
      elementView.addTools(
        new dia.ToolsView({
          tools: [
            new joint.elementTools.Boundary({
              padding: 10,
              useModelGeometry: true,
              attributes: {
                fill: "#4a7bcb",
                "fill-opacity": 0.1,
                stroke: "#4a7bcb",
                "stroke-width": 2,
                "stroke-dasharray": "none",
                "pointer-events": "none",
                // rx: 2,
                // ry: 2,
              },
            }),
          ],
          layer: dia.Paper.Layers.BACK,
        })
      );
    });

    paper.on("element:mouseleave", (elementView) => {
      elementView.removeTools();
    });

    let currentLinkToolsView;

    paper.on("link:pointerdown", (linkView) => {
      ui.Halo.clear(paper);
      if (linkView.hasTools()) return;

      const toolsView = new joint.dia.ToolsView({
        name: "link-hover",
        tools: [
          new joint.linkTools.Vertices({ vertexAdding: true }),
          new joint.linkTools.SourceAnchor(),
          new joint.linkTools.TargetAnchor(),
          new joint.linkTools.Remove({
            action: (evt) => {
              console.log("Removing link:", linkView.model.id);
              linkView.model.remove();
            },
          }),
        ],
      });

      linkView.addTools(toolsView);
      currentLinkToolsView = linkView;
    });

    paper.on("cell:pointerdown", (linkView) => {
      if (currentLinkToolsView) {
        currentLinkToolsView.removeTools();
        currentLinkToolsView = null;
      }
    });

    paper.on("blank:pointerdown", (linkView) => {
      if (currentLinkToolsView) {
        currentLinkToolsView.removeTools();
        currentLinkToolsView = null;
      }
    });

    paper.on("cell:pointerup", function (cellView) {
      // We don't want a Halo for links.
      if (cellView.model instanceof joint.dia.Link) return;

      const halo = new joint.ui.Halo({
        cellView: cellView,
        boxContent: false,
      });
      halo.removeHandle("clone");
      halo.removeHandle("fork");
      halo.removeHandle("resize");
      halo.removeHandle("rotate");

      halo.render();
    });

    // Initialize Stencil
    const stencil = new ui.Stencil({
      paper,
      usePaperGrid: true,
      width: 240,
      height: "100%",
      paperOptions: () => ({
        model: new dia.Graph({}, { cellNamespace: shapes }),
        cellViewNamespace: shapes,
        background: { color: "#FCFCFC" },
      }),
      groups: {
        elements: { label: "Elements" },
        ports: { label: "Ports" },
      },
      layout: {
        columns: 1,
        rowHeight: "compact",
        rowGap: 10,
        columnWidth: 200,
        marginY: 10,
        resizeToFit: false,
        dx: 0,
        dy: 0,
      },
      dragStartClone: (cell) => {
        const clone = cell.clone();
        if (clone.get("port")) {
          const { width, height } = clone.size();
          clone.attr("body/fill", "lightgray");
          clone.attr(
            "body/transform",
            `translate(-${width / 2}, -${height / 2})`
          );
        } else {
          clone.resize(200, 200);
        }
        return clone;
      },
    });

    stencilRef.current = stencil;
    stencilContainerRef.current.appendChild(stencil.el);
    stencil.render();

    const rect = new joint.shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 100, height: 50 },
      attrs: {
        body: { fill: "#ffffff", stroke: "#000000" },
        label: { text: "My Rectangle", fill: "#000000" },
      },
      custom: {
        description: "A sample rectangle",
        color: "#ffffff",
      },
    });

    graph.addCell(rect);

    // paper.on("element:pointerclick", (elementView) => {
    //   paper.removeTools();
    //   const element = elementView.model;
    //   if (element.get("uniqueKey") === "valve") {
    //     const currentStatus = element.attr("state/status");
    //     element.attr(
    //       "state/status",
    //       currentStatus === "open" ? "closed" : "open"
    //     );
    //     element.attr("label/text", `Valve (${element.attr("state/status")})`);
    //     element.attr(
    //       "body/fill",
    //       currentStatus === "open" ? "#32CD32" : "#FF4500"
    //     );
    //   }
    //   const toolsView = new dia.ToolsView({
    //     tools: [
    //       new joint.elementTools.Boundary({
    //         padding: 10,
    //         useModelGeometry: true,
    //         attributes: {
    //           fill: "#4a7bcb",
    //           "fill-opacity": 0.1,
    //           stroke: "#4a7bcb",
    //           "stroke-width": 2,
    //           "stroke-dasharray": "none",
    //           "pointer-events": "none",
    //           // rx: 2,
    //           // ry: 2,
    //         },
    //       }),
    //       // new joint.elementTools.Connect({
    //       //   useModelGeometry: true,
    //       //   x: "calc(w + 10)",
    //       //   y: "calc(h / 2)",
    //       // }),
    //       new joint.elementTools.Remove({
    //         useModelGeometry: true,
    //         x: -10,
    //         y: -10,
    //       }),
    //     ],
    //   });
    //   elementView.addTools(toolsView);
    // });

    paper.on("element:pointerclick", (elementView) => {
      const cell = elementView.model;
      if (inspectorInstanceRef.current) {
        inspectorInstanceRef.current.remove();
      }

      // Create Inspector
      inspectorInstanceRef.current = joint.ui.Inspector.create(
        inspectorContainerRef.current,
        {
          cell,
          inputs: {
            "attrs/label/text": {
              type: "text",
              label: "Label",
              group: "text",
            },
            "attrs/body/fill": {
              type: "color",
              label: "Fill Color",
              group: "appearance",
            },
            "custom/description": {
              type: "text",
              label: "Description",
              group: "text",
            },
            "size/width": {
              type: "number",
              label: "Width",
              min: 50,
              max: 500,
              group: "size",
            },
            "size/height": {
              type: "number",
              label: "Height",
              min: 50,
              max: 500,
              group: "size",
            },
            "custom/type": {
              type: "select",
              label: "Type",
              options: [
                { value: "rectangle", content: "Rectangle" },
                { value: "circle", content: "Circle" },
                { value: "ellipse", content: "Ellipse" },
              ],
              group: "appearance",
            },
            "custom/deviceEUI": {
              type: "select",
              label: "Device EUI",
              options: (deviceEUIs || []).map((eui) => ({
                value: eui,
                content: eui,
              })),
              defaultValue: selectedEUI || "",
              events: {
                change: (value) => {
                  setSelectedEUI(value);
                  cell.prop("custom/deviceEUI", value);
                },
              },
              group: "device",
              disabled: !deviceEUIs || deviceEUIs.length === 0, // Disable if no EUIs available
            },
            "custom/deviceID": {
              type: "select",
              label: "Device ID",
              options: (deviceIDs || []).map((id) => ({
                value: id,
                content: id,
              })),
              defaultValue: selectedDevice || "",
              events: {
                change: (value) => {
                  setSelectedDevice(value);
                  cell.prop("custom/deviceID", value);
                },
              },
              group: "device",
              disabled: !deviceIDs || deviceIDs.length === 0 || !selectedEUI, // Disable if no IDs or no EUI selected
            },
          },
          groups: {
            text: { label: "Text Properties", index: 1 },
            appearance: { label: "Appearance", index: 2 },
            size: { label: "Size", index: 3 },
            device: { label: "Device Settings", index: 4 },
            actions: { label: "Actions", index: 5 },
          },
          groupState: {
            text: { open: true },
            appearance: { open: true },
            size: { open: true },
            device: { open: true },
            actions: { open: true },
          },
        }
      );
    });

    // paper.on("element:pointerclick", (elementView) => {
    //   const cell = elementView.model;
    //   if (inspectorInstanceRef.current) {
    //     // inspectorInstanceRef.current.close();
    //     inspectorInstanceRef.current.remove();
    //   }

    //   // Create Inspector
    //   inspectorInstanceRef.current = joint.ui.Inspector.create(
    //     inspectorContainerRef.current,
    //     {
    //       cell,
    //       inputs: {
    //         "attrs/label/text": {
    //           type: "text",
    //           label: "Label",
    //           group: "text",
    //         },
    //         "attrs/body/fill": {
    //           type: "color",
    //           label: "Fill Color",
    //           group: "appearance",
    //         },
    //         "custom/description": {
    //           type: "text",
    //           label: "Description",
    //           group: "text",
    //         },
    //         "size/width": {
    //           type: "number",
    //           label: "Width",
    //           min: 50,
    //           max: 500,
    //           group: "size",
    //         },
    //         "size/height": {
    //           type: "number",
    //           label: "Height",
    //           min: 50,
    //           max: 500,
    //           group: "size",
    //         },
    //         "custom/type": {
    //           type: "select",
    //           label: "Type",
    //           options: [
    //             { value: "rectangle", content: "Rectangle" },
    //             { value: "circle", content: "Circle" },
    //             { value: "ellipse", content: "Ellipse" },
    //           ],
    //           group: "appearance",
    //         },
    //       },
    //       groups: {
    //         text: { label: "Text Properties", index: 1 },
    //         appearance: { label: "Appearance", index: 2 },
    //         size: { label: "Size", index: 3 },
    //       },
    //       groupState: {
    //         text: { open: true },
    //         appearance: { open: true },
    //         size: { open: true },
    //       },
    //     }
    //   );
    // });

    const el = new shapes.standard.Rectangle({
      position: { x: 40, y: 40 },
      size: { width: 120, height: 60 },
      furnitureType: "",
      attrs: {
        body: {
          stroke: "#ed2637",
          fill: "#ed2637",
          fillOpacity: 0.2,
        },
        label: {
          text: "Select furniture",
          fontFamily: "sans-serif",
        },
      },
    });

    graph.addCells([el]);

    // if (inspectorContainerRef.current) {
    //   ui.Inspector.create(inspectorContainerRef.current, {
    //     cell: el,
    //     inputs: {
    //       furnitureType: {
    //         label: "Furniture Type",
    //         type: "select-box",
    //         options: [
    //           { value: "Chairs", content: "Chairs" },
    //           { value: "Tables", content: "Tables" },
    //           { value: "Drawers", content: "Drawers" },
    //         ],
    //         width: 150,
    //       },
    //       attrs: {
    //         label: {
    //           text: {
    //             label: "Product",
    //             type: "select-box",
    //             width: 150,
    //             options: {
    //               dependencies: ["furnitureType"],
    //               source: (data) => {
    //                 const { value } = data.dependencies["furnitureType"];
    //                 switch (value) {
    //                   case "Chairs":
    //                     return [
    //                       { value: "Ostano", content: "Ostano" },
    //                       { value: "Stig", content: "Stig" },
    //                       { value: "Lidas", content: "Lidas" },
    //                       { value: "Utter", content: "Utter" },
    //                     ];
    //                   case "Tables":
    //                     return [
    //                       { value: "Lack", content: "Lack" },
    //                       { value: "Sandsberg", content: "Sandsberg" },
    //                       { value: "Vilto", content: "Vilto" },
    //                     ];
    //                   case "Drawers":
    //                     return [
    //                       { value: "Vihals", content: "Vihals" },
    //                       { value: "Malm", content: "Malm" },
    //                       { value: "Kullen", content: "Kullen" },
    //                     ];
    //                   default:
    //                     return [];
    //                 }
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    // }

    // Define stencil elements and ports
    const stencilElements = [
      // {
      //   type: "standard.Rectangle",
      //   size: { width: 80, height: 60 },
      //   attrs: { body: { fill: "#80ffd5" } },
      // },
      // {
      //   type: "standard.Rectangle",
      //   size: { width: 80, height: 60 },
      //   attrs: { body: { rx: 10, ry: 10, fill: "#48cba4" } },
      // },
      {
        type: "custom.TemplateImage",
        svg: MotorPumpSVG,
        size: { width: 80, height: 60 },
        attrs: {},
      },
      {
        type: "custom.TemplateImage",
        svg: HeatPumpSVG,
        size: { width: 80, height: 60 },
        attrs: {},
      },
    ];

    const stencilPorts = [
      // Output Port (Rectangle)
      // {
      //   type: "standard.Rectangle",
      //   size: { width: 24, height: 24 },
      //   attrs: { body: { fill: "#ff9580" } },
      //   port: {
      //     group: "out",
      //     markup: util.svg`
      //   <rect @selector="portBody" x="-12" y="-12" width="24" height="24" fill="#ff9580" stroke="#333333" stroke-width="2" magnet="active" port-group="out" />
      // `,
      //   },
      // },
      // Output Port (Path)
      {
        type: "standard.Path",
        size: { width: 20, height: 20 },
        markup: util.svg`
      <rect @selector="pipeBody"/>
      <rect @selector="pipeEnd" />
    `,
        attrs: {
          portRoot: {
            magnetSelector: "pipeEnd",
            magnet: "active",
          },
          pipeBody: {
            width: "calc(w)",
            height: "calc(h)",
            y: "calc(h / -2)",
            fill: {
              type: "linearGradient",
              stops: [
                { offset: "0%", color: "gray" },
                { offset: "30%", color: "white" },
                { offset: "70%", color: "white" },
                { offset: "100%", color: "gray" },
              ],
              attrs: {
                x1: "0%",
                y1: "0%",
                x2: "0%",
                y2: "100%",
              },
            },

            strokeWidth: 2,
            filter: {
              name: "dropShadow",
              args: { dx: 1, dy: 1, blur: 2, color: "rgba(0,0,0,0.3)" },
            },
            event: "pointerover",
            style: {
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))",
            },
          },
          pipeEnd: {
            width: 5,
            height: "calc(h+6)",
            y: "calc(h / -2 - 3)",
            x: "calc(w-4)",
            stroke: "gray",
            strokeWidth: 3,
            fill: "white",
          },
        },
        port: {
          group: "out",
          size: { width: 20, height: 20 },
          attrs: {
            portRoot: {
              magnetSelector: "pipeEnd",
              magnet: "active",
              "port-group": "out",
            },
            pipeBody: {
              width: "calc(w)",
              height: "calc(h)",
              y: "calc(h / -2)",
              fill: {
                type: "linearGradient",
                stops: [
                  { offset: "0%", color: "gray" },
                  { offset: "30%", color: "white" },
                  { offset: "70%", color: "white" },
                  { offset: "100%", color: "gray" },
                ],
                attrs: {
                  x1: "0%",
                  y1: "0%",
                  x2: "0%",
                  y2: "100%",
                },
              },
            },
            pipeEnd: {
              width: 5,
              height: "calc(h+6)",
              y: "calc(h / -2 - 3)",

              stroke: "gray",
              strokeWidth: 3,
              fill: "white",
              magnet: "active",
              "port-group": "out",
            },
          },
          portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
          // portBody: {
          //   d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
          //   magnet: "active",
          //   "port-group": "out",
          // },
          markup: util.svg`
        <rect @selector="pipeBody" x="-12" />
        <rect @selector="pipeEnd" />
      `,
        },
      },
      // Input Port (Pipe)
      {
        type: "standard.Path",
        size: { width: 20, height: 20 },
        markup: util.svg`
      <rect @selector="pipeBody" />
      <rect @selector="pipeEnd" />
    `,
        attrs: {
          portRoot: {
            magnetSelector: "pipeEnd",
          },
          pipeBody: {
            width: "calc(w)",
            height: "calc(h)",
            y: "calc(h / -2)",
            fill: {
              type: "linearGradient",
              stops: [
                { offset: "0%", color: "gray" },
                { offset: "30%", color: "white" },
                { offset: "70%", color: "white" },
                { offset: "100%", color: "gray" },
              ],
              attrs: {
                x1: "0%",
                y1: "0%",
                x2: "0%",
                y2: "100%",
              },
            },
            stroke: "#333333",
            strokeWidth: 2,
            filter: {
              name: "dropShadow",
              args: { dx: 1, dy: 1, blur: 2, color: "rgba(0,0,0,0.3)" },
            },
            event: "pointerover",
            style: {
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))",
            },
          },
          pipeEnd: {
            width: 5,
            height: "calc(h+6)",
            x: -1,
            y: "calc(h / -2 - 3)",
            fill: "#ffffff",
            stroke: "#333333",
            strokeWidth: 3,
            magnet: "passive",
            "port-group": "in",
          },
        },
        port: {
          group: "in",
          size: { width: 20, height: 20 },
          attrs: {
            portRoot: {
              magnetSelector: "pipeEnd",
              "port-group": "in",
            },
            pipeBody: {
              width: "calc(w)",
              height: "calc(h)",
              y: "calc(h / -2)",
              fill: {
                type: "linearGradient",
                stops: [
                  { offset: "0%", color: "gray" },
                  { offset: "30%", color: "white" },
                  { offset: "70%", color: "white" },
                  { offset: "100%", color: "gray" },
                ],
                attrs: {
                  x1: "0%",
                  y1: "0%",
                  x2: "0%",
                  y2: "100%",
                },
              },
            },
            pipeEnd: {
              width: 5,
              height: "calc(h+6)",
              x: -1,
              y: "calc(h / -2 - 3)",
              fill: "#ffffff",
              stroke: "#333333",
              strokeWidth: 3,
            },
            portLabel: {
              fontFamily: "Roboto, sans-serif",
              fontSize: 12,
              fill: "#333333",
              pointerEvents: "none",
              x: "calc(w / 2)",
              y: "calc(h / 2 + 12)",
              textAnchor: "middle",
            },
          },
          portLabel: {
            fontFamily: "Roboto, sans-serif",
            pointerEvents: "none",
          },
          markup: util.svg`
          <rect @selector="pipeBody" stroke-width="2" magnet="passive" port-group="in" />
          <rect @selector="pipeEnd" />
        `,
        },
      },
      // Input Port (Circle)
      // {
      //   type: "standard.Circle",
      //   size: { width: 30, height: 30 },
      //   attrs: { body: { fill: "#80aaff", stroke: "#333333" } },
      //   port: {
      //     group: "in",
      //     markup: util.svg`
      //   <circle @selector="portBody" r="15" fill="#80aaff" stroke="#333333" stroke-width="2" magnet="passive" port-group="in" />
      // `,
      //   },
      // },
      // Output Port (Circle)
      // {
      //   type: "standard.Circle",
      //   size: { width: 30, height: 30 },
      //   attrs: { body: { fill: "#ff9580", stroke: "#333333" } },
      //   port: {
      //     group: "out",
      //     markup: util.svg`
      //   <circle @selector="portBody" r="15" fill="#ff9580" stroke="#333333" stroke-width="2" magnet="active" port-group="out" />
      // `,
      //   },
      // },
      {
        type: "standard.Path",
        size: { width: 20, height: 20 },
        markup: util.svg`
      <rect @selector="pipeBody" />
      <rect @selector="pipeEnd" />
    `,
        attrs: {
          portRoot: {
            magnetSelector: "pipeEnd",
            magnet: "active",
          },
          pipeBody: {
            width: "calc(h)",
            height: "calc(w)",
            x: "calc(w / -2)",
            fill: {
              type: "linearGradient",
              stops: [
                { offset: "0%", color: "gray" },
                { offset: "30%", color: "white" },
                { offset: "70%", color: "white" },
                { offset: "100%", color: "gray" },
              ],
              attrs: {
                x1: "0%",
                y1: "0%",
                x2: "100%",
                y2: "0%",
              },
            },
            strokeWidth: 2,
            filter: {
              name: "dropShadow",
              args: { dx: 1, dy: 1, blur: 2, color: "rgba(0,0,0,0.3)" },
            },
            event: "pointerover",
            style: {
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))",
            },
          },
          pipeEnd: {
            width: "calc(h+6)",
            height: 5,
            x: "calc(w / -2 - 3)",
            y: "calc(h-4)",
            stroke: "gray",
            strokeWidth: 3,
            fill: "white",
          },
        },
        port: {
          group: "out",
          size: { width: 20, height: 20 },
          attrs: {
            portRoot: {
              magnetSelector: "pipeEnd",
              magnet: "active",
              "port-group": "out",
            },
            pipeBody: {
              width: "calc(h)",
              height: "calc(w)",
              x: "calc(w / -2)",
              fill: {
                type: "linearGradient",
                stops: [
                  { offset: "0%", color: "gray" },
                  { offset: "30%", color: "white" },
                  { offset: "70%", color: "white" },
                  { offset: "100%", color: "gray" },
                ],
                attrs: {
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "0%",
                },
              },
            },
            pipeEnd: {
              width: "calc(h+6)",
              height: 5,
              x: "calc(w / -2 - 3)",
              y: "calc(h-4)",
              stroke: "gray",
              strokeWidth: 3,
              fill: "white",
              magnet: "active",
              "port-group": "out",
            },
            portLabel: {
              fontFamily: "Roboto, sans-serif",
              fontSize: 12,
              fill: "#333333",
              pointerEvents: "none",
              x: "calc(w / 2 + 12)",
              y: "calc(h / 2)",
              textAnchor: "middle",
            },
          },
          portLabel: {
            fontFamily: "Roboto, sans-serif",
            pointerEvents: "none",
          },
          markup: util.svg`
        <rect @selector="pipeBody" stroke-width="2" magnet="active" port-group="out" />
        <rect @selector="pipeEnd" />
      `,
        },
      },
      // New Vertical Input Port (Pipe)
      {
        type: "standard.Path",
        size: { width: 20, height: 20 },
        markup: util.svg`
      <rect @selector="pipeBody" />
      <rect @selector="pipeEnd" />
    `,
        attrs: {
          portRoot: {
            magnetSelector: "pipeEnd",
          },
          pipeBody: {
            width: "calc(h)",
            height: "calc(w)",
            x: "calc(w / -2)",
            fill: {
              type: "linearGradient",
              stops: [
                { offset: "0%", color: "gray" },
                { offset: "30%", color: "white" },
                { offset: "70%", color: "white" },
                { offset: "100%", color: "gray" },
              ],
              attrs: {
                x1: "0%",
                y1: "0%",
                x2: "100%",
                y2: "0%",
              },
            },
            stroke: "#333333",
            strokeWidth: 2,
            filter: {
              name: "dropShadow",
              args: { dx: 1, dy: 1, blur: 2, color: "rgba(0,0,0,0.3)" },
            },
            event: "pointerover",
            style: {
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.4))",
            },
          },
          pipeEnd: {
            width: "calc(h+6)",
            height: 5,
            x: "calc(w / -2 - 3)",
            y: -1,
            fill: "#ffffff",
            stroke: "#333333",
            strokeWidth: 3,
            magnet: "passive",
            "port-group": "in",
          },
        },
        port: {
          group: "in",
          size: { width: 20, height: 20 },
          attrs: {
            portRoot: {
              magnetSelector: "pipeEnd",
              "port-group": "in",
            },
            pipeBody: {
              width: "calc(h)",
              height: "calc(w)",
              x: "calc(w / -2)",
              fill: {
                type: "linearGradient",
                stops: [
                  { offset: "0%", color: "gray" },
                  { offset: "30%", color: "white" },
                  { offset: "70%", color: "white" },
                  { offset: "100%", color: "gray" },
                ],
                attrs: {
                  x1: "0%",
                  y1: "0%",
                  x2: "100%",
                  y2: "0%",
                },
              },
            },
            pipeEnd: {
              width: "calc(h+6)",
              height: 5,
              x: "calc(w / -2 - 3)",
              y: -1,
              fill: "#ffffff",
              stroke: "#333333",
              strokeWidth: 3,
              magnet: "passive",
              "port-group": "in",
            },
            portLabel: {
              fontFamily: "Roboto, sans-serif",
              fontSize: 12,
              fill: "#333333",
              pointerEvents: "none",
              x: "calc(w / 2 + 12)",
              y: "calc(h / 2)",
              textAnchor: "middle",
            },
          },
          portLabel: {
            fontFamily: "Roboto, sans-serif",
            pointerEvents: "none",
          },
          markup: util.svg`
        <rect @selector="pipeBody" stroke-width="2" magnet="passive" port-group="in" />
        <rect @selector="pipeEnd" />
      `,
        },
      },
    ];

    stencilElements.forEach((element) => {
      element.ports = {
        groups: {
          in: {
            position: { name: "left" }, // Input ports on the left
            label: {
              position: { name: "inside", args: { offset: 22 } },
              markup: util.svg`
            <text @selector="portLabel" y="0.3em" fill="#333" text-anchor="middle" font-size="15" font-family="sans-serif" />
          `,
            },
          },
          out: {
            position: { name: "right" }, // Output ports on the right
            label: {
              position: { name: "inside", args: { offset: 22 } },
              markup: util.svg`
            <text @selector="portLabel" y="0.3em" fill="#333" text-anchor="middle" font-size="15" font-family="sans-serif" />
          `,
            },
          },
        },
        items: [
          // {
          //   id: `in-${element.id}-1`,
          //   group: "in",
          //   attrs: { portLabel: { text: "In" } },
          // },
          // {
          //   id: `out-${element.id}-1`,
          //   group: "out",
          //   attrs: { portLabel: { text: "Out" } },
          // },
        ],
      };
    });

    stencil.load({ elements: stencilElements, ports: stencilPorts });

    // Stencil event handlers
    stencil.on({
      "element:dragstart": (cloneView, evt) => {
        const clone = cloneView.model;
        evt.data.isPort = clone.get("port");
        console.log("Drag start, port:", evt.data.isPort); // Debug
        paper.removeTools();
      },
      "element:dragstart element:drag": (cloneView, evt, cloneArea) => {
        if (!evt.data.isPort) return;
        const [dropTarget] = graph.findModelsFromPoint(cloneArea.topLeft());
        console.log("Drop target:", dropTarget); // Debug
        if (dropTarget) {
          evt.data.dropTarget = dropTarget;
          highlighters.mask.add(
            dropTarget.findView(paper),
            "body", // Replace with ".body" or "root" if needed
            "valid-drop-target",
            {
              layer: joint.dia.Paper.Layers.FRONT, // Use FRONT for visibility
              attrs: {
                stroke: "#9580ff",
                "stroke-width": 2,
                "stroke-opacity": 1,
              },
            }
          );
          highlighters.addClass.removeAll(
            cloneView.paper,
            "invalid-drop-target"
          );
        } else {
          evt.data.dropTarget = null;
          highlighters.addClass.add(cloneView, "body", "invalid-drop-target", {
            className: "invalid-drop-target",
          });
          highlighters.mask.removeAll(paper, "valid-drop-target");
        }
      },
      "element:dragend": (cloneView, evt, cloneArea) => {
        if (!evt.data.isPort) return;
        const clone = cloneView.model;
        const { dropTarget } = evt.data;
        if (dropTarget) {
          stencil.cancelDrag();
          addElementPort(
            dropTarget,
            clone.get("port"),
            cloneArea.topLeft().difference(dropTarget.position()).toJSON()
          );
        } else {
          stencil.cancelDrag({ dropAnimation: true });
        }
        highlighters.mask.removeAll(paper, "valid-drop-target");
      },
    });

    // Create and add the single tree element
    const templateImage = new TemplateImage({
      svg: MotorPumpSVG,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
      attrs: {},
      portMarkup: [
        {
          tagName: "path",
          selector: "portBody",
          attributes: {
            fill: "#FFFFFF",
            stroke: "#333333",
            "stroke-width": 2,
          },
        },
      ],

      ports: {
        groups: {
          in: {
            // position: "left",
            position: {
              name: "line",
              args: {
                start: { x: "calc(w)", y: "calc(h/2 + 80)" },
                end: { x: "calc(w)", y: 40 },
              },
            },
            markup: util.svg`
                            <rect @selector="pipeBody" />
                            <rect @selector="pipeEnd" />
                        `,
            size: { width: 30, height: 30 },
            // label: { position: { name: "outside", args: { offset: 30 } } },
            z: 1,
            attrs: {
              portRoot: {
                magnet: "active", // Allow outgoing connections
              },
              portLabelBackground: {
                ref: "portLabel",
                fill: "#FFFFFF",
                fillOpacity: 0.7,
                x: "calc(x - 2)",
                y: "calc(y - 2)",
                width: "calc(w + 4)",
                height: "calc(h + 4)",
                pointerEvents: "none",
              },
              pipeBody: {
                width: "calc(w)",
                height: "calc(h)",
                y: "calc(h / -2)",
                x: "calc(-1 * w)",
                fill: {
                  type: "linearGradient",
                  stops: [
                    { offset: "0%", color: "gray" },
                    { offset: "30%", color: "white" },
                    { offset: "70%", color: "white" },
                    { offset: "100%", color: "gray" },
                  ],
                  attrs: {
                    x1: "0%",
                    y1: "0%",
                    x2: "0%",
                    y2: "100%",
                  },
                },
              },
              pipeEnd: {
                width: 10,
                height: "calc(h+6)",
                y: "calc(h / -2 - 3)",
                x: "calc(w -40)",
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
              },
              portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
              portBody: {
                d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
                magnet: "active",
              },
            },
          },
          out: {
            // position: "right",

            // label: { position: { name: "outside", args: { offset: 30 } } },
            position: {
              name: "line",
              args: {
                start: { x: "calc(w)", y: "calc(h/2)" },
                end: { x: "calc(w)", y: 40 },
              },
            },
            size: { width: 30, height: 30 },
            markup: util.svg`
                             <g @selector="portBodyGroup" transform="rotate(180)">
      <rect @selector="pipeBody" />
      <rect @selector="pipeEnd" />
    </g>
                        `,
            z: 1,
            attrs: {
              portRoot: {
                magnet: "active", // Allow outgoing connections
              },
              portLabelBackground: {
                ref: "portLabel",
                fill: "#FFFFFF",
                fillOpacity: 0.8,
                x: "calc(x - 2)",
                y: "calc(y - 2)",
                width: "calc(w + 4)",
                height: "calc(h + 4)",
                pointerEvents: "none",
              },
              pipeBody: {
                width: "calc(w)",
                height: "calc(h)",
                y: "calc(h / -2)",
                fill: {
                  type: "linearGradient",
                  stops: [
                    { offset: "0%", color: "gray" },
                    { offset: "30%", color: "white" },
                    { offset: "70%", color: "white" },
                    { offset: "100%", color: "gray" },
                  ],
                  attrs: {
                    x1: "0%",
                    y1: "0%",
                    x2: "0%",
                    y2: "100%",
                  },
                },
              },
              pipeEnd: {
                width: 10,
                height: "calc(h+6)",
                y: "calc(h / -2 - 3)",
                x: "calc(w -30)",
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
              },
              portLabel: { fontFamily: "sans-serif", pointerEvents: "none" },
              portBody: {
                d: "M 0 -calc(0.5 * h) h calc(w) l 3 calc(0.5 * h) l -3 calc(0.5 * h) H 0 A calc(0.5 * h) calc(0.5 * h) 1 1 1 0 -calc(0.5 * h) Z",
                magnet: "active",
              },
            },
          },
        },
        items: [
          {
            id: "in1",
            group: "in",
          },
          {
            id: "out1",
            group: "out",
          },
        ],
      },
    });

    graph.addCell(templateImage);

    const templateImage01 = new TemplateImage({
      svg: HeatPumpSVG,
      attrs: {},
    });
    const [ti1] = addImages(templateImage01, 220);
    ti1.set("color", "red");

    function addImages(image, x = 0, y = 20) {
      const images = [
        image
          .clone()
          .resize(250, 250)
          .position(x, y + 230),
      ];
      graph.addCells(images);
      return images;
    }

    const svgMarkup = {
      tagName: "svg",
      selector: "body",
      attributes: {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 124 124",
        width: "124",
        height: "124",
      },
      children: [MotorPumpSVG],
    };

    // const CustomSVGElement = joint.dia.Element.define("custom.SVGElement", {
    //   size: { width: 124, height: 124 },
    //   markup: [
    //     MotorPumpSVG,
    //     {
    //       tagName: "circle",
    //       selector: "portBody",
    //     },
    //   ],
    //   ports: {
    //     groups: {
    //       in: {
    //         position: {
    //           name: "left",
    //         },
    //         attrs: {
    //           portBody: {
    //             magnet: "passive",
    //             r: 6,
    //             fill: "#22c55e",
    //             stroke: "#000",
    //           },
    //         },
    //       },
    //       out: {
    //         position: {
    //           name: "right",
    //         },
    //         attrs: {
    //           portBody: {
    //             magnet: true,
    //             r: 6,
    //             fill: "#f97316",
    //             stroke: "#000",
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    // const element = new CustomSVGElement({
    //   svg: MotorPumpSVG,
    //   position: { x: 300, y: 150 },
    //   ports: {
    //     items: [
    //       { id: "in1", group: "in" },
    //       { id: "out1", group: "out" },
    //     ],
    //   },
    // });

    // graph.addCell(element);

    paper.on("link:mouseenter", (linkView) => {
      clearTimeout(timerRef.current);
      clearTools();
      lastViewRef.current = linkView;
      linkView.addTools(
        new dia.ToolsView({
          name: "onhover",
          tools: [
            // new PortTargetArrowhead(),
            new joint.linkTools.Remove({
              distance: -60,
              markup: [
                {
                  tagName: "circle",
                  selector: "button",
                  attributes: {
                    r: 10,
                    fill: "#FFD5E8",
                    stroke: "#FD0B88",
                    "stroke-width": 2,
                    cursor: "pointer",
                  },
                },
                {
                  tagName: "path",
                  selector: "icon",
                  attributes: {
                    d: "M -4 -4 4 4 M -4 4 4 -4",
                    fill: "none",
                    stroke: "#333",
                    "stroke-width": 3,
                    "pointer-events": "none",
                  },
                },
              ],
            }),
          ],
        })
      );
    });

    paper.on("link:mouseleave", (linkView) => {
      timerRef.current = setTimeout(() => clearTools(), 500);
    });

    paper.on("link:connect", (linkView) => {
      const link = linkView.model;
      const source = link.source();
      const target = link.target();
      log(
        "paper<link:connect>",
        `${link.id} now goes from ${source.port} of ${source.id} to port ${target.port} of ${target.id}.`
      );
    });

    paper.on(
      "link:disconnect",
      (linkView, evt, prevElementView, prevMagnet) => {
        const link = linkView.model;
        const prevPort = prevElementView.findAttribute("port", prevMagnet);
        log(
          "paper<link:disconnect>",
          `${link.id} disconnected from port ${prevPort} of ${prevElementView.model.id}.`
        );
      }
    );

    graph.on("remove", (cell) => {
      if (!cell.isLink()) return;
      const source = cell.source();
      const target = cell.target();
      if (!target.id) {
        linkIdCounter--;
        return;
      }
      log(
        "graph<remove>",
        `${cell.id} between ${source.port} of ${source.id} and ${target.port} of ${target.id} was removed.`
      );
    });

    // Function to add ports
    const addElementPort = (element, port, position) => {
      const portId = `P-${portIdCounterRef.current++}`;
      element.addPort({
        id: portId,
        group: "absolute",
        args: position,
        ...util.merge(port, {
          attrs: { portLabel: { text: portId } },
        }),
      });
      return portId;
    };

    // Create rectangle element

    // Port Move Tool
    const PortHandle = mvc.View.extend({
      tagName: "circle",
      svgElement: true,
      className: "port-handle",
      events: {
        mousedown: "onPointerDown",
        touchstart: "onPointerDown",
      },
      documentEvents: {
        mousemove: "onPointerMove",
        touchmove: "onPointerMove",
        mouseup: "onPointerUp",
        touchend: "onPointerUp",
        touchcancel: "onPointerUp",
      },
      attributes: {
        r: 20,
        fill: "transparent",
        stroke: "#002b33",
        "stroke-width": 2,
        cursor: "grab",
      },
      position: function (x, y) {
        this.vel.attr({ cx: x, cy: y });
      },
      color: function (color) {
        this.el.style.stroke = color || this.attributes.stroke;
      },
      onPointerDown: function (evt) {
        if (this.options.guard(evt)) return;
        evt.stopPropagation();
        evt.preventDefault();
        this.options.paper.undelegateEvents();
        this.delegateDocumentEvents(null, evt.data);
        this.trigger("will-change", this, evt);
      },
      onPointerMove: function (evt) {
        this.trigger("changing", this, evt);
      },
      onPointerUp: function (evt) {
        if (evt.detail === 2) {
          this.trigger("remove", this, evt);
        } else {
          this.trigger("changed", this, evt);
          this.undelegateDocumentEvents();
        }
        this.options.paper.delegateEvents();
      },
    });

    const Ports = dia.ToolView.extend({
      name: "ports",
      options: {
        handleClass: PortHandle,
        activeColor: "#4666E5",
      },
      children: [
        {
          tagName: "circle",
          selector: "preview",
          className: "joint-ports-preview",
          attributes: {
            r: 13,
            "stroke-width": 2,
            fill: "#4666E5",
            "fill-opacity": 0.3,
            stroke: "#4666E5",
            "pointer-events": "none",
          },
        },
      ],
      handles: null,
      onRender: function () {
        this.renderChildren();
        this.updatePreview(null);
        this.resetHandles();
        this.renderHandles();
        return this;
      },
      update: function () {
        const positions = this.getPortPositions();
        if (positions.length === this.handles.length) {
          this.updateHandles();
        } else {
          this.resetHandles();
          this.renderHandles();
        }
        this.updatePreview(null);
        return this;
      },
      resetHandles: function () {
        const handles = this.handles;
        this.handles = [];
        this.stopListening();
        if (!Array.isArray(handles)) return;
        for (let i = 0, n = handles.length; i < n; i++) {
          handles[i].remove();
        }
      },
      renderHandles: function () {
        const positions = this.getPortPositions();
        for (let i = 0, n = positions.length; i < n; i++) {
          const position = positions[i];
          const handle = new this.options.handleClass({
            index: i,
            portId: position.id,
            paper: this.paper,
            guard: (evt) => this.guard(evt),
          });
          handle.render();
          handle.position(position.x, position.y);
          this.simulateRelatedView(handle.el);
          handle.vel.appendTo(this.el);
          this.handles.push(handle);
          this.startHandleListening(handle);
        }
      },
      updateHandles: function () {
        const positions = this.getPortPositions();
        for (let i = 0, n = positions.length; i < n; i++) {
          const position = positions[i];
          const handle = this.handles[i];
          if (!handle) return;
          handle.position(position.x, position.y);
        }
      },
      updatePreview: function (x, y) {
        const { preview } = this.childNodes;
        if (!preview) return;
        if (!Number.isFinite(x)) {
          preview.setAttribute("display", "none");
        } else {
          preview.removeAttribute("display");
          preview.setAttribute("transform", `translate(${x},${y})`);
        }
      },
      startHandleListening: function (handle) {
        this.listenTo(handle, "will-change", this.onHandleWillChange);
        this.listenTo(handle, "changing", this.onHandleChanging);
        this.listenTo(handle, "changed", this.onHandleChanged);
        this.listenTo(handle, "remove", this.onHandleRemove);
      },
      onHandleWillChange: function (handle, evt) {
        this.focus();
        handle.color(this.options.activeColor);
        const portNode = this.relatedView.findPortNode(
          handle.options.portId,
          "root"
        );
        portNode.style.opacity = 0.2;
      },
      onHandleChanging: function (handle, evt) {
        const { x, y } = this.getPositionFromEvent(evt);
        this.updatePreview(x, y);
      },
      onHandleChanged: function (handle, evt) {
        const { relatedView } = this;
        const { model } = relatedView;
        const portId = handle.options.portId;
        handle.color(null);
        const portNode = this.relatedView.findPortNode(portId, "root");
        portNode.style.opacity = "";
        this.updatePreview(null);
        const delta = this.getPositionFromEvent(evt).difference(
          relatedView.model.position()
        );
        model.portProp(
          portId,
          "args",
          { x: delta.x, y: delta.y },
          { rewrite: true, tool: this.cid }
        );
        this.resetHandles();
        this.renderHandles();
      },
      onHandleRemove: function (handle, evt) {
        const { relatedView } = this;
        const { model } = relatedView;
        const portId = handle.options.portId;
        handle.color(null);
        const portNode = this.relatedView.findPortNode(portId, "root");
        portNode.style.opacity = "";
        this.updatePreview(null);
        model.removePort(portId, { tool: this.cid });
        this.resetHandles();
        this.renderHandles();
      },
      getPortPositions: function () {
        const { relatedView } = this;
        const translateMatrix = relatedView.getRootTranslateMatrix();
        const rotateMatrix = relatedView.getRootRotateMatrix();
        const matrix = translateMatrix.multiply(rotateMatrix);
        const groupNames = Object.keys(relatedView.model.prop("ports/groups"));
        const portsPositions = {};
        for (let i = 0, n = groupNames.length; i < n; i++) {
          Object.assign(
            portsPositions,
            relatedView.model.getPortsPositions(groupNames[i])
          );
        }
        const positions = [];
        for (let id in portsPositions) {
          const point = joint.V.transformPoint(portsPositions[id], matrix);
          positions.push({ x: point.x, y: point.y, id });
        }
        return positions;
      },
      getPositionFromEvent: function (evt) {
        const { relatedView } = this;
        const bbox = relatedView.model.getBBox();
        const [, x, y] = relatedView.paper.getPointerArgs(evt);
        const p = new joint.g.Point(x, y);
        if (bbox.containsPoint(p)) {
          return p;
        }
        return bbox.pointNearestToPoint(p);
      },
      onRemove: function () {
        this.resetHandles();
      },
    });

    // Cleanup on unmount
    return () => {
      paper.remove();
      stencil.remove();
    };
  }, []);

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Bar */}
      <AppBar
        position="static"
        elevation={4}
        sx={{
          boxShadow:
            "0px 3.8580212593px 7.7160425186px 0px rgba(0,0,0,.1019607843)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard Editor
          </Typography>

          {/* Dropdown Button */}
          <Button
            color="inherit"
            onClick={handleMenuClick}
            endIcon={<ChevronDown size={16} />}
            sx={{ textTransform: "none" }}
          >
            File
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuSelect("new")}>
              New File
            </MenuItem>
            <MenuItem onClick={() => handleMenuSelect("save")}>
              Save File
            </MenuItem>
            <MenuItem onClick={() => handleMenuSelect("load")}>
              Load File
            </MenuItem>
          </Menu>

          {/* Undo / Redo */}
          <IconButton color="inherit" onClick={handleUndo}>
            <Undo size={20} />
          </IconButton>
          <IconButton color="inherit" onClick={handleRedo}>
            <Redo size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Body: Stencil + Canvas + Inspector */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Stencil Area */}
        <Box
          sx={{
            width: "250px",
            borderRight: "1px solid #ccc",
            backgroundColor: "#fff",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ p: 2, borderBottom: "1px solid #eee" }}
          >
            Stencil Area
          </Typography>
          <Box
            ref={stencilContainerRef}
            sx={{
              flex: 1,
              overflow: "auto",
              "& .joint-stencil": {
                height: "100%",
                fontFamily: "inherit",
              },
              "& .joint-stencil .group-label": {
                backgroundColor: "#f5f5f5",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: "bold",
                borderBottom: "1px solid #ddd",
              },
            }}
          />
        </Box>

        {/* Canvas Area */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f9f9f9",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              position: "absolute",
              top: 8,
              left: 16,
              zIndex: 1,
              backgroundColor: "rgba(255,255,255,0.9)",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#666",
            }}
          ></Typography>
          <Box
            ref={paperContainerRef}
            sx={{
              width: "100%",
              height: "100%",
              "& .joint-paper": {
                border: "none",
              },
              "& .joint-paper svg": {
                width: "100%",
                height: "100%",
              },
            }}
          />
        </Box>

        {/* Inspector Area */}
        <Box
          sx={{
            width: "250px",
            borderLeft: "1px solid #ccc",
            backgroundColor: "#fff",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ p: 2, borderBottom: "1px solid #eee" }}
          >
            Inspector
          </Typography>
          <Box
            ref={inspectorContainerRef}
            sx={{
              flex: 1,
              overflow: "auto",
              padding: "10px",
              background: "#f5f5f5",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardEditor;
