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
  CircularProgress,
  FormControlLabel,
  Radio,
  Stack,
  Chip,
  Grid,
  Card,
  CardContent,
  Slider,
  Switch,
} from "@mui/material";

import {
  PlayArrow,
  Stop,
  Settings,
  Refresh,
  Opacity,
  Speed,
} from "@mui/icons-material";

import { ChevronDown, Undo, Redo, ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SaveDialog } from "../../../../shared/components/ui";
import { useSelector } from "react-redux";
import {
  Pipe01,
  // PipeView01,
  createPipe,
} from "../../../Widgets/PortLinks/PipeLink";
import * as joint from "@joint/plus";
import MotorPumpSVG from "../../../WidgetSVG/MotorPumpSVG";
import HeatPumpSVG from "../../../WidgetSVG/HeatPumpSVG";
import VatAgitator from "../../../WidgetSVG/VatAgitator";
import Chille from "../../../WidgetSVG/Chiller";
// import IceBank from "../../../WidgetSVG/IceBank";
import ACFan from "../../../WidgetSVG/ACFan";
import VatAgitatorMixser from "../../../WidgetSVG/VatAgitatorMixser";
import VatAgitatorLevel from "../../../WidgetSVG/VatAgitatorLevel";

import CoolingPlate from "../../../Widgets/CoolingPlate";
import MotorPump from "../../../Widgets/MotorPump";
import IceBank from "../../../Widgets/IceBank";
import PlantChiller from "../../../Widgets/PlantChiller";
import {
  VatWithAgitator,
  VatWithAgitatorView,
} from "../../../Widgets/VatAgitator";

import {
  listenForDeviceModels,
  listenForDevices,
  getDeviceModels,
  getDevice,
  getDevicePayload,
  listenForDevicePayload,
  listenForSensoreData,
  getDashboardsFromFirestore,
} from "../../../../../src/services/firebase/dataService";
import { ref, uploadString, getDownloadURL, getBytes } from "firebase/storage";
import { storage } from "../../../../../src/services/firebase/config";
import { useLocation } from "react-router-dom";
import { isEqual } from "lodash";

const FLOW_FLAG = "flow";
const LIQUID_COLOR = "#007acc";

class Pipe extends joint.dia.Link {
  defaults() {
    return {
      ...super.defaults,
      type: "Pipe",
      z: -1,
      router: { name: "rightAngle" },
      flow: 1,
      attrs: {
        liquid: {
          connection: true,
          stroke: LIQUID_COLOR,
          strokeWidth: 20,
          strokeLinejoin: "round",
          strokeLinecap: "square",
          strokeDasharray: "18,20",
        },
        line: {
          connection: true,
          stroke: LIQUID_COLOR,
          strokeWidth: 20,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        },
        outline: {
          connection: true,
          stroke: "#444",
          strokeWidth: 32,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        },
        staticDots1: {
          connection: true,
          stroke: "rgba(255,255,255,0.5)",
          strokeWidth: 10,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "1,15,0.5,20,1.5,25",
          fill: "none",
          transform: "translate(0,-4)",
        },
        staticDots2: {
          connection: true,
          stroke: "rgba(255,255,255,0.4)",
          strokeWidth: 7,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "0.8,18,2,22,0.5,16",
          fill: "none",
          transform: "translate(0,3)",
        },
        staticDots3: {
          connection: true,
          stroke: "rgba(255,255,255,0.2)",
          strokeWidth: 12,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: "0.3,12,1,28,0.8,14",
          fill: "none",
          transform: "translate(-2,0)",
        },
        // staticDots4: {
        //   connection: true,
        //   stroke: "rgba(255,255,255,0.6)",
        //   strokeWidth: 10,
        //   strokeLinecap: "round",
        //   strokeLinejoin: "round",
        //   strokeDasharray: "0.5,20,1.5,16,0.3,24",
        //   fill: "none",
        //   transform: "translate(2,-1)",
        // },
      },
    };
  }

  preinitialize() {
    this.markup = joint.util.svg/* xml */ `
            <path @selector="outline" fill="none"/>
            <path @selector="line" fill="none"/>
            <path @selector="liquid" fill="none"/>
            <path @selector="staticDots1" fill="none"/>
            <path @selector="staticDots2" fill="none"/>
            <path @selector="staticDots3" fill="none"/>
            <path @selector="staticDots4" fill="none"/>
        `;
  }
}

const PipeView = joint.dia.LinkView.extend({
  presentationAttributes: joint.dia.LinkView.addPresentationAttributes({
    flow: [FLOW_FLAG],
  }),

  initFlag: [...joint.dia.LinkView.prototype.initFlag, FLOW_FLAG],

  flowAnimations: null,

  confirmUpdate(...args) {
    let flags = joint.dia.LinkView.prototype.confirmUpdate.call(this, ...args);
    if (this.hasFlag(flags, FLOW_FLAG)) {
      this.updateFlow();
      flags = this.removeFlag(flags, FLOW_FLAG);
    }
    return flags;
  },

  getFlowAnimations() {
    if (this.flowAnimations) return this.flowAnimations;

    this.flowAnimations = {};

    // Get all elements that should have the liquid animation
    const animatedElements = [
      { selector: "liquid", duration: 1000, offset: 90 },
      { selector: "staticDots1", duration: 1200, offset: 60 },
      { selector: "staticDots2", duration: 1400, offset: 70 },
      { selector: "staticDots3", duration: 1100, offset: 55 },
      { selector: "staticDots4", duration: 1300, offset: 65 },
    ];

    animatedElements.forEach(({ selector, duration, offset }) => {
      const element =
        this.findBySelector(selector)[0] ||
        this.el.querySelector(`[joint-selector="${selector}"]`) ||
        this.el.querySelector(`path[selector="${selector}"]`);

      if (element) {
        // element.style.strokeDasharray = "2 5";
        // element.style.strokeLinecap = "round";

        const keyframes = { strokeDashoffset: [offset, 0] };
        const animation = element.animate(keyframes, {
          fill: "forwards",
          duration: duration,
          iterations: Infinity,
          easing: "linear",
        });

        this.flowAnimations[selector] = animation;
      } else {
        console.warn(`Element with selector "${selector}" not found`);
      }
    });

    return this.flowAnimations;
  },

  updateFlow() {
    const flow = this.model.get("flow");
    const animations = this.getFlowAnimations();

    Object.values(animations).forEach((animation) => {
      if (flow) {
        animation.play();
      } else {
        animation.pause();
      }
    });
  },

  onRemove() {
    if (this.flowAnimations) {
      Object.values(this.flowAnimations).forEach((animation) => {
        animation.cancel();
      });
    }
    joint.dia.LinkView.prototype.onRemove.apply(this, arguments);
  },
});

class HeatPump extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "HeatPump",
      size: { width: 680, height: 396 }, // Default size
      power: 0,

      temperature: 0,
      selectedValue: "",
      deviceData: {},
      attrs: {
        root: {
          magnetSelector: "body",
        },
        // body: {
        //   refWidth: "100%",
        //   refHeight: "100%",
        //   fill: "none",
        // },
      },
      ports: {
        groups: {
          in: {
            position: {
              name: "absolute",
              args: { x: 621, y: 46.928 },
            },
            markup: joint.util.svg`
                            <g @selector="portRoot">
                                <rect @selector="pipeBody" />
                                <rect @selector="pipeEnd" />
                                <rect @selector="pipeEndStroke" />
                            </g>
                        `,
            size: { width: 44, height: 77 },
            attrs: {
              portRoot: {
                magnetSelector: "pipeEnd",
              },
              pipeBody: {
                width: 37.7213,
                height: 61.982,
                fill: {
                  type: "linearGradient",
                  stops: [
                    { offset: "0.480769%", color: "#737373" },
                    { offset: "34.6154%", color: "white" },
                    { offset: "68.2692%", color: "white" },
                    { offset: "100%", color: "#737373" },
                  ],
                  attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
                },
                magnet: "active",
              },
              pipeEnd: {
                width: 6.77049,
                height: 77.1171,
                x: 37.7213,
                y: -7.928,
                fill: "#808080",
                magnet: "active",
              },
              pipeEndStroke: {
                width: 10.5082,
                height: 73.1171,
                x: 46.49179,
                y: -5.928,
                fill: "white",
                stroke: "#808080",
                strokeWidth: 4,
              },
            },
          },
          out: {
            position: {
              name: "absolute",
              args: { x: 621, y: 129.811 },
            },
            markup: joint.util.svg`
                            <g @selector="portRoot">
                                <rect @selector="pipeBody" />
                                <rect @selector="pipeEnd" />
                                <rect @selector="pipeEndStroke" />
                            </g>
                        `,
            size: { width: 44, height: 77 },
            attrs: {
              portRoot: {
                magnetSelector: "pipeEnd",
              },
              pipeBody: {
                width: 37.7213,
                height: 61.982,
                fill: {
                  type: "linearGradient",
                  stops: [
                    { offset: "0.480769%", color: "#737373" },
                    { offset: "36.0577%", color: "white" },
                    { offset: "67.3077%", color: "white" },
                    { offset: "100%", color: "#737373" },
                  ],
                  attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
                },
                magnet: "active",
              },
              pipeEnd: {
                width: 6.77049,
                height: 77.1171,
                x: 37.7213,
                y: -7.928,
                fill: "#808080",
                magnet: "active",
              },
              pipeEndStroke: {
                width: 10.5082,
                height: 73.1171,
                x: 46.49179,
                y: -5.928,
                fill: "white",
                stroke: "#808080",
                strokeWidth: 4,
              },
            },
          },
        },
      },
    };
  }

  preinitialize() {
    this.markup = joint.util.svg`
            <rect @selector="body"/>
            <rect @selector="mainContainer"/>
            <circle @selector="centerCircle"/>
            <path @selector="rotator"/>
            <rect @selector="controlPanel"/>
            <text @selector="controlPanelTempText"/>
            <rect @selector="controlPanelBorder"/>
            <rect @selector="leftFoot"/>
            <rect @selector="leftFootEnd"/>
            <rect @selector="rightFoot"/>
            <rect @selector="rightFootEnd"/>
        `;
  }

  initialize() {
    joint.dia.Element.prototype.initialize.apply(this, arguments);
    this.updateAttrs();
    this.updateTemperatureDisplay();
    this.on("change:size", this.updateAttrs, this);
    this.on(
      "change:selectedValue change:deviceData change:temperature",
      this.updateTemperatureDisplay,
      this
    );
  }

  updateAttrs() {
    const size = this.get("size");
    const width = size.width;
    const height = size.height;

    // Calculate scale factors based on original size (680x396)
    const scaleX = width / 680;
    const scaleY = height / 396;
    const minScale = Math.min(scaleX, scaleY);

    // Update all attributes with scaling
    this.attr({
      mainContainer: {
        x: 2 * scaleX,
        y: 2 * scaleY,
        width: 617 * scaleX,
        height: 366 * scaleY,
        rx: 8 * scaleX,
        ry: 8 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#808080" },
            { offset: "28.8462%", color: "#E2E2E2" },
            { offset: "51.9231%", color: "white" },
            { offset: "72.5962%", color: "#E2E2E2" },
            { offset: "100%", color: "#808080" },
          ],
          attrs: { x1: "100%", y1: "50%", x2: "0%", y2: "50%" },
        },
        stroke: "#808080",
        strokeWidth: 4 * Math.min(scaleX, scaleY),
      },
      centerCircle: {
        cx: 423.5 * scaleX,
        cy: 188.5 * scaleY,
        r: 141 * Math.min(scaleX, scaleY),
        fill: {
          type: "radialGradient",
          stops: [
            { offset: "81.7308%", color: "white" },
            { offset: "100%", color: "#999999" },
          ],
          attrs: {
            cx: "62.2794%",
            cy: "47.601%",
            r: "100%",
            gradientTransform: "rotate(90 0.5 0.5) scale(1 1)",
          },
        },
        stroke: "#808080",
        strokeWidth: 15 * Math.min(scaleX, scaleY),
      },
      rotator: {
        d: this.scalePath(
          "M439.762 290.389C439.988 294.345 442.004 297.869 445.296 300.053C447.354 301.434 449.72 302.114 452.106 302.114C453.526 302.114 454.946 301.867 456.324 301.372L485.19 290.965C488.42 289.79 490.972 287.421 492.35 284.268C493.729 281.115 493.749 277.632 492.412 274.458L461.406 200.991L513.542 238.147C515.682 239.671 518.171 240.455 520.702 240.455C521.978 240.455 523.274 240.249 524.529 239.836C528.294 238.62 531.174 235.777 532.45 232.026L542.326 202.948C543.437 199.692 543.169 196.21 541.564 193.18C539.96 190.13 537.264 187.946 533.952 187.018L457.269 165.463L518.809 147.843C522.615 146.751 525.599 144.01 526.998 140.301C528.397 136.591 527.985 132.552 525.846 129.234L509.325 103.351C507.473 100.445 504.592 98.5083 501.218 97.8487C497.823 97.1893 494.449 97.9518 491.651 99.9507L426.782 146.669L451.286 87.255C452.788 83.5869 452.5 79.5479 450.463 76.1473C448.426 72.747 445.01 70.5832 441.081 70.1711L410.569 67.0594C407.092 66.7297 403.8 67.7807 401.187 70.0269C398.595 72.2731 397.072 75.4054 396.908 78.8471L393.184 158.519L362.199 102.445C360.285 98.9827 356.952 96.6955 353.022 96.1595C349.093 95.6443 345.266 96.9426 342.509 99.7865L321.05 121.734C318.643 124.186 317.388 127.442 317.532 130.884C317.655 134.325 319.157 137.458 321.729 139.745L381.557 192.357L318.474 181.62C314.565 180.981 310.696 182.135 307.837 184.876C304.977 187.617 303.619 191.43 304.092 195.366L307.837 225.865C308.248 229.286 310.018 232.295 312.775 234.335C314.935 235.922 317.466 236.767 320.099 236.767C320.84 236.767 321.581 236.705 322.321 236.561L400.732 222.548L352.999 265.226C350.057 267.864 348.555 271.635 348.905 275.571C349.255 279.507 351.395 282.969 354.748 285.051L380.878 301.145C382.853 302.361 385.075 303 387.338 303C388.408 303 389.499 302.856 390.568 302.567C393.881 301.681 396.617 299.517 398.263 296.488L436.243 226.381L439.762 290.389ZM390.798 187.536C390.798 170.04 404.994 155.821 422.462 155.821C439.93 155.821 454.126 170.04 454.126 187.536C454.126 205.032 439.93 219.251 422.462 219.251C405.015 219.251 390.798 205.012 390.798 187.536Z",
          scaleX,
          scaleY
        ),
        fill: "#C9C9C9",
        filter: {
          name: "dropShadow",
          args: {
            dx: 0,
            dy: 4 * Math.min(scaleX, scaleY),
            blur: 4 * Math.min(scaleX, scaleY),
            color: "rgba(0,0,0,0.25)",
          },
        },
      },
      controlPanel: {
        x: 36 * scaleX,
        y: 40 * scaleY,
        width: 191 * scaleX,
        height: 102 * scaleY,
        rx: 8 * scaleX,
        ry: 8 * scaleY,
        fill: "white",
        filter: {
          name: "dropShadow",
          args: {
            dx: 0,
            dy: 4 * Math.min(scaleX, scaleY),
            blur: 25 * Math.min(scaleX, scaleY),
            color: "rgba(0,0,0,0.25)",
          },
        },
      },
      controlPanelBorder: {
        x: 37.5 * scaleX,
        y: 41.5 * scaleY,
        width: 188 * scaleX,
        height: 99 * scaleY,
        rx: 6.5 * scaleX,
        ry: 6.5 * scaleY,
        fill: "none",
        stroke: "#737373",
        strokeWidth: 3 * Math.min(scaleX, scaleY),
      },
      leftFoot: {
        x: 82 * scaleX,
        y: 370 * scaleY,
        width: 58 * scaleX,
        height: 11 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "51.4423%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "0%", y1: "50%", x2: "100%", y2: "50%" },
        },
      },
      leftFootEnd: {
        x: 47 * scaleX,
        y: 381 * scaleY,
        width: 128 * scaleX,
        height: 15 * scaleY,
        fill: "#808080",
      },
      rightFoot: {
        x: 476 * scaleX,
        y: 370 * scaleY,
        width: 58 * scaleX,
        height: 11 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "51.4423%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "0%", y1: "50%", x2: "100%", y2: "50%" },
        },
      },
      rightFootEnd: {
        x: 441 * scaleX,
        y: 381 * scaleY,
        width: 128 * scaleX,
        height: 15 * scaleY,
        fill: "#808080",
      },
    });

    // Update port positions
    this.prop("ports/groups/in/position/args", {
      x: 621 * scaleX,
      y: 46.928 * scaleY,
    });
    this.prop("ports/groups/out/position/args", {
      x: 621 * scaleX,
      y: 129.811 * scaleY,
    });

    const portScale = minScale; // Use uniform scaling for ports to maintain proportions

    this.prop("ports/groups/in/size", {
      width: 44 * portScale,
      height: 77 * portScale,
    });
    this.prop("ports/groups/out/size", {
      width: 44 * portScale,
      height: 77 * portScale,
    });

    // Update port attributes
    this.prop("ports/groups/in/attrs/pipeBody", {
      width: 37.7213 * portScale,
      height: 61.982 * portScale,
    });
    this.prop("ports/groups/in/attrs/pipeEnd", {
      width: 6.77049 * portScale,
      height: 77.1171 * portScale,
      x: 37.7213 * portScale,
      y: -7.928 * portScale,
    });
    this.prop("ports/groups/in/attrs/pipeEndStroke", {
      width: 10.5082 * portScale,
      height: 73.1171 * portScale,
      x: 46.49179 * portScale,
      y: -5.928 * portScale,
      strokeWidth: 4 * portScale,
    });

    // Repeat for out port
    this.prop("ports/groups/out/attrs/pipeBody", {
      width: 37.7213 * portScale,
      height: 61.982 * portScale,
    });
    this.prop("ports/groups/out/attrs/pipeEnd", {
      width: 6.77049 * portScale,
      height: 77.1171 * portScale,
      x: 37.7213 * portScale,
      y: -7.928 * portScale,
    });
    this.prop("ports/groups/out/attrs/pipeEndStroke", {
      width: 10.5082 * portScale,
      height: 73.1171 * portScale,
      x: 46.49179 * portScale,
      y: -5.928 * portScale,
      strokeWidth: 4 * portScale,
    });

    // Update port positions (keep your existing code)
    this.prop("ports/groups/in/position/args", {
      x: 621 * scaleX,
      y: 46.928 * scaleY,
    });
    this.prop("ports/groups/out/position/args", {
      x: 621 * scaleX,
      y: 129.811 * scaleY,
    });
  }

  updateTemperatureDisplay() {
    const size = this.get("size");
    const scaleX = size.width / 771;
    const scaleY = size.height / 646;
    const minScale = Math.min(scaleX, scaleY);

    const selectedValue = this.get("selectedValue");
    const deviceData = this.get("deviceData") || {};
    const temperature = this.get("temperature") || 0;

    let displayValue;
    let displayText;

    if (selectedValue && deviceData[selectedValue] !== undefined) {
      // If a specific value is selected and exists in device data, use it
      displayValue = deviceData[selectedValue];
      displayText = `${displayValue}`;
    } else if (selectedValue === "temperature" && temperature !== undefined) {
      // If temperature is specifically selected, use the temperature property
      displayValue = temperature;
      displayText = `${displayValue}`;
    } else {
      // Default fallback
      displayValue = temperature;
      displayText = `${displayValue}`;
    }

    // Format the display value (you can customize this formatting)
    if (typeof displayValue === "number") {
      const formattedValue = displayValue.toFixed(1);
      if (selectedValue === "temperature") {
        displayText = displayText.replace(
          displayValue.toString(),
          formattedValue + "°C"
        );
      } else {
        displayText = displayText.replace(
          displayValue.toString(),
          formattedValue
        );
      }
    } else if (selectedValue === "temperature") {
      displayText = displayText + "°C";
    }

    this.attr("controlPanelTempText", {
      x: 90 * scaleX,
      y: 170 * scaleY,
      text: displayText,
      fontSize: 70 * minScale,
      fontFamily: "Arial",
      fill: "#333",
      fontWeight: "bold",
      originX: "center",
      originY: "center",
    });
  }

  scalePath(pathData, scaleX, scaleY) {
    return pathData.replace(
      /([MLCQAZHV])([^MLCQAZHV]*)/g,
      (match, cmd, coords) => {
        if (!coords) return match;

        return (
          cmd +
          coords
            .split(/[\s,]/)
            .filter(Boolean)
            .map((coord, i) => {
              const num = parseFloat(coord);
              return i % 2 === 0 ? num * scaleX : num * scaleY;
            })
            .join(" ")
        );
      }
    );
  }

  setSelectedValue(value) {
    this.set("selectedValue", value);
  }

  // NEW METHOD: Update device data and refresh display
  updateDeviceData(data) {
    this.set("deviceData", data);
  }

  get power() {
    return this.get("power") || 0;
  }

  set power(value) {
    this.set("power", value);
  }

  get temperature() {
    return this.get("temperature") || 0;
  }

  set temperature(value) {
    this.set("temperature", value);
  }

  set(key, value, options) {
    const result = super.set(key, value, options);

    if (typeof key === "object") {
      if (
        key.selectedValue !== undefined ||
        key.deviceData !== undefined ||
        key.temperature !== undefined
      ) {
        this.updateTemperatureDisplay();
      }
    } else if (
      key === "selectedValue" ||
      key === "deviceData" ||
      key === "temperature"
    ) {
      this.updateTemperatureDisplay();
    }

    return result;
  }
}
const HeatPumpView = joint.dia.ElementView.extend({
  presentationAttributes: joint.dia.ElementView.addPresentationAttributes({
    power: ["POWER"],
  }),

  initFlag: [joint.dia.ElementView.Flags.RENDER, "POWER"],

  confirmUpdate(...args) {
    console.log(" mechanicalPathEl confirmUpdate called with flags:", args); // Debug
    let flags = joint.dia.ElementView.prototype.confirmUpdate.call(
      this,
      ...args
    );
    if (this.hasFlag(flags, "POWER")) {
      console.log("POWER flag detected, toggling power");
      this.togglePower();
      flags = this.removeFlag(flags, "POWER");
    }
    return flags;
  },

  getSpinAnimation() {
    if (this.spinAnimation) return this.spinAnimation;

    // Use the correct selector that matches the HeatPump class definition
    const mechanicalPathEl =
      this.findBySelector("rotator")[0] ||
      this.el.querySelector('[joint-selector="rotator"]') ||
      this.el.querySelector('path[selector="rotator"]');
    console.log("mechanicalPathEl:", mechanicalPathEl);
    if (!mechanicalPathEl) {
      console.error(
        "rotator element not found! Available elements:",
        this.el.innerHTML
      );
      return null;
    }
    const size = this.model.get("size");
    const width = size.width;
    const height = size.height;
    const scaleX = width / 680;
    const scaleY = height / 396;
    const centerX = 423.5 * scaleX;
    const centerY = 188.5 * scaleY;

    // Set the transform origin to the scaled center position
    mechanicalPathEl.style.transformOrigin = `${centerX}px ${centerY}px`;

    const keyframes = { transform: ["rotate(0deg)", "rotate(360deg)"] };
    this.spinAnimation = mechanicalPathEl.animate(keyframes, {
      duration: 1000,
      iterations: Infinity,
    });
    return this.spinAnimation;
  },

  togglePower() {
    const { model } = this;
    const power = model.power;
    console.log("togglePower called with power:", power);
    console.log("HeatPump togglePower called with power:", power);
    console.log("Model attributes:", model.attributes);

    if (power > 0) {
      const anim = this.getSpinAnimation();
      if (anim) {
        anim.playbackRate = power;
        anim.play();
        console.log("Animation playing with playbackRate:", power);
      } else {
        console.error("No animation available");
      }
    } else {
      if (this.spinAnimation) {
        this.spinAnimation.cancel();
        console.log("Animation canceled"); // Debug
        this.spinAnimation = null;
      }
    }
  },
});

class TemplateImage extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "TemplateImage",
      attrs: {
        image: {
          width: "calc(w)",
          height: "calc(h)",
          "data-animated": false,
          class: "",
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
  tankVolumeUpAnimation() {
    // Animate the image height from 60% to 100% and back
    this.stopAnimation(); // Stop any previous animation
    this.attr("image/data-animated", true);
    this.attr("image/class", "tank-volume-up");

    return this;
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
  startAnimation(type = "pulse") {
    this.attr("image/data-animated", true);
    this.attr("image/class", type);
    this.trigger("animation:start");
    return this;
  }

  stopAnimation() {
    this.attr("image/data-animated", false);
    this.attr("image/class", "");
    this.trigger("animation:stop");
    return this;
  }
  pulse() {
    return this.startAnimation("pulse");
  }

  rotate() {
    return this.startAnimation("rotate");
  }

  flowAnimation() {
    this.transition("attrs/image/x", 10, {
      delay: 0,
      duration: 1000,
      valueFunction: joint.util.interpolate.number(0, 10),
      timingFunction: joint.util.timing.linear,
    });

    this.transition("attrs/image/y", 10, {
      delay: 1000,
      duration: 1000,
      valueFunction: joint.util.interpolate.number(0, 10),
      timingFunction: joint.util.timing.linear,
    });

    this.transition("attrs/image/x", 0, {
      delay: 2000,
      duration: 1000,
      valueFunction: joint.util.interpolate.number(10, 0),
      timingFunction: joint.util.timing.linear,
    });

    this.transition("attrs/image/y", 0, {
      delay: 3000,
      duration: 1000,
      valueFunction: joint.util.interpolate.number(10, 0),
      timingFunction: joint.util.timing.linear,
    });

    return this;
  }

  scaleHeight(percentage) {
    const originalHeight = this.get("originalHeight") || this.size().height;
    if (!this.get("originalHeight")) {
      this.set("originalHeight", originalHeight);
    }
    const newHeight = (originalHeight * percentage) / 100;
    const currentPos = this.position();
    const currentHeight = this.size().height;
    const currentWidth = this.size().width;

    // Calculate new Y position to maintain bottom anchor point
    const newY = currentPos.y + (currentHeight - newHeight);

    // Keep the same width, only change height
    this.resize(currentWidth, newHeight);
    this.position(currentPos.x, newY);
    return this;
  }

  heightAnimation() {
    // Add a custom CSS property for the scale value
    document.documentElement.style.setProperty(
      "--scale-height",
      this.get("scaleY") || "0.2"
    );
    this.attr("image/data-animated", true);
    this.attr("image/class", "height-scale");
    return this;
  }

  setScale(value) {
    this.set("scaleY", value);
    document.documentElement.style.setProperty("--scale-height", value);
    return this;
  }
}

const DashboardEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Refs
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
  const [selectedValue, setSelectedValue] = useState([]);
  const [availableValues, setAvailableValues] = useState([]);
  const [payload, setPayload] = useState({});
  const [animationType, setAnimationType] = useState("pulse");
  const [animationSpeed, setAnimationSpeed] = useState(1);

  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedElementType, setSelectedElementType] = useState(null);
  const [elements, setElements] = useState({});

  const [heightScale, setHeightScale] = useState(100); // Add this state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadingExistingDashboard, setLoadingExistingDashboard] =
    useState(false);
  const [existingDashboard, setExistingDashboard] = useState(null);
  const [loadError, setLoadError] = useState("");
  const setInspectorContainer = (newValue) => {
    inspectorContainerRef.current = newValue;
  };
  const handleStartAnimation = () => {
    if (!selectedCell) return;

    switch (animationType) {
      case "pulse":
        selectedCell.pulse();
        break;
      case "rotate":
        selectedCell.rotate();
        break;
      case "flow":
        selectedCell.flowAnimation();
        break;
      case "tank-volume-up":
        selectedCell.tankVolumeUpAnimation();
        break;
      case "height-scale":
        selectedCell.heightAnimation();
        selectedCell.scaleHeight(heightScale);
        break;
      default:
        selectedCell.startAnimation(animationType);
    }
    const imageEl = document.querySelector(
      `[model-id="${selectedCell.id}"] image`
    );
    if (imageEl) {
      imageEl.style.animationDuration = `${2 / animationSpeed}s`;
    }
  };

  const handleAnimationSpeedChange = (event) => {
    const speed = parseFloat(event.target.value);
    setAnimationSpeed(speed);

    if (selectedCell && selectedCell.attr("image/data-animated")) {
      const imageEl = document.querySelector(
        `[model-id="${selectedCell.id}"] image`
      );
      if (imageEl) {
        imageEl.style.animationDuration = `${2 / speed}s`;
      }
    }
  };

  const handleStopAnimation = () => {
    try {
      if (!selectedCell) {
        console.warn("No cell selected to stop animation");
        return;
      }
      selectedCell.stopAnimation();
    } catch (error) {
      console.error("Error stopping animation:", error);
      // Attempt recovery by resetting animation states
      try {
        if (selectedCell) {
          selectedCell.attr("image/data-animated", false);
          selectedCell.attr("image/class", "");
        }
      } catch (recoveryError) {
        console.error("Failed to recover from animation error:", recoveryError);
      }
    }
  };

  const handleAnimationTypeChange = (event) => {
    setAnimationType(event.target.value);
  };
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

    const cellId = getCellId(cell);

    // Clean up any existing subscription
    if (deviceSubscriptions.current.has(cellId)) {
      deviceSubscriptions.current.get(cellId)();
    }

    console.log("payload01", data);
    console.log("asas selectedEUI", selectedEUI);
    console.log("asas selectedDevice", selectedDevice);
    console.log("asas selectedValue", selectedValue);
    const unsubscribe = listenForSensoreData(
      selectedEUI,
      selectedDevice,
      selectedValue.length > 0 ? selectedValue[0] : null,
      (value) => {
        try {
          if (typeof value !== "undefined") {
            let displayText;
            try {
              const modelName =
                formatKey(selectedValue.length > 0 ? selectedValue[0] : "") ||
                "Device";
              if (typeof value === "number") {
                // Format numbers with 2 decimal places
                displayText = `${modelName}: ${value}`;
              } else if (typeof value === "boolean") {
                // Convert boolean to "On"/"Off"
                displayText = `${modelName}: ${value ? "On" : "Off"}`;
              } else if (value === null || value === "") {
                // Handle null or empty values
                displayText = `${modelName}: N/A`;
              } else {
                // Default case for strings and other types
                displayText = `${modelName}: ${value}`;
              }
              if (cell.get("type") === "CoolingPlate") {
                cell.setSelectedValue(selectedValue);
                cell.updateDeviceData({ [selectedValue]: value });

                // Also update temperature property if selectedValue is temperature
                if (selectedValue === "temperature") {
                  cell.set("temperature", value);
                  updateElementAttributes(cellId, { temperature: value });
                }
              } else if (cell.get("type") === "PlantChiller") {
                cell.setSelectedValue(selectedValue);
                cell.updateDeviceData({ [selectedValue]: value });
                if (selectedValue === "temperature") {
                  cell.set("temperature", value);
                  updateElementAttributes(cellId, { temperature: value });
                }
              } else if (cell.get("type") === "HeatPump") {
                cell.setSelectedValue(selectedValue);
                cell.updateDeviceData({ [selectedValue]: value });
                if (selectedValue === "temperature") {
                  cell.set("temperature", value);
                  updateElementAttributes(cellId, { temperature: value });
                }
              } else if (cell.get("type") === "VatWithAgitator") {
                cell.setSelectedValue(selectedValue);
                cell.updateDeviceData({ [selectedValue]: value });
                if (selectedValue === "temperature") {
                  cell.set("temperature", value);
                  updateElementAttributes(cellId, { temperature: value });
                }
              } else {
                // For other cell types, use the label
                cell.attr("label/text", displayText);
              }
              cell.attr("label/text", displayText);
            } catch (labelError) {
              console.error("Error formatting label:", labelError);
              // cell.attr("label/text", "Error: Invalid Value");
            }

            if (cell.get("type") === "CoolingPlate") {
              // Also update temperature property if selectedValue is temperature
              if (
                typeof value === "number" &&
                selectedValue === "temperature"
              ) {
                cell.set("temperature", value);
                // updateElementAttributes(selectedElement, {
                //   ...elementData,
                //   temperature: value,
                // });
              }
            }

            if (cell.get("type") === "PlantChiller") {
              // Also update temperature property if selectedValue is temperature
              if (
                typeof value === "number" &&
                selectedValue === "temperature"
              ) {
                cell.set("temperature", value);
                // updateElementAttributes(selectedElement, {
                //   ...elementData,
                //   temperature: value,
                // });
              }
            }
            if (cell.get("type") === "HeatPump") {
              // Also update temperature property if selectedValue is temperature
              if (
                typeof value === "number" &&
                selectedValue === "temperature"
              ) {
                cell.set("temperature", value);
                // updateElementAttributes(selectedElement, {
                //   ...elementData,
                //   temperature: value,
                // });
              }
            }
            if (cell.get("type") === "VatWithAgitator") {
              // Also update temperature property if selectedValue is temperature
              if (
                typeof value === "number" &&
                selectedValue === "temperature"
              ) {
                cell.set("temperature", value);
                // updateElementAttributes(selectedElement, {
                //   ...elementData,
                //   temperature: value,
                // });
              }
            }
            if (typeof value === "number" && selectedValue.includes("level")) {
              // Scale the tank height based on the value
              const tankPercentage = (value / 100) * 100; // Assuming value is 0-100
              // cell.scaleHeight(tankPercentage);
              const scaleValue = 0.2 + (value / 100) * 0.8;
              // Update both height and CSS scale
              updateElementAttributes(selectedElement, {
                waterLevel: scaleValue,
              });

              //  cell.setScale(scaleValue);
              //  // Add animation effect
              //  cell.attr("image/data-animated", true);
              //  cell.attr("image/class", "height-scale");

              //  // Update color based on level
              //  const normalizedValue = Math.min(Math.max(value / 100, 0), 1);
              //  const hue = (1 - normalizedValue) * 120;
              //  cell.attr("body/fill", `hsl(${hue}, 100%, 80%)`);
            } else if (
              selectedValue.includes("magnet_status") &&
              value == "open"
            ) {
              const isOpen = value === "open";
              updateElementAttributes(selectedElement, {
                magnet_status: "open",
              });
            } else if (value == "open") {
              turnOn(selectedElement);
              //  selectedCell.rotate();
              //  const imageEl = document.querySelector(
              //    `[model-id="${selectedCell.id}"] image`
              //  );
              //  if (imageEl) {
              //    imageEl.style.animationDuration = `${2 / animationSpeed}s`;
              //  }
            } else if (
              selectedValue.includes("running_status") &&
              value == "on"
            ) {
              turnOn(selectedElement);
              selectedCell.tankVolumeUpAnimation();
              const imageEl = document.querySelector(
                `[model-id="${selectedCell.id}"] image`
              );
              if (imageEl) {
                imageEl.style.animationDuration = `${2 / animationSpeed}s`;
              }
            } else if (selectedValue.includes("agi_mixer") && value == "on") {
              updateElementAttributes(selectedElement, {
                ...elementData,
                agitatorSpeed: 100,
              });
              // selectedCell.startAnimation("rotate3d");
              // const imageEl = document.querySelector(
              //              `[model-id="${selectedCell.id}"] image`
              //            );
              //            if (imageEl) {
              //              imageEl.style.animationDuration = `${2 / animationSpeed}s`;
              //            }
            } else {
              try {
                turnOff(selectedElement);
                updateElementAttributes(selectedElement, {
                  ...elementData,
                  agitatorSpeed: 0,
                });
                if (selectedCell) {
                  selectedCell.stopAnimation();
                }
              } catch (error) {
                console.error("Error stopping cell animation:", error);
                // Attempt to reset animation state
                try {
                  if (selectedCell) {
                    selectedCell.attr("image/data-animated", false);
                    selectedCell.attr("image/class", "");
                  }
                } catch (recoveryError) {
                  console.error(
                    "Failed to reset animation state:",
                    recoveryError
                  );
                }
              }
            }
            if (typeof value === "number") {
              const range = deviceModels[cell.prop("custom/deviceModel")]
                ?.range || [0, 100];
              const normalizedValue = Math.min(
                Math.max((value - range[0]) / (range[1] - range[0]), 0),
                1
              );
              console.log("normalizedValue", normalizedValue);
              const hue = (1 - normalizedValue) * 120; // Green (0) to Red (120)
              cell.attr("body/fill", `hsl(${hue}, 100%, 80%)`);
            } else {
              cell.attr("body/fill", "none");
            }
          }
        } catch (error) {
          console.error("Error updating cell display:", error);
          if (cell.get("type") === "CoolingPlate") {
            cell.updateDeviceData({ [selectedValue]: "Error" });
          } else if (cell.get("type") === "PlantChiller") {
            cell.updateDeviceData({ [selectedValue]: "Error" });
          } else if (cell.get("type") === "HeatPump") {
            cell.updateDeviceData({ [selectedValue]: "Error" });
          } else if (cell.get("type") === "VatWithAgitator") {
            cell.updateDeviceData({ [selectedValue]: "Error" });
          } else {
            cell.attr("label/text", "Error: Update Failed");
          }
        }
      }
    );

    unsubscribe();
  };

  const subscribeCellToDevice = (cell, eui, deviceId, deviceModel) => {
    const cellId = getCellId(cell);

    if (deviceSubscriptions.current.has(cellId)) {
      deviceSubscriptions.current.get(cellId)();
      deviceSubscriptions.current.delete(cellId);
    }

    if (eui && deviceId) {
      const fetchDevicePayload = async () => {
        if (eui && deviceId) {
          try {
            const data = await getDevicePayload(eui, deviceId);
            console.log(`Device data for cell ${cellId}:`, data);
            cellDeviceData.current.set(cellId, data);
            setPayload(data);

            const payloadKeys = Object.keys(data || {});

            if (payloadKeys.length > 0) {
              setAvailableValues(payloadKeys);
              console.log("payloadKeys", payloadKeys);
              // Don't automatically select the first value
              // Let the user manually select which value they want to display
            }
            
            // Only use sensor data if a value is already selected
            const sensorDataToUse = 
              (selectedValue.length > 0 ? selectedValue[0] : null);

            console.log("sensorDataToUse", sensorDataToUse);
            if (sensorDataToUse) {
              const unsubscribe = listenForSensoreData(
                eui,
                deviceId,
                sensorDataToUse,
                (value) => {
                  const modelName = sensorDataToUse || "Device";

                  if (cell.get("type") === "CoolingPlate") {
                    cell.setSelectedValue(sensorDataToUse);
                    cell.updateDeviceData({ [sensorDataToUse]: value });

                    if (sensorDataToUse === "temperature") {
                      cell.set("temperature", value);
                      updateElementAttributes(cellId, { temperature: value });
                    }
                  } else {
                    // Handle other cell types
                    cell.attr("label/text", `${modelName}: ${value}`);
                  }
                  if (cell.get("type") === "PlantChiller") {
                    // Handle PlantChiller updates
                    cell.setSelectedValue(sensorDataToUse);
                    cell.updateDeviceData({ [sensorDataToUse]: value });

                    if (sensorDataToUse === "temperature") {
                      cell.set("temperature", value);
                      updateElementAttributes(cellId, { temperature: value });
                    }
                  } else {
                    // Handle other cell types
                    cell.attr("label/text", `${modelName}: ${value}`);
                  }

                  if (cell.get("type") === "HeatPump") {
                    cell.setSelectedValue(sensorDataToUse);
                    cell.updateDeviceData({ [sensorDataToUse]: value });

                    if (sensorDataToUse === "temperature") {
                      cell.set("temperature", value);
                      updateElementAttributes(cellId, { temperature: value });
                    }
                  } else {
                    // Handle other cell types
                    cell.attr("label/text", `${modelName}: ${value}`);
                  }
                  if (cell.get("type") === "VatWithAgitator") {
                    cell.setSelectedValue(sensorDataToUse);
                    cell.updateDeviceData({ [sensorDataToUse]: value });

                    if (sensorDataToUse === "temperature") {
                      cell.set("temperature", value);
                      updateElementAttributes(cellId, { temperature: value });
                    }
                  } else {
                    // Handle other cell types
                    cell.attr("label/text", `${modelName}: ${value}`);
                  }
                  if (typeof value !== "undefined") {
                    const modelName = sensorDataToUse || "Device";
                    cell.attr("label/text", `${modelName}: ${value}`);

                    if (typeof value === "number") {
                      const range = deviceModels[deviceModel]?.range || [
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
                }
              );

              // Store the unsubscribe function
              deviceSubscriptions.current.set(cellId, unsubscribe);
            }
            //updateCellDisplay(cell, data);
            // Do something with the payload
          } catch (error) {
            console.error("Error fetching device payload:", error);
          }
        }
      };
      fetchDevicePayload();

      // deviceSubscriptions.current.set(cellId, unsubscribe);

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
    const fetchDeviceModels = async () => {
      try {
        const models = await getDeviceModels();
        console.log("Fetched device models:", models);
        setDeviceModels(models);
        const euis = Object.keys(models);
        console.log("Fetched EUIs:", euis);
        setDeviceEUIs(euis);
      } catch (error) {
        console.error("Error fetching device models:", error);
      }
    };

    fetchDeviceModels();
  }, []);

  useEffect(() => {
    const fetchDevice = async () => {
      if (selectedEUI) {
        try {
          console.log("Fetching Devices for EUI:", selectedEUI);
          const newdevices = await getDevice(selectedEUI);
          console.log("Fetched Devices:", newdevices);
          setDevices(newdevices);
        } catch (error) {
          console.error("Error fetching device:", error);
        }
      } else {
        setDevices({});
      }
    };

    fetchDevice();
  }, [selectedEUI]);

  // Load existing dashboard if ID is provided in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const dashboardId = searchParams.get("id");

    if (dashboardId && user?.uid) {
      loadExistingDashboard(dashboardId);
    }
  }, [location.search, user?.uid]);

  const loadExistingDashboard = async (dashboardId) => {
    try {
      setLoadingExistingDashboard(true);
      setLoadError("");

      // Get dashboard metadata from Firestore
      const dashboards = await getDashboardsFromFirestore(user?.uid);
      const dashboard = dashboards.find((d) => d.id === dashboardId);

      if (!dashboard) {
        throw new Error("Dashboard not found");
      }

      console.log("dashboard", dashboard);

      setExistingDashboard(dashboard);

      // Load the dashboard file from Firebase Storage using the SDK
      if (dashboard.filepath) {
        try {
          // Directly fetch the URL you already have
          const response = await fetch(dashboard.filepath);

          console.log("dashboardData", response);
          if (!response.ok) {
            throw new Error("Failed to load dashboard file from URL");
          }

          const dashboardData = await response.json();

          console.log("Dashboard data loaded:", dashboardData);

          // Load the graph data into the paper
          if (paperRef.current && dashboardData) {
            paperRef.current.model.fromJSON(dashboardData);
            console.log(
              "Dashboard loaded successfully via fetch:",
              dashboardData
            );
          }

          // Update current file name
          setCurrentFileName(dashboard.fileName || "Untitled.joint");
        } catch (error) {
          console.error("Failed to load dashboard from URL:", error);
          throw new Error("Could not load the dashboard file.");
        }
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoadError(`Failed to load dashboard: ${error.message}`);
    } finally {
      setLoadingExistingDashboard(false);
    }
  };

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

        paperRef.current.model.getCells().forEach((cell) => {
          if (cell.prop("custom/deviceEUI")) {
            subscribeCellToDevice(
              cell,
              cell.prop("custom/deviceEUI"),
              cell.prop("custom/deviceID"),
              cell.prop("custom/deviceModel")
            );
          }
        });
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
  joint.shapes.custom.HeatPump = HeatPump;
  joint.shapes.custom.CoolingPlate = CoolingPlate;
  joint.shapes.custom.VatWithAgitator = VatWithAgitator;
  joint.shapes.custom.MotorPump = MotorPump;
  joint.shapes.custom.PlantChiller = PlantChiller;
  joint.shapes.custom.IceBank = IceBank;

  const [isLoadingEUIs, setIsLoadingEUIs] = useState(true);
  const [isLoadingDeviceIDs, setIsLoadingDeviceIDs] = useState(false);

  useEffect(() => {
    const { dia, shapes, mvc, ui, highlighters, util } = joint;
    const namespace = {
      ...shapes,
      TemplateImage,
      Pipe,
      PipeView,
      HeatPump,
      HeatPumpView,
      CoolingPlate,
      VatWithAgitator,
      VatWithAgitatorView,
      MotorPump,
      PlantChiller,
      IceBank,
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
        return new Pipe();
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
      const element = elementView.model;
      if (inspectorInstanceRef.current) {
        inspectorInstanceRef.current.remove();
      }
      setSelectedCell(cell);

      if (!elements[element.id]) {
        addElementToState(element);
      }

      setSelectedElement(element.id);
      setSelectedElementType(element?.attributes?.type);
      console.log("setSelectedElement01", element?.attributes?.type);

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

    paper.on("element:pointerclick", (elementView) => {
      elementView.addTools(
        new dia.ToolsView({
          tools: [
            new joint.elementTools.Boundary({
              // padding: 10,
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
            new joint.elementTools.Remove({
              useModelGeometry: true,
              x: -10,
              y: -10,
            }),
          ],
          layer: dia.Paper.Layers.BACK,
        })
      );
    });

    // paper.on("element:pointerclick", (elementView) => {
    //   elementView.removeTools();
    // });

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

    const rect = new joint.shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 100, height: 50 },
      attrs: {
        body: { fill: "#ffffff", stroke: "#000000" },
        label: { text: "Text", fill: "#000000" },
      },
      custom: {
        description: "A sample rectangle",
        color: "#ffffff",
      },
    });

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

    const stencilElements = [
      // {
      //   type: "custom.TemplateImage",
      //   svg: MotorPumpSVG,
      //   size: { width: 80, height: 60 },
      //   cloneSize: { width: 200, height: 200 },
      //   attrs: {
      //     image: {
      //       "data-animated": false,
      //       class: "",
      //     },
      //   },
      //   contextMenu: [
      //     {
      //       content: "Pulse Animation",
      //       action: (cellView) => cellView.model.pulse(),
      //     },
      //     {
      //       content: "Rotate Animation",
      //       action: (cellView) => cellView.model.rotate(),
      //     },
      //     "-",
      //     {
      //       content: "Stop Animation",
      //       action: (cellView) => cellView.model.stopAnimation(),
      //     },
      //   ],
      // },
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
      new HeatPump({
        position: { x: 10, y: 10 },
        size: { width: 100, height: 60 },
        cloneSize: { width: 340, height: 198 },
        ports: {
          items: [
            { id: "in1", group: "in" },
            { id: "out1", group: "out" },
          ],
        },
        attrs: {
          label: { text: "Heap Pump" },
        },
      }),
      new CoolingPlate({
        position: { x: 10, y: 10 },
        size: { width: 80, height: 112 },
        cloneSize: { width: 321, height: 512 },
        ports: {
          items: [
            { id: "in1", group: "in" },
            { id: "out1", group: "out" },
          ],
        },
        attrs: {
          label: { text: "Heap Pump" },
        },
      }),
      new VatWithAgitator({
        position: { x: 10, y: 10 },
        size: { width: 80, height: 112 },
        cloneSize: { width: 300, height: 368 },
        ports: {
          items: [
            { id: "in1", group: "in" },
            { id: "out1", group: "out" },
          ],
        },
        attrs: {
          label: { text: "Heap Pump" },
        },
      }),
      new MotorPump({
        position: { x: 10, y: 10 },
        size: { width: 100, height: 80 },
        cloneSize: { width: 270, height: 200 },
        ports: {
          items: [
            { id: "in1", group: "in" },
            { id: "out1", group: "out" },
          ],
        },
        attrs: {
          label: { text: "MotorPump" },
        },
      }),
      new PlantChiller({
        position: { x: 10, y: 10 },
        size: { width: 100, height: 80 },
        cloneSize: { width: 270, height: 200 },
        ports: {
          items: [
            { id: "in1", group: "in", args: { x: 712, y: 167.928 } },
            { id: "out1", group: "out", args: { x: 712, y: 347.928 } },
            { id: "out2", group: "out", args: { x: 712, y: 440.928 } },
          ],
        },
        attrs: {
          label: { text: "MotorPump" },
        },
      }),
      new IceBank({
        position: { x: 10, y: 10 },
        size: { width: 100, height: 80 },
        cloneSize: { width: 390, height: 280 },
        ports: {
          items: [
            { id: "in1", group: "in" },
            { id: "in2", group: "in" },
            { id: "out2", group: "out" },
            { id: "out4", group: "out" },
          ],
        },
        attrs: {
          label: { text: "MotorPump" },
        },
      }),
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
      // {
      //   type: "custom.TemplateImage",
      //   svg: MotorPumpSVG,
      //   size: { width: 80, height: 60 },
      //   cloneSize: { width: 200, height: 200 },
      //   attrs: {},
      // },
      // {
      //   type: "custom.TemplateImage",
      //   svg: HeatPumpSVG,
      //   size: { width: 80, height: 60 },
      //   cloneSize: { width: 200, height: 200 },
      //   attrs: {},
      // },
      // {
      //   type: "custom.TemplateImage",
      //   svg: VatAgitator,
      //   size: { width: 80, height: 60 },
      //   cloneSize: { width: 200, height: 250 },
      //   attrs: {},
      // },
      // {
      //   type: "custom.TemplateImage",
      //   svg: Chille,
      //   size: { width: 80, height: 60 },
      //   cloneSize: { width: 250, height: 200 },
      //   attrs: {},
      // },
      // // {
      // //   type: "custom.TemplateImage",
      // //   svg: IceBank,
      // //   size: { width: 80, height: 60 },
      // //   cloneSize: { width: 250, height: 200 },
      // //   attrs: {},
      // // },
      // {
      //   type: "custom.TemplateImage",
      //   svg: ACFan,
      //   size: { width: 80, height: 60 },
      //   cloneSize: { width: 250, height: 200 },
      //   attrs: {},
      // },
      // {
      //   type: "custom.TemplateImage",
      //   svg: VatAgitatorMixser,
      //   size: { width: 80, height: 60 },
      //   cloneSize: { width: 80, height: 120 },
      //   attrs: {},
      // },
      // {
      //   type: "custom.TemplateImage",
      //   svg: VatAgitatorLevel,
      //   size: { width: 80, height: 60 },
      //   cloneSize: { width: 80, height: 120 },
      //   attrs: {},
      // },
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
          markup: joint.util.svg/*xml*/ `
      <g @selector="portBody" magnet="active">
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
      </g>
     `,
        },
      },
      {
        type: "standard.Path",
        size: { width: 30, height: 25 },
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
          markup: util.svg`
      <rect @selector="pipeBody" magnet="active" port-group="out"/>
      <rect @selector="pipeEnd" x="-12"/>
      `,
        },
      },
      {
        type: "standard.Path",
        size: { width: 30, height: 25 },
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
          markup: util.svg`
          <rect @selector="pipeBody"  magnet="passive" port-group="in" />
          <rect @selector="pipeEnd" />
        `,
        },
      },
      {
        type: "standard.Path",
        size: { width: 30, height: 25 },
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
          markup: util.svg`
        <rect @selector="pipeBody"  magnet="active" port-group="out" />
        <rect @selector="pipeEnd" />
      `,
        },
      },
      {
        type: "standard.Path",
        size: { width: 30, height: 25 },
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
          markup: util.svg`
        <rect @selector="pipeBody"  magnet="passive" port-group="in" />
        <rect @selector="pipeEnd" />
      `,
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

    stencil.load({
      elements: stencilElements,

      // ports: stencilPorts
    });

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
            position: {
              name: "line",
              args: {
                start: { x: "calc(w)", y: "calc(h/2 + 80)" },
                end: { x: "calc(w)", y: 40 },
              },
            },
            markup: util.svg`
                            <rect @selector="pipeBody"   x="-12"
                    y="-12"
                    width="24"
                    height="24"
                    fill="#ff9580"
                    stroke="#333333"
                    stroke-width="2"
                    magnet="active"/>
                            <rect @selector="pipeEnd" />
                        `,
            size: { width: 30, height: 30 },
            z: -1,
            attrs: {
              portRoot: {
                magnet: "active",
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
                magnet: "active",
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

    // const heatPump = new HeatPump({
    //   position: { x: 320, y: 250 },
    //   power: 0,
    // });
    // // heatpumpRef.current = heatPump;
    // graph.addCell(heatPump);

    // const vat = new VatWithAgitator({
    //   position: { x: 320, y: 250 },
    //   size: { width: 300, height: 368 },
    //   waterLevel: 0,
    //   agitatorSpeed: 0,
    // });
    // // vatRef.current = vat;
    // graph.addCell(vat);

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

    return () => {
      deviceSubscriptions.current.forEach((unsubscribe) => unsubscribe());
      deviceSubscriptions.current.clear();
      cellDeviceData.current.clear();
      paper.remove();
      stencil.remove();
    };
  }, []);

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
    const newValue = event.target.value;
    const value =
      typeof event.target.value === "string"
        ? event.target.value.split(",")
        : event.target.value;
    setSelectedValue(value);
    if (selectedCell) {
      console.log(
        "Stored deviceModelName:",
        selectedCell.prop("custom/deviceModelName")
      );
      const cellId = getCellId(selectedCell);
      const data = cellDeviceData.current.get(cellId);
      // if (selectedCell && selectedCell.get("type") === ) {
      //   // Set the selected value type
      //   selectedCell.setSelectedValue(newValue);

      //   // Update the device data if payload exists
      //   if (payload && Object.keys(payload).length > 0) {
      //     selectedCell.updateDeviceData(payload);
      //   }

      //   // If the selected value is 'temperature' and exists in payload,
      //   // also update the temperature property directly
      //   if (newValue === "temperature" && payload[newValue] !== undefined) {
      //     selectedCell.set("temperature", payload[newValue]);
      //   }
      // }
      if (data) {
        //updateCellDisplay(selectedCell, data);
      }
    }
  };

  const addElementToState = (element) => {
    if (elements[element.id]) {
      return;
    }

    const currentTemperature = element.get("temperature") || 0;
    const defaultAttributes = {
      isRunning: false,
      power: 0,
      waterLevel: 0.0,
      agitatorSpeed: 0.0,
      magnet_status: "close",
      temperature: currentTemperature,
    };

    if (element instanceof HeatPump) {
      defaultAttributes.power = 0;
    } else if (element instanceof VatWithAgitator) {
      defaultAttributes.temperature = 0.0;
      defaultAttributes.waterLevel = 0.0;
      defaultAttributes.agitatorSpeed = 0.0;
    } else if (element instanceof MotorPump) {
      defaultAttributes.magnet_status = "close";
    } else if (element instanceof CoolingPlate) {
      defaultAttributes.temperature = 0.0;
    } else if (element instanceof PlantChiller) {
      defaultAttributes.temperature = 0.0;
    } else if (element instanceof HeatPump) {
      defaultAttributes.temperature = 0.0;
    }

    setElements((prev) => ({
      ...prev,
      [element.id]: {
        ...defaultAttributes,
        element,
        type: element.constructor.name,
      },
    }));
  };

  const updateElementAttributes = (id, attributes) => {
    console.log(
      `Water Level: ${attributes.waterLevel}, Agitator Speed: ${attributes.agitatorSpeed}`
    );
    console.log(
      "[React] updateElementAttributes called for id:",
      id,
      "with attributes:",
      attributes
    );

    setElements((prev) => {
      console.log("[React] Previous state:", prev);
      const updated = { ...prev };

      if (updated[id]) {
        console.log("[React] Found element to update:", updated[id]);
        updated[id] = { ...updated[id], ...attributes };
        console.log("[React] Updated element:", updated[id]);

        const element = updated[id].element;
        const elementType = updated[id].type;
        console.log("[React] JointJS element:", element);

        if (attributes.power !== undefined) {
          console.log("[React] Updating power to:", attributes.power);
          element.set("power", attributes.power);
          element.attr(
            "rotator/fill",
            attributes.power ? "#52C54C" : "#C9C9C9"
          );
        }

        if (attributes.isRunning !== undefined) {
          console.log("[React] Updating isRunning to:", attributes.isRunning);
          element.attr("isRunning", attributes.isRunning);
          element.attr(
            "rotator/fill",
            attributes.isRunning ? "#52C54C" : "#C9C9C9"
          );
        }

        if (
          elementType === "CoolingPlate" &&
          attributes.temperature !== undefined &&
          element
        ) {
          console.log(
            "Setting temperature on CoolingPlate:",
            attributes.temperature
          );
          element.set("temperature", attributes.temperature);
        }

        if (
          elementType === "PlantChiller" &&
          attributes.temperature !== undefined &&
          element
        ) {
          console.log(
            "Setting temperature on PlantChiller:",
            attributes.temperature
          );
          element.set("temperature", attributes.temperature);
        }

        if (
          elementType === "HeatPump" &&
          attributes.temperature !== undefined &&
          element
        ) {
          console.log(
            "Setting temperature on HeatPump:",
            attributes.temperature
          );
          element.set("temperature", attributes.temperature);
        }

        if (
          elementType === "VatWithAgitator" &&
          attributes.temperature !== undefined &&
          element
        ) {
          console.log(
            "Setting temperature on VatWithAgitator:",
            attributes.temperature
          );
          element.set("temperature", attributes.temperature);
        }

        if (attributes.waterLevel !== undefined) {
          console.log("[React] Updating waterLevel:", attributes.waterLevel);
          element.set("waterLevel", attributes.waterLevel);

          // Trigger visual update
          element.prop("updateWaterLevel");

          // Alternatively update attributes directly:
          element.attr({
            "waterLevelFill/height": 100 * attributes.waterLevel,
            "waterLevelFill/y": 216 + (509 - 100 * attributes.waterLevel),
            "waterLevelFill/fill": `rgba(100, 150, ${Math.floor(
              100 + 155 * attributes.waterLevel
            )}, ${0.4 + 0.4 * attributes.waterLevel})`,
            "waterLevelDisplayText/text": `Water Level: ${Math.round(
              attributes.waterLevel * 100
            )}%`,
          });
        }

        if (attributes.waterLevel || attributes.agitatorSpeed !== undefined) {
          console.log(
            "[React] Updating power to agitatorSpeed:",
            attributes.agitatorSpeed
          );
          element.set("agitatorSpeed", attributes.agitatorSpeed);

          element.attr(
            "rudderFan/fill",
            attributes.agitatorSpeed > 0
              ? {
                  type: "linearGradient",
                  stops: [
                    { offset: "0%", color: "#078C00" },
                    { offset: "100%", color: "#C7FFC4" },
                  ],
                }
              : {
                  type: "linearGradient",
                  stops: [
                    { offset: "0%", color: "#737373" },
                    { offset: "100%", color: "#D9D9D9" },
                  ],
                  attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
                }
          );
        }

        if (attributes.magnet_status !== undefined) {
          console.log(
            "[React] Updating magnet_status to:",
            attributes.magnet_status
          );
          element.set("magnet_status", attributes.magnet_status);

          const isOpen = attributes.magnet_status === "open";
          console.log("[React] Updating magnet_status isOpen:", isOpen);

          if (isOpen) {
            // Define only OPEN color scheme
            const openColors = {
              mainBody: {
                type: "linearGradient",
                stops: [
                  { offset: "0%", color: "#078C00" },
                  { offset: "100%", color: "#C7FFC4" },
                ],
              },
              panel: {
                type: "linearGradient",
                stops: [
                  { offset: "15.3846%", color: "#C7FFC4" },
                  { offset: "100%", color: "#078C00" },
                ],
                attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
              },
            };

            // Apply only when OPEN
            element.attr("mainBody/fill", openColors.mainBody);

            for (let i = 1; i <= 10; i++) {
              element.attr(`controlPanel${i}/fill`, openColors.panel);
            }

            element.attr("topComponent/fill", openColors.panel);
            element.attr("rightComponent/fill", openColors.panel);
            element.attr("leftFoot/fill", openColors.panel);
            element.attr("rightFoot/fill", openColors.panel);
          }
        }
      }

      return updated;
    });
  };

  const elementData = elements[selectedElement];

  console.log("elementData in production:", selectedElement);

  const handlePowerChange = (id, newValue) => {
    console.log(
      "[React] handlePowerChange called for id:",
      id,
      "New value:",
      newValue
    );
    const isRunning = newValue > 0;
    updateElementAttributes(id, {
      power: newValue,
      isRunning: isRunning,
    });
  };

  const toggleRunning = (id) => {
    const defaults = {};
    const type = elements[id].type;
    console.log("[React] toggleRunning called for id:", id);
    console.log("[React] elements[id].type:", type);
    const current = elements[id]?.isRunning || false;
    const newPower = current ? 0 : 1;
    console.log("[React] Current isRunning:", current, "New power:", newPower);

    updateElementAttributes(id, {
      isRunning: !current,
      power: newPower,
    });

    if (type === "VatWithAgitator") {
      updateElementAttributes(id, {
        power: newPower,
        temperature: 0,
      });
    }
    if (type === "CoolingPlate") {
      updateElementAttributes(id, {
        power: newPower,
        temperature: 0,
      });
    }
    if (type === "PlantChiller") {
      updateElementAttributes(id, {
        power: newPower,
        temperature: 0,
      });
    }
    if (type === "HeatPump") {
      updateElementAttributes(id, {
        power: newPower,
        temperature: 0,
      });
    }
    if (type === "IceBank") {
      updateElementAttributes(id, {
        power: newPower,
      });
    }
  };

  const turnOn = (id) => {
    console.log("[React] turnOn called for id:", id);
    updateElementAttributes(id, {
      isRunning: true,
      power: 1,
    });
  };

  const turnOff = (id) => {
    console.log("[React] turnOff called for id:", id);
    updateElementAttributes(id, {
      isRunning: false,
      power: 0,
    });
  };

  const resetElement = (id) => {
    if (elements[id]) {
      const type = elements[id].type;
      const defaults = {};

      if (type === "HeatPump") {
        defaults.power = 1;
        defaults.isRunning = false;
      } else if (type === "VatWithAgitator") {
        defaults.waterLevel = 0.5;
        defaults.agitatorSpeed = 0.5;
        defaults.isRunning = false;
      }

      updateElementAttributes(id, defaults);
    }
  };

  const renderControlPanel = () => {
    const elementData = elements[selectedElement];

    return (
      <Stack spacing={2}>
        {/* Heat Pump Control Panel */}

        {/* Vat With Agitator Control Panel */}
        {elementData.type === "VatWithAgitator" && (
          <Card elevation={3}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Settings color="primary" />
                <Typography variant="h6">Vat With Agitator Controls</Typography>
              </Stack>

              <Stack spacing={3}>
                {/* Status */}
                {/* <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={elementData.isRunning}
                        onChange={() => toggleRunning(selectedElement)}
                        color="primary"
                      />
                    }
                    label={
                      elementData.isRunning
                        ? "Agitator Running"
                        : "Agitator Stopped"
                    }
                  />
                </Box> */}

                {/* Water Level */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Opacity color="primary" />
                    <Typography variant="subtitle2">
                      Water Level: {Math.round(elementData.waterLevel * 100)}%
                    </Typography>
                  </Stack>
                  <Slider
                    value={elementData.waterLevel}
                    onChange={(e, newValue) =>
                      updateElementAttributes(selectedElement, {
                        waterLevel: newValue,
                      })
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                  />
                </Box>

                {/* Agitator Speed */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Speed color="secondary" />
                    <Typography variant="subtitle2">
                      Agitator Speed:{" "}
                      {Math.round(elementData.agitatorSpeed * 100)}%
                    </Typography>
                  </Stack>
                  <Slider
                    value={elementData.agitatorSpeed}
                    onChange={(e, newValue) =>
                      updateElementAttributes(selectedElement, {
                        ...elementData,
                        agitatorSpeed: newValue,
                      })
                    }
                    min={0}
                    max={1}
                    step={0.1}
                    marks
                    valueLabelDisplay="auto"
                    color="secondary"
                  />
                </Box>

                {/* Control Buttons */}
                <Stack direction="row" spacing={2}>
                  {/* <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => resetElement(selectedElement)}
                    fullWidth
                  >
                    Reset to Defaults
                  </Button> */}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    );
  };

  const handleHeightChange = (event) => {
    const height = parseFloat(event.target.value);
    setHeightScale(height);
    if (selectedCell) {
      selectedCell.scaleHeight(height);
    }
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(0.95); }
         
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.7; transform: scale(0.95); }
        }
        
        @keyframes rotate {
    from { transform: rotate(0deg) }
    to { transform: rotate(360deg)}
  }

  @keyframes rotate3d {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(360deg); }
  }
  
[data-animated="true"].rotate {
  animation: spin 2s linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}

[data-animated="true"].rotate3d {
  animation: rotate3d 2s linear infinite;
  transform-origin: center;
  transform-style: preserve-3d;
  perspective: 1000px;
}
             @keyframes tankVolumeUp {
          0% { filter: brightness(1) drop-shadow(0 0 0 #00bcd4); }
          50% { filter: brightness(1.2) drop-shadow(0 0 10px #00bcd4); }
          100% { filter: brightness(1) drop-shadow(0 0 0 #00bcd4); }
        }
        [data-animated="true"].tank-volume-up {
          animation: tankVolumeUp 2s infinite;
        }   
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        [data-animated="true"] {
          animation: pulse 2s infinite;
        }
        
        [data-animated="true"].rotate {
          animation: rotate 4s linear infinite;
        }
        
        [data-animated="true"].rotate3d {
          animation: rotate3d 4s linear infinite;
            transform-origin: center;
  transform-box: fill-box;
        }
        
        [data-animated="true"].bounce {
          animation: bounce 1s ease infinite;
        }
        
        @keyframes height-scale {
          0% { transform: scaleY(var(--scale-height, 0.2)); }
          50% { transform: scaleY(var(--scale-height, 0.2)); }
          100% { transform: scaleY(var(--scale-height, 0.2)); }
        }
        
        [data-animated="true"].height-scale {
          animation: height-scale 2s ease-in-out infinite;
          transform-origin: bottom;
          transform-box: fill-box;
        }
        
        .animation-controls {
          margin-top: 16px;
          padding: 16px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        
        .animation-speed-slider {
          width: 100%;
          margin-top: 8px;
        }
      `}</style>

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
            <IconButton
              color="inherit"
              onClick={() => navigate("/dashboard")}
              sx={{ mr: 2 }}
            >
              <ArrowLeft size={20} />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Dashboard Editor
              {loadingExistingDashboard && (
                <Box
                  component="span"
                  sx={{
                    ml: 2,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} />
                  Loading...
                </Box>
              )}
              {loadError && (
                <Box
                  component="span"
                  sx={{ ml: 2, color: "error.main", fontSize: "0.875rem" }}
                >
                  {loadError}
                </Box>
              )}
            </Typography>

            <IconButton
              color="inherit"
              onClick={() => setSaveDialogOpen(true)}
              sx={{ mr: 2 }}
            >
              <Save size={20} />
            </IconButton>

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
              // overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              // flex: 1,
              overflow: "auto",
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

                <FormControl
                  fullWidth
                  variant="outlined"
                  disabled={!selectedEUI}
                >
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
                  <FormControl component="fieldset" fullWidth>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2">
                        Display Value:
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          onClick={() => setSelectedValue(availableValues)}
                          disabled={
                            selectedValue.length === availableValues.length
                          }
                        >
                          Select All
                        </Button>
                        <Button
                          size="small"
                          onClick={() => setSelectedValue([])}
                          disabled={selectedValue.length === 0}
                        >
                          Clear
                        </Button>
                      </Box>
                    </Box>
                    <Select
                      multiple
                      value={selectedValue}
                      onChange={handleValueChange}
                      size="small"
                      displayEmpty
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              Select values...
                            </Typography>
                          ) : (
                            selected.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                size="small"
                                onDelete={() => {
                                  const newValue = selectedValue.filter(
                                    (v) => v !== value
                                  );
                                  setSelectedValue(newValue);
                                }}
                                onMouseDown={(event) => {
                                  event.stopPropagation();
                                }}
                              />
                            ))
                          )}
                        </Box>
                      )}
                    >
                      {availableValues.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {/* <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                  <InputLabel>Animation Type</InputLabel>
                  <Select
                    value={animationType}
                    onChange={handleAnimationTypeChange}
                    label="Animation Type"
                  >
                    <MenuItem value="pulse">Pulse</MenuItem>
                    <MenuItem value="rotate">Rotate</MenuItem>
                    <MenuItem value="rotate3d">Rotate 3D</MenuItem>
                    <MenuItem value="bounce">Bounce</MenuItem>
                    <MenuItem value="flow">Flow</MenuItem>
                    <MenuItem value="tank-volume-up">Tank Volume Up</MenuItem>
                    <MenuItem value="height-scale">Height Scale</MenuItem>
                  </Select>
                </FormControl>

                {animationType === "height-scale" && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">Height Scale (%)</Typography>
                    <Slider
                      value={heightScale}
                      onChange={handleHeightChange}
                      min={0}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )} */}

                {/* {selectedDevice && Object.keys(payload).length > 0 && (
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
                )} */}
                {selectedElementType === "HeatPump" && (
                  <Card elevation={3}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <Settings color="primary" />
                        <Typography variant="h6">Heat Pump Controls</Typography>
                      </Stack>

                      <Stack spacing={3}>
                        {/* Power Status */}
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Power Status
                          </Typography>
                          <Chip
                            label={
                              elementData.isRunning ? "Running" : "Stopped"
                            }
                            color={
                              elementData.isRunning ? "success" : "default"
                            }
                            icon={
                              elementData.isRunning ? <PlayArrow /> : <Stop />
                            }
                            sx={{ width: "100%", justifyContent: "flex-start" }}
                          />
                        </Box>

                        {/* Power Level Slider */}
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Power Level: {Math.round(elementData.power * 100)}%
                          </Typography>
                          <Slider
                            value={elementData.power}
                            onChange={(e, newValue) =>
                              handlePowerChange(selectedElement, newValue)
                            }
                            min={0}
                            max={1}
                            step={0.1}
                            marks
                            valueLabelDisplay="auto"
                            color="secondary"
                          />
                        </Box>

                        {/* Control Buttons */}
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color={elementData.isRunning ? "error" : "success"}
                            startIcon={
                              elementData.isRunning ? <Stop /> : <PlayArrow />
                            }
                            onClick={() => toggleRunning(selectedElement)}
                            fullWidth
                          >
                            {elementData.isRunning ? "Stop" : "Start"}
                          </Button>

                          {/* <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={() => resetElement(selectedElement)}
                            fullWidth
                          >
                            Reset
                          </Button> */}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {selectedElementType === "CoolingPlate" && (
                  <Card elevation={3}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <Settings color="primary" />
                        <Typography variant="h6">
                          Cooling Plate Controls
                        </Typography>
                      </Stack>
                      <div className="text-xs mt-2">
                        Status: {elementData.power ? "ON" : "OFF"}
                      </div>

                      <Stack spacing={3}>
                        {/* Status */}
                        <Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={elementData.power}
                                onChange={() => {
                                  // Toggle between on/off states
                                  if (elementData.power) {
                                    toggleRunning(selectedElement);
                                  } else {
                                    toggleRunning(selectedElement);
                                  }
                                }}
                                color="primary"
                              />
                            }
                            label={elementData.power ? "Power ON" : "Power OFF"}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {selectedElementType === "PlantChiller" && (
                  <Card elevation={3}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <Settings color="primary" />
                        <Typography variant="h6">
                          Plant Chiller Controls
                        </Typography>
                      </Stack>
                      <div className="text-xs mt-2">
                        Status: {elementData.power ? "ON" : "OFF"}
                      </div>

                      <Stack spacing={3}>
                        {/* Status */}
                        <Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={elementData.power}
                                onChange={() => {
                                  // Toggle between on/off states
                                  if (elementData.power) {
                                    toggleRunning(selectedElement);
                                  } else {
                                    toggleRunning(selectedElement);
                                  }
                                }}
                                color="primary"
                              />
                            }
                            label={elementData.power ? "Power ON" : "Power OFF"}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {selectedElementType === "IceBank" && (
                  <Card elevation={3}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <Settings color="primary" />
                        <Typography variant="h6">Ice Bank Controls</Typography>
                      </Stack>
                      <div className="text-xs mt-2">
                        Status: {elementData.power ? "ON" : "OFF"}
                      </div>

                      <Stack spacing={3}>
                        {/* Status */}
                        <Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={elementData.power}
                                onChange={() => {
                                  // Toggle between on/off states
                                  if (elementData.power) {
                                    toggleRunning(selectedElement);
                                  } else {
                                    toggleRunning(selectedElement);
                                  }
                                }}
                                color="primary"
                              />
                            }
                            label={elementData.power ? "Power ON" : "Power OFF"}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {selectedElementType === "VatWithAgitator" && (
                  <Card elevation={3}>
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mb={2}
                      >
                        <Settings color="primary" />
                        <Typography variant="h6">
                          Vat With Agitator Controls
                        </Typography>
                      </Stack>

                      <Stack spacing={3}>
                        {/* Status */}
                        <Box>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={elementData.isRunning}
                                onChange={() => toggleRunning(selectedElement)}
                                color="primary"
                              />
                            }
                            label={
                              elementData.isRunning
                                ? "Agitator Running"
                                : "Agitator Stopped"
                            }
                          />
                        </Box>

                        {/* Water Level */}
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Opacity color="primary" />
                            <Typography variant="subtitle2">
                              Water Level:{" "}
                              {Math.round(elementData.waterLevel * 100)}%
                            </Typography>
                          </Stack>
                          <Slider
                            value={elementData.waterLevel}
                            onChange={(e, newValue) =>
                              updateElementAttributes(selectedElement, {
                                ...elementData,
                                waterLevel: newValue,
                              })
                            }
                            min={0}
                            max={1}
                            step={0.1}
                            marks
                            valueLabelDisplay="auto"
                          />
                        </Box>

                        {/* Agitator Speed */}
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Speed color="secondary" />
                            <Typography variant="subtitle2">
                              Agitator Speed:{" "}
                              {Math.round(elementData.agitatorSpeed * 100)}%
                            </Typography>
                          </Stack>
                          <Slider
                            value={elementData.agitatorSpeed}
                            onChange={(e, newValue) =>
                              updateElementAttributes(selectedElement, {
                                ...elementData,
                                agitatorSpeed: newValue,
                              })
                            }
                            min={0}
                            max={1}
                            step={0.1}
                            marks
                            valueLabelDisplay="auto"
                            color="secondary"
                          />
                        </Box>

                        {/* Control Buttons */}
                        <Stack direction="row" spacing={2}>
                          {/* <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={() => resetElement(selectedElement)}
                            fullWidth
                          >
                            Reset to Defaults
                          </Button> */}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* <Box className="animation-controls">
                  <Typography variant="subtitle2">
                    Animation Controls
                  </Typography>

                  <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                    <InputLabel>Animation Type</InputLabel>
                    <Select
                      value={animationType}
                      onChange={handleAnimationTypeChange}
                      label="Animation Type"
                    >
                      <MenuItem value="pulse">Pulse</MenuItem>
                      <MenuItem value="rotate">Rotate</MenuItem>
                      <MenuItem value="rotate3d">Rotate 3D</MenuItem>
                      <MenuItem value="bounce">Bounce</MenuItem>
                      <MenuItem value="flow">Flow</MenuItem>
                    </Select>
                  </FormControl>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Animation Speed
                  </Typography>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={animationSpeed}
                    onChange={handleAnimationSpeedChange}
                    className="animation-speed-slider"
                  />
                  <Typography
                    variant="caption"
                    display="block"
                    textAlign="center"
                  >
                    {animationSpeed.toFixed(1)}x
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      // onClick={handleStartAnimation}
                      fullWidth
                      size="small"
                    >
                      Start
                    </Button>
                    <Button
                      variant="outlined"
                      // onClick={handleStopAnimation}
                      fullWidth
                      size="small"
                    >
                      Stop
                    </Button>
                  </Box>
                </Box> */}

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

      <SaveDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        existingDashboard={existingDashboard}
        onSave={(formData) => {
          setCurrentFileName(formData.fileName);

          // If this is the final save with Firestore ID, navigate back to dashboard
          if (formData.firestoreId) {
            console.log("Dashboard saved successfully to Firestore:", formData);
            // Navigate back to dashboard with success data
            navigate("/dashboard", {
              state: {
                savedDashboard: formData,
                showSuccess: true,
                isUpdate: existingDashboard ? true : false,
              },
            });
            return null; // No need to return data for final save
          }

          // Get the current dashboard data from the paper for initial save
          if (paperRef.current) {
            const str = paperRef.current.model.toJSON();
            const dashboardData = {
              graph: str,
              metadata: formData,
              timestamp: new Date().toISOString(),
              version: existingDashboard
                ? (
                    parseFloat(existingDashboard.version || "1.0") + 0.1
                  ).toFixed(1)
                : "1.0",
              isUpdate: existingDashboard ? true : false,
              originalId: existingDashboard?.id || null,
            };

            console.log("Saving dashboard with data:", formData);
            console.log("Dashboard content:", dashboardData);
            console.log("Paper model JSON:", str);
            console.log("Is update:", existingDashboard ? true : false);

            // Return the dashboard data for upload
            return dashboardData;
          }

          return null;
        }}
        currentFileName={currentFileName}
        userId={user?.uid || user?.email || ""}
      />
    </>
  );
};

export default DashboardEditor;
