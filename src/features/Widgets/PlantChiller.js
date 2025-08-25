import * as joint from "@joint/plus";

class PlantChiller extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "PlantChiller",
      size: { width: 771, height: 646 },
      power: 0, // Add power property
      temperature: 0, // Add temperature property
      selectedValue: "", // Add this to store the selected value type
      deviceData: {}, // Add this to store the actual device data
      attrs: {
        root: {
          magnetSelector: "body",
        },
        body: {
          // refWidth: "100%",
          // refHeight: "100%",
          // fill: "none",
        },
      },
      ports: {
        groups: {
          in: {
            position: {
              name: "right",
              // args: { x: 712, y: 167.928 },
            },
            markup: joint.util.svg`
              <g @selector="portRoot">
                <rect @selector="pipeBody" />
                <rect @selector="pipeEnd" />
                <rect @selector="pipeEndStroke" />
              </g>
            `,
            size: { width: 37.7213, height: 61.982 },
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
                    { offset: "0.00480769", color: "#737373" },
                    { offset: "0.346154", color: "white" },
                    { offset: "0.682692", color: "white" },
                    { offset: "1", color: "#737373" },
                  ],
                  attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
                },
                magnet: "passive", // Input port: accepts incoming connections
              },
              pipeEnd: {
                width: 6.77049,
                height: 77.1171,
                x: 37.7213,
                y: -7.928,
                fill: "#808080",
                magnet: "active", // Can initiate outgoing links
              },
              pipeEndStroke: {
                width: 10.5082,
                height: 73.1171,
                x: 46.4918,
                y: -5.928,
                fill: "white",
                stroke: "#808080",
                strokeWidth: 4,
              },
            },
          },
          out: {
            position: {
              name: "right",
              // args: { x: 712, y: 347.928 },
            },
            markup: joint.util.svg`
              <g @selector="portRoot">
                <rect @selector="pipeBody" />
                <rect @selector="pipeEnd" />
                <rect @selector="pipeEndStroke" />
              </g>
            `,
            size: { width: 37.7213, height: 61.982 },
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
                    { offset: "0.00480769", color: "#737373" },
                    { offset: "0.346154", color: "white" },
                    { offset: "0.682692", color: "white" },
                    { offset: "1", color: "#737373" },
                  ],
                  attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
                },
                magnet: "active", // Output port: can initiate outgoing connections
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
                x: 46.4918,
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
      <rect @selector="upperBody"/>
      <rect @selector="lowerBody"/>
      <path @selector="rightUpperSide"/>
      <path @selector="rightLowerSide"/>
      <path @selector="leftUpperSide"/>
      <path @selector="leftLowerSide"/>
      <rect @selector="leftBar"/>
      <rect @selector="rightBar"/>
      <rect @selector="base"/>
      <g @selector="TempTextDisplayGroup">
        <rect @selector="controlPanel"/>
        <text @selector="controlPanelTempText"/>
      </g>
    `;
  }

  initialize() {
    joint.dia.Element.prototype.initialize.apply(this, arguments);
    this.updateAttrs();
    this.updateTemperatureDisplay(); // Add this line
    this.on("change:size", this.updateAttrs, this);
    this.on("change:power", this.updatePowerState, this); // Add power state listener
    this.on(
      "change:selectedValue change:deviceData change:temperature",
      this.updateTemperatureDisplay,
      this
    ); // Add temperature listener
  }

  updateAttrs() {
    const size = this.get("size");
    const width = size.width;
    const height = size.height;

    // Calculate scale factors based on original size (771x646)
    const scaleX = width / 771;
    const scaleY = height / 646;
    const minScale = Math.min(scaleX, scaleY);

    // Update attributes with scaling
    this.attr({
      upperBody: {
        x: 48 * scaleX,
        y: 124 * scaleY,
        width: 617 * scaleX,
        height: 150 * scaleY,
        rx: 8 * minScale,
        ry: 8 * minScale,
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
        strokeWidth: 4 * minScale,
      },
      lowerBody: {
        x: 48 * scaleX,
        y: 292 * scaleY,
        width: 617 * scaleX,
        height: 249 * scaleY,
        rx: 8 * minScale,
        ry: 8 * minScale,
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
        strokeWidth: 4 * minScale,
      },
      rightUpperSide: {
        d: this.scalePath(
          "M711 142.646L675 133V268.646L711 254.5V142.646Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "25.9615%", color: "#D9D9D9" },
            { offset: "50.9615%", color: "white" },
            { offset: "74.0385%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      rightLowerSide: {
        d: this.scalePath(
          "M711 319.285L675 303V532L711 508.118V319.285Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "25.9615%", color: "#D9D9D9" },
            { offset: "50.9615%", color: "white" },
            { offset: "74.0385%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      leftUpperSide: {
        d: this.scalePath(
          "M2 142.646L38 133V268.646L2 254.5V142.646Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "25.9615%", color: "#D9D9D9" },
            { offset: "50.9615%", color: "white" },
            { offset: "74.0385%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      leftLowerSide: {
        d: this.scalePath(
          "M2 319.285L38 303V532L2 508.118V319.285Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "25.9615%", color: "#D9D9D9" },
            { offset: "50.9615%", color: "white" },
            { offset: "74.0385%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      leftBar: {
        x: 48 * scaleX,
        y: 91 * scaleY,
        width: 33 * scaleX,
        height: 519 * scaleY,
        rx: 8 * minScale,
        ry: 8 * minScale,
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
        strokeWidth: 4 * minScale,
      },
      rightBar: {
        x: 632 * scaleX,
        y: 91 * scaleY,
        width: 33 * scaleX,
        height: 519 * scaleY,
        rx: 8 * minScale,
        ry: 8 * minScale,
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
        strokeWidth: 4 * minScale,
      },
      base: {
        x: 2 * scaleX,
        y: 604 * scaleY,
        width: 769 * scaleX,
        height: 42 * scaleY,
        rx: 5 * minScale,
        ry: 5 * minScale,
        fill: "#767676",
      },
      controlPanel: {
        x: 195 * scaleX,
        y: 21 * scaleY,
        width: 323 * scaleX,
        height: 179 * scaleY,
        rx: 8 * minScale,
        ry: 8 * minScale,
        fill: "white",
        stroke: "#737373",
        strokeWidth: 15 * minScale,
        filter: {
          name: "dropShadow",
          args: {
            dx: 0,
            dy: 4 * minScale,
            blur: 12.5 * minScale,
            color: "rgba(0,0,0,0.25)",
          },
        },
      },
    });

    // Update input port position
    this.prop("ports/items/0/args", {
      x: 712 * scaleX,
      y: 167.928 * scaleY,
    });

    // Update first output port position
    this.prop("ports/items/1/args", {
      x: 712 * scaleX,
      y: 347.928 * scaleY,
    });

    // Update second output port position
    this.prop("ports/items/2/args", {
      x: 712 * scaleX,
      y: 440.928 * scaleY,
    });

    const portScale = minScale;

    // Update input port size
    this.prop("ports/groups/in/size", {
      width: 37.7213 * portScale,
      height: 61.982 * portScale,
    });

    // Update output port size
    this.prop("ports/groups/out/size", {
      width: 37.7213 * portScale,
      height: 61.982 * portScale,
    });

    // Update port attributes (scaled pipe graphics)
    ["in", "out"].forEach((portGroup) => {
      this.prop(`ports/groups/${portGroup}/attrs/pipeBody`, {
        width: 37.7213 * portScale,
        height: 61.982 * portScale,
      });
      this.prop(`ports/groups/${portGroup}/attrs/pipeEnd`, {
        width: 6.77049 * portScale,
        height: 77.1171 * portScale,
        x: 37.7213 * portScale,
        y: -7.928 * portScale,
      });
      this.prop(`ports/groups/${portGroup}/attrs/pipeEndStroke`, {
        width: 10.5082 * portScale,
        height: 73.1171 * portScale,
        x: 46.4918 * portScale,
        y: -5.928 * portScale,
        strokeWidth: 4 * portScale,
      });
    });

    // Update power state after scaling
    this.updatePowerState();

    // Update temperature display after scaling
    this.updateTemperatureDisplay();
  }

  // NEW METHOD: Update temperature display
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
      x: 90 * scaleX + (323 * scaleX) / 2,
      y: 21 * scaleY + (179 * scaleY) / 2,
      text: displayText,
      fontSize: 70 * minScale,
      fontFamily: "Arial",
      fill: "#333",
      fontWeight: "bold",
      originX: "center",
      originY: "center",
    });
  }

  // NEW METHOD: Update power state colors
  updatePowerState() {
    const power = this.get("power") || 0;
    const color = power ? "#313BFF" : "#737373"; // Blue when on, gray when off

    // Update main body colors based on power state
    this.attr({
      upperBody: {
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: power ? "#313BFF" : "#808080" },
            { offset: "28.8462%", color: power ? "#6A71FF" : "#E2E2E2" },
            { offset: "51.9231%", color: power ? "#A3A7FF" : "white" },
            { offset: "72.5962%", color: power ? "#6A71FF" : "#E2E2E2" },
            { offset: "100%", color: power ? "#313BFF" : "#808080" },
          ],
          attrs: { x1: "100%", y1: "50%", x2: "0%", y2: "50%" },
        },
      },
      lowerBody: {
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: power ? "#313BFF" : "#808080" },
            { offset: "28.8462%", color: power ? "#6A71FF" : "#E2E2E2" },
            { offset: "51.9231%", color: power ? "#A3A7FF" : "white" },
            { offset: "72.5962%", color: power ? "#6A71FF" : "#E2E2E2" },
            { offset: "100%", color: power ? "#313BFF" : "#808080" },
          ],
          attrs: { x1: "100%", y1: "50%", x2: "0%", y2: "50%" },
        },
      },
      rightUpperSide: {
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: power ? "#313BFF" : "#737373" },
            { offset: "25.9615%", color: power ? "#6A71FF" : "#D9D9D9" },
            { offset: "50.9615%", color: power ? "#A3A7FF" : "white" },
            { offset: "74.0385%", color: power ? "#6A71FF" : "#D9D9D9" },
            { offset: "100%", color: power ? "#313BFF" : "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
      },
      rightLowerSide: {
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: power ? "#313BFF" : "#737373" },
            { offset: "25.9615%", color: power ? "#6A71FF" : "#D9D9D9" },
            { offset: "50.9615%", color: power ? "#A3A7FF" : "white" },
            { offset: "74.0385%", color: power ? "#6A71FF" : "#D9D9D9" },
            { offset: "100%", color: power ? "#313BFF" : "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
      },
      leftUpperSide: {
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: power ? "#313BFF" : "#737373" },
            { offset: "25.9615%", color: power ? "#6A71FF" : "#D9D9D9" },
            { offset: "50.9615%", color: power ? "#A3A7FF" : "white" },
            { offset: "74.0385%", color: power ? "#6A71FF" : "#D9D9D9" },
            { offset: "100%", color: power ? "#313BFF" : "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
      },
      leftLowerSide: {
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: power ? "#313BFF" : "#737373" },
            { offset: "25.9615%", color: power ? "#6A71FF" : "#D9D9D9" },
            { offset: "50.9615%", color: power ? "#A3A7FF" : "white" },
            { offset: "74.0385%", color: power ? "#6A71FF" : "#D9D9D9" },
            { offset: "100%", color: power ? "#313BFF" : "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
      },
      leftBar: {
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: power ? "#313BFF" : "#808080" },
            { offset: "28.8462%", color: power ? "#6A71FF" : "#E2E2E2" },
            { offset: "51.9231%", color: power ? "#A3A7FF" : "white" },
            { offset: "72.5962%", color: power ? "#6A71FF" : "#E2E2E2" },
            { offset: "100%", color: power ? "#313BFF" : "#808080" },
          ],
          attrs: { x1: "100%", y1: "50%", x2: "0%", y2: "50%" },
        },
      },
      rightBar: {
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: power ? "#313BFF" : "#808080" },
            { offset: "28.8462%", color: power ? "#6A71FF" : "#E2E2E2" },
            { offset: "51.9231%", color: power ? "#A3A7FF" : "white" },
            { offset: "72.5962%", color: power ? "#6A71FF" : "#E2E2E2" },
            { offset: "100%", color: power ? "#313BFF" : "#808080" },
          ],
          attrs: { x1: "100%", y1: "50%", x2: "0%", y2: "50%" },
        },
      },
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
      if (key.power !== undefined) {
        this.updatePowerState();
      }
      if (
        key.selectedValue !== undefined ||
        key.deviceData !== undefined ||
        key.temperature !== undefined
      ) {
        this.updateTemperatureDisplay();
      }
    } else if (key === "power") {
      this.updatePowerState();
    } else if (
      key === "selectedValue" ||
      key === "deviceData" ||
      key === "temperature"
    ) {
      this.updateTemperatureDisplay();
    }

    return result;
  }
  togglePower() {
    const currentPower = this.get("power") || 0;
    this.set("power", currentPower ? 0 : 1);
    return this.get("power");
  }
}

export default PlantChiller;
