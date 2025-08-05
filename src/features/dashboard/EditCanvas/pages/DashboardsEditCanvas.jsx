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
  TextField,
  Select,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
import CoolingPlate from "../../../WidgetSVG/CoolingPlate";
import VatAgitator from "../../../WidgetSVG/VatAgitator";
import Chille from "../../../WidgetSVG/Chiller";
import IceBank from "../../../WidgetSVG/IceBank";
import {
  listenForDeviceModels,
  listenForDevices,
  listenForDevicePayload,
} from "../../../../../src/services/firebase/dataService";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

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
    this.setImageColor();
  }

  setImageColor() {
    const svg = this.get("svg") || "";
    const color = this.get("color") || "red";
    this.attr(
      "image/href",
      this.dataURLPrefix + encodeURIComponent(svg.replace(/\$color/g, color))
    );
  }
}

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
  const [updateKey, setUpdateKey] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [deviceModels, setDeviceModels] = useState({});
  const [devices, setDevices] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const [availableValues, setAvailableValues] = useState([]);
  const [payload, setPayload] = useState({});

  const formatKey = (key) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const deviceSubscriptions = useRef(new Map());
  const cellDeviceData = useRef(new Map());

  const getCellId = (cell) => cell.id;

  const updateCellDisplay = (cell, data) => {
    if (!cell || !data) return;

    const payload = data || {};
    const value = payload[selectedValue];

    console.log("payload01", data);

    if (typeof value !== "undefined") {
      const modelName = selectedValue || "Device";
      cell.attr("label/text", `${modelName}: ${value}`);

      if (typeof value === "number") {
        const range = deviceModels[cell.prop("custom/deviceModel")]?.range || [
          0, 100,
        ];
        const normalizedValue = Math.min(
          Math.max((value - range[0]) / (range[1] - range[0]), 0),
          1
        );
        const hue = (1 - normalizedValue) * 120;
        cell.attr("body/fill", `hsl(${hue}, 100%, 80%)`);
      } else {
        cell.attr("body/fill", "#e0e0e0");
      }
    }
  };

  const subscribeCellToDevice = (cell, eui, deviceId, deviceModel) => {
    const cellId = getCellId(cell);

    if (deviceSubscriptions.current.has(cellId)) {
      deviceSubscriptions.current.get(cellId)();
      deviceSubscriptions.current.delete(cellId);
    }

    if (eui && deviceId) {
      const unsubscribe = listenForDevicePayload(eui, deviceId, (data) => {
        console.log(`Device data for cell ${cellId}:`, data);
        cellDeviceData.current.set(cellId, data);
        setPayload(data);

        const payloadKeys = Object.keys(data || {});
        if (payloadKeys.length > 0) {
          setAvailableValues(payloadKeys);
          console.log("payloadKeys", payloadKeys);

          if (!selectedValue || !payloadKeys.includes(selectedValue)) {
            setSelectedValue(payloadKeys);
          }
        }
        updateCellDisplay(cell, data);
      });

      deviceSubscriptions.current.set(cellId, unsubscribe);

      cell.prop("custom/deviceEUI", eui);
      cell.prop("custom/deviceID", deviceId);
      cell.prop("custom/deviceModel", deviceModel);
    }
  };

  const unsubscribeCellFromDevice = (cellId) => {
    if (deviceSubscriptions.current.has(cellId)) {
      deviceSubscriptions.current.get(cellId)();
      deviceSubscriptions.current.delete(cellId);
    }
    cellDeviceData.current.delete(cellId);
  };

  useEffect(() => {
    const unsubscribe = listenForDeviceModels((models) => {
      console.log("Fetched device models:", models);
      setDeviceModels(models);
      console.log("models", models);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = listenForDeviceModels((devices) => {
      const euis = Object.keys(devices);
      console.log("Fetched EUIs:", euis);
      setDeviceEUIs(euis);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedEUI) {
      console.log("Fetching Devices for EUI:", selectedEUI);
      const unsubscribe = listenForDevices(selectedEUI, (devices) => {
        console.log("Fetched Devices:", devices);
        setDevices(devices);
      });
      return () => unsubscribe();
    } else {
      setDevices({});
    }
  }, [selectedEUI]);

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

  const [isLoadingEUIs, setIsLoadingEUIs] = useState(true);
  const [isLoadingDeviceIDs, setIsLoadingDeviceIDs] = useState(false);

  useEffect(
    () => {
      const { dia, shapes, mvc, ui, highlighters, util } = joint;
      const namespace = {
        ...shapes,
        TemplateImage,
        Pipe01,
      };
      const graph = new dia.Graph({}, { cellNamespace: namespace });
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
        cellViewNamespace: namespace,
        width: "100%",
        height: "100%",
        gridSize: 20,
        drawGrid: { name: "mesh" },
        async: true,
        sorting: dia.Paper.sorting.APPROX,
        background: { color: "#F3F7F6" },
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

      paper.on("element:pointerclick", (elementView) => {
        const cell = elementView.model;
        if (inspectorInstanceRef.current) {
          inspectorInstanceRef.current.remove();
        }
        setSelectedCell(cell);

        const cellEUI = cell.prop("custom/deviceEUI");
        const cellDeviceID = cell.prop("custom/deviceID");

        if (cellEUI) {
          setSelectedEUI(cellEUI);
          if (cellDeviceID) {
            setSelectedDevice(cellDeviceID);
          }
        }

        console.log(
          "Rendering inspector with deviceEUIs:",
          deviceEUIs,
          "and deviceIDs:",
          deviceIDs
        );
        console.log("Inspector inputs configuration:", {
          deviceEUI: {
            options:
              (deviceEUIs || []).length > 0
                ? deviceEUIs.map((eui) => ({ value: eui, content: eui }))
                : [{ value: "", content: "No EUIs available" }],
            disabled: !deviceEUIs || deviceEUIs.length === 0,
          },
          deviceID: {
            options:
              (deviceIDs || []).length > 0
                ? deviceIDs.map((id) => ({ value: id, content: id }))
                : [{ value: "", content: "No Device IDs available" }],
            disabled: !deviceIDs || deviceIDs.length === 0 || !selectedEUI,
          },
        });

        inspectorInstanceRef.current = joint.ui.Inspector.create(
          inspectorContainerRef.current,
          {
            cell,
            inputs: {
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
          }
          const cloneSize = cell.get("cloneSize");
          if (cloneSize) {
            clone.resize(cloneSize.width, cloneSize.height);
          } else {
            const { width, height } = cell.size();
            clone.resize(width, height);
          }
          return clone;
        },
      });

      stencilRef.current = stencil;
      stencilContainerRef.current.appendChild(stencil.el);
      stencil.render();

      const stencilElements = [
        {
          type: "standard.Rectangle",
          size: { width: 100, height: 60 },
          cloneSize: { width: 150, height: 80 },
          attrs: {
            body: {
              fill: "#ffffff",
              stroke: "transparent",
            },
            label: {
              text: "Text",
              fill: "#000000",
            },
          },
          custom: {
            description: "A sample rectangle",
            color: "#ffffff",
          },
        },
        {
          type: "standard.Rectangle",
          size: { width: 100, height: 60 },
          cloneSize: { width: 150, height: 80 },
          attrs: {
            body: { fill: "#ffffff", stroke: "#000000" },
            label: { text: "Text", fill: "#000000" },
          },
          custom: {
            description: "A sample rectangle",
            color: "#ffffff",
          },
        },
        {
          type: "standard.Rectangle",
          size: { width: 100, height: 60 },
          cloneSize: { width: 80, height: 60 },
          attrs: {
            body: { fill: "#ffffff", stroke: "#000000" },
            label: { text: "Enter text", fill: "#000000" },
          },
          custom: {
            description: "A sample rectangle",
            color: "#ffffff",
          },
        },
        {
          type: "custom.TemplateImage",
          svg: MotorPumpSVG,
          size: { width: 80, height: 60 },
          cloneSize: { width: 200, height: 200 },
          attrs: {},
        },
        {
          type: "custom.TemplateImage",
          svg: HeatPumpSVG,
          size: { width: 80, height: 60 },
          cloneSize: { width: 200, height: 200 },
          attrs: {},
        },
        {
          type: "custom.TemplateImage",
          svg: CoolingPlate,
          size: { width: 80, height: 60 },
          cloneSize: { width: 200, height: 250 },
          attrs: {},
        },
        {
          type: "custom.TemplateImage",
          svg: VatAgitator,
          size: { width: 80, height: 60 },
          cloneSize: { width: 200, height: 250 },
          attrs: {},
        },
        {
          type: "custom.TemplateImage",
          svg: Chille,
          size: { width: 80, height: 60 },
          cloneSize: { width: 250, height: 200 },
          attrs: {},
        },
        {
          type: "custom.TemplateImage",
          svg: IceBank,
          size: { width: 80, height: 60 },
          cloneSize: { width: 250, height: 200 },
          attrs: {},
        },
      ];

      const stencilPorts = [
        {
          type: "standard.Rectangle",
          size: { width: 10, height: 10 },
          attrs: {
            body: {
              fill: "transparent",
              stroke: "transparent",
            },
          },
          port: {
            markup: joint.util.svg`<g @selector="portBody" magnet="active">
        <rect 
          x="0" y="2.5" 
          width="12" height="20" 
          fill="url(#portGradient)" 
        />
        <rect 
          x="12" y="0" 
          width="2.2" height="25" 
          fill="#808080" 
        />
        <rect 
          x="15" y="0.7" 
          width="3.5" height="23.5" 
          fill="white" 
          stroke="#808080" 
          stroke-width="1.3" 
        />
        <defs>
          <linearGradient id="portGradient" x1="6" y1="2.5" x2="6" y2="22.5" gradientUnits="userSpaceOnUse">
            <stop offset="0.00480769" stop-color="#737373"/>
            <stop offset="0.346154" stop-color="white"/>
            <stop offset="0.682692" stop-color="white"/>
            <stop offset="1" stop-color="#737373"/>
          </linearGradient>
        </defs>
      </g>`,
          },
        },
        {
          type: "standard.Path",
          size: { width: 30, height: 25 },
          markup: util.svg`<rect @selector="pipeBody" />
    <rect @selector="pipeEnd" />`,
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
            size: { width: 30, height: 25 },
            attrs: {
              portRoot: {
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
                x: "calc(w-4)",
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
                x: "calc(w + 12)",
                y: "calc(h / 2)",
                textAnchor: "middle",
              },
            },
            markup: util.svg`<rect @selector="pipeBody" magnet="active" port-group="out"/>
      <rect @selector="pipeEnd" x="-12"/>`,
          },
        },
        {
          type: "standard.Path",
          size: { width: 30, height: 25 },
          markup: util.svg`<rect @selector="pipeBody" />
      <rect @selector="pipeEnd" />`,
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
              x: "calc(w / -5)",
              y: "calc(h / -2 - 3)",
              stroke: "gray",
              strokeWidth: 3,
              fill: "white",
              magnet: "passive",
              "port-group": "in",
            },
          },
          port: {
            group: "in",
            size: { width: 30, height: 25 },
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
                x: "calc(w / -5)",
                y: "calc(h / -2 - 3)",
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
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
            markup: util.svg`<rect @selector="pipeBody"  magnet="passive" port-group="in" />
          <rect @selector="pipeEnd" />`,
          },
        },
        {
          type: "standard.Path",
          size: { width: 30, height: 25 },
          markup: util.svg`<rect @selector="pipeBody" />
      <rect @selector="pipeEnd" />`,
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
            size: { width: 30, height: 25 },
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
            markup: util.svg`<rect @selector="pipeBody"  magnet="active" port-group="out" />
        <rect @selector="pipeEnd" />`,
          },
        },
        {
          type: "standard.Path",
          size: { width: 30, height: 25 },
          markup: util.svg`<rect @selector="pipeBody" />
      <rect @selector="pipeEnd" />`,
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
              stroke: "gray",
              strokeWidth: 3,
              fill: "white",
              magnet: "passive",
              "port-group": "in",
            },
          },
          port: {
            group: "in",
            size: { width: 30, height: 25 },
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
                stroke: "gray",
                strokeWidth: 3,
                fill: "white",
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
            markup: util.svg`<rect @selector="pipeBody"  magnet="passive" port-group="in" />
        <rect @selector="pipeEnd" />`,
          },
        },
      ];

      stencilElements.forEach((element) => {
        element.ports = {
          groups: {
            in: {
              position: { name: "left" },
              attrs: { portBody: { magnet: true } },
              args: { dx: 0, dy: 0 },
            },
            out: {
              position: { name: "right" },
              attrs: { portBody: { magnet: true } },
              args: { dx: 0, dy: 0 },
            },
          },
          items: [],
        };
      });

      stencil.load({ elements: stencilElements, ports: stencilPorts });

      stencil.on({
        "element:dragstart": (cloneView, evt) => {
          const clone = cloneView.model;
          evt.data.isPort = clone.get("port");
          console.log("Drag start, port:", evt.data.isPort);
          paper.removeTools();
        },
        "element:dragstart element:drag": (cloneView, evt, cloneArea) => {
          if (!evt.data.isPort) return;
          const [dropTarget] = graph.findModelsFromPoint(cloneArea.topLeft());
          console.log("Drop target:", dropTarget);
          if (dropTarget) {
            evt.data.dropTarget = dropTarget;
            highlighters.mask.add(
              dropTarget.findView(paper),
              "body",
              "valid-drop-target",
              {
                layer: joint.dia.Paper.Layers.FRONT,
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
            highlighters.addClass.add(
              cloneView,
              "body",
              "invalid-drop-target",
              {
                className: "invalid-drop-target",
              }
            );
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

      paper.on("link:mouseenter", (linkView) => {
        clearTimeout(timerRef.current);
        clearTools();
        lastViewRef.current = linkView;
        linkView.addTools(
          new dia.ToolsView({
            name: "onhover",
            tools: [
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
        const cellId = getCellId(cell);
        unsubscribeCellFromDevice(cellId);
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

      const PortHandle = mvc.View.extend({
        tagName: "rect",
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
          width: 30,
          height: 30,
          x: -15,
          y: -15,
          fill: "transparent",
          stroke: "#002b33",
          "stroke-width": 2,
          cursor: "grab",
        },
        position: function (x, y) {
          this.vel.attr({ x: x - 15, y: y - 15 });
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
          const groupNames = Object.keys(
            relatedView.model.prop("ports/groups")
          );
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

      return () => {
        deviceSubscriptions.current.forEach((unsubscribe) => unsubscribe());
        deviceSubscriptions.current.clear();
        cellDeviceData.current.clear();
        paper.remove();
        stencil.remove();
      };
    },
    []
  );

  useEffect(() => {
    if (selectedCell) {
      const cellId = getCellId(selectedCell);
      const data = cellDeviceData.current.get(cellId);
      if (data) {
        updateCellDisplay(selectedCell, data);
      }
    }
  }, [selectedValue]);

  const handleLabelChange = (value) => {
    if (selectedCell) {
      const currentAttrs = selectedCell.get("attrs") || {};
      selectedCell.set("attrs", {
        ...currentAttrs,
        label: { ...currentAttrs.label, text: value },
      });
      console.log("Label updated:", value);
      setUpdateKey((prev) => prev + 1);
    }
  };

  const handleFillColorChange = (value) => {
    if (selectedCell) {
      const currentAttrs = selectedCell.get("attrs") || {};
      selectedCell.set("attrs", {
        ...currentAttrs,
        body: { ...currentAttrs.body, fill: value },
      });
      console.log("Fill color updated:", value);
      setUpdateKey((prev) => prev + 1);
    }
  };

  const handleEUIChange = (value) => {
    setSelectedEUI(value);
    setSelectedDevice(null);
    setDeviceData(null);
  };

  const handleDeviceChange = (value) => {
    setSelectedDevice(value);

    if (selectedCell && selectedEUI && value) {
      const deviceModel = devices[value]?.model;
      const deviceModelName =
        deviceModels[deviceModel]?.name || "Unknown Device";
      console.log("deviceModelName", deviceModelName);

      subscribeCellToDevice(selectedCell, selectedEUI, value, deviceModel);

      const cellId = getCellId(selectedCell);
      const cellData = cellDeviceData.current.get(cellId);
      setDeviceData(cellData);
    }
  };

  const handleValueChange = (event) => {
    setSelectedValue(event.target.value);
    if (selectedCell) {
      console.log(
        "Stored deviceModelName:",
        selectedCell.prop("custom/deviceModelName")
      );
      const cellId = getCellId(selectedCell);
      const data = cellDeviceData.current.get(cellId);
      if (data) {
        updateCellDisplay(selectedCell, data);
      }
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
            <MenuItem onClick={handleNew}>New File</MenuItem>
            <MenuItem onClick={handleSave}>Save File</MenuItem>
            <MenuItem onClick={handleOpen}>Open File</MenuItem>
            <MenuItem onClick={saveAsRoutine}>Save As File</MenuItem>
          </Menu>

          <IconButton color="inherit" onClick={handleUndo}>
            <Undo size={20} />
          </IconButton>
          <IconButton color="inherit" onClick={handleRedo}>
            <Redo size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
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

          {selectedCell && (
            <Box
              sx={{
                p: 2,
                borderLeft: "1px solid #ccc",
                backgroundColor: "#fafafa",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Label"
                value={selectedCell.get("attrs")?.label?.text || ""}
                onChange={(e) => handleLabelChange(e.target.value)}
                fullWidth
                variant="outlined"
              />

              <TextField
                label="Fill Color"
                type="color"
                value={selectedCell.get("attrs")?.body?.fill || "#ffffff"}
                onChange={(e) => handleFillColorChange(e.target.value)}
                fullWidth
                variant="outlined"
              />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Device EUI</InputLabel>
                <Select
                  value={selectedEUI}
                  onChange={(e) => handleEUIChange(e.target.value)}
                  label="Device EUI"
                >
                  <MenuItem value="">-- Select EUI --</MenuItem>
                  {Object.entries(deviceModels).map(([eui, model]) => (
                    <MenuItem key={eui} value={eui}>
                      {model.name} ({eui})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" disabled={!selectedEUI}>
                <InputLabel>Device ID</InputLabel>
                <Select
                  value={selectedDevice}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  label="Device ID"
                >
                  <MenuItem value="">-- Select Device ID --</MenuItem>
                  {Object.entries(devices).map(([id, device]) => (
                    <MenuItem key={id} value={id}>
                      {device.name || id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedDevice && Object.keys(payload).length > 0 && (
                <FormControl component="fieldset">
                  <Typography variant="subtitle2">Display Value:</Typography>
                  <RadioGroup
                    value={selectedValue}
                    onChange={handleValueChange}
                  >
                    {availableValues.map((value) => (
                      <FormControlLabel
                        key={value}
                        value={value}
                        control={<Radio size="small" />}
                        label={value}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

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
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardEditor;