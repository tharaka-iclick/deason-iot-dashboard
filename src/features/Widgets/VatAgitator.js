import * as joint from "@joint/plus";

class VatWithAgitator extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "VatWithAgitator",
      size: { width: 617, height: 761 },
      waterLevel: 0,
      agitatorSpeed: 0,
      temperature: 0, // Add temperature property
      selectedValue: "", // Add this to store the selected value type
      deviceData: {}, // Add this to store the actual device data
      ports: {
        groups: {
          in: {
            // ConnectorOne (top left)
            position: {
              name: "absolute",
              args: { x: 1, y: 2 },
            },
            markup: joint.util.svg`
                            <g @selector="portRoot">
                                <rect @selector="pipeBody" />
                                <rect @selector="pipeEnd" />
                                <rect @selector="pipeEndStroke" />
                            </g>
                        `,
            size: { width: 59.5708, height: 33.2459 },
            attrs: {
              portRoot: {
                magnetSelector: "pipeEnd",
              },
              pipeBody: {
                transform: "rotate(-90 83.6196 52)",
                width: 33.2459,
                height: 59.5708,
                x: 83.6196,
                y: 52,
                fill: {
                  type: "linearGradient",
                  stops: [
                    { offset: "0%", color: "#737373" },
                    { offset: "35%", color: "white" },
                    { offset: "68%", color: "white" },
                    { offset: "100%", color: "#737373" },
                  ],
                  attrs: { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
                },
                magnet: "active",
              },
              pipeEnd: {
                transform: "rotate(-90 76 18.7541)",
                width: 5.96721,
                height: 74.1171,
                x: 76,
                y: 18.7541,
                fill: "#808080",
                magnet: "active",
              },
              pipeEndStroke: {
                transform: "rotate(-90 78 10.7869)",
                width: 8.78689,
                height: 70.1171,
                x: 78,
                y: 10.7869,
                fill: "white",
                stroke: "#808080",
                strokeWidth: 4,
                magnet: "active",
              },
            },
          },
          out: {
            // New output port (bottom right)
            position: {
              name: "absolute",
              args: { x: 610, y: 670 },
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
                    { offset: "0.360577", color: "white" },
                    { offset: "0.673077", color: "white" },
                    { offset: "1", color: "#737373" },
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
                magnet: "active",
              },
            },
          },
        },
        items: [
          { group: "in", id: "in-port" },
          { group: "out", id: "out-port" },
        ],
      },
      attrs: {
        root: {
          magnetSelector: "body",
        },
        connectorOneRect1: {
          transform: "rotate(-90 83.6196 52)",
          width: 33.2459,
          height: 59.5708,
          x: 83.6196,
          y: 52,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#737373" },
              { offset: "35%", color: "white" },
              { offset: "68%", color: "white" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
          },
        },
        connectorOneRect2: {
          transform: "rotate(-90 76 18.7541)",
          width: 5.96721,
          height: 74.1171,
          x: 76,
          y: 18.7541,
          fill: "#808080",
        },
        connectorOneRect3: {
          transform: "rotate(-90 78 10.7869)",
          width: 8.78689,
          height: 70.1171,
          x: 78,
          y: 10.7869,
          fill: "white",
          stroke: "#808080",
          strokeWidth: 4,
        },
        topLidPath1: {
          d: "M580.231 111.576C620.286 141.995 613.578 168.86 613.578 168.86H308.328H308.289L3.4223 169C3.4223 169 -3.28584 142.136 36.7692 111.716C117.084 50.7227 308.289 52.0028 308.289 52.0028C308.289 52.0028 499.916 50.5826 580.231 111.576Z",
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#737373" },
              { offset: "26%", color: "#D9D9D9" },
              { offset: "51%", color: "white" },
              { offset: "74%", color: "#D9D9D9" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: "0%", y1: "50%", x2: "100%", y2: "50%" },
          },
        },
        topLidPath2: {
          d: "M308.289 168.86H613.578C613.578 168.86 620.286 141.995 580.231 111.576C499.916 50.5826 308.289 52.0028 308.289 52.0028C308.289 52.0028 117.084 50.7227 36.7692 111.716C-3.28584 142.136 3.4223 169 3.4223 169L308.328 168.86",
          stroke: "#808080",
          strokeWidth: 4,
          fill: "none",
        },
        squareBody: {
          d: "M615 179H2V759H615V179Z",
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#737373" },
              { offset: "26%", color: "#D9D9D9" },
              { offset: "51%", color: "white" },
              { offset: "74%", color: "#D9D9D9" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: "0%", y1: "50%", x2: "100%", y2: "50%" },
          },
          stroke: "#737373",
          strokeWidth: 4,
        },
        waterDisplayGroup: {
          // position: "relative",
        },
        waterLevelFill: {
          x: 37,
          width: 168,
          rx: 13,
          refY: 1,
        },
        transDisplay: {
          x: 37,
          y: 216,
          width: 168,
          height: 509,
          rx: 13,
          fill: "white",
          stroke: "#737373",
          strokeWidth: 4,
        },
        bubble1: {
          cx: 60,
          cy: 700,
          r: 10,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble2: {
          cx: 100,
          cy: 700,
          r: 4,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble3: {
          cx: 140,
          cy: 700,
          r: 12,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble4: {
          cx: 170,
          cy: 700,
          r: 7,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble5: {
          cx: 60,
          cy: 700,
          r: 10,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble6: {
          cx: 100,
          cy: 700,
          r: 4,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble7: {
          cx: 140,
          cy: 700,
          r: 12,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble8: {
          cx: 170,
          cy: 700,
          r: 7,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble9: {
          cx: 140,
          cy: 700,
          r: 12,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        bubble10: {
          cx: 170,
          cy: 700,
          r: 7,
          fill: "rgba(255, 255, 255, 0.7)",
          stroke: "#E0FFFF",
          strokeWidth: 1,
        },
        rudderPole: {
          x: 113,
          y: 218,
          width: 18,
          height: 352,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#737373" },
              { offset: "51%", color: "#D9D9D9" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
          },
        },
        fanConnector: {
          x: 106,
          y: 570,
          width: 32,
          height: 29,
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#737373" },
              { offset: "51%", color: "#DDDDDD" },
              { offset: "100%", color: "#737373" },
            ],
            attrs: { x1: "0%", y1: "50%", x2: "100%", y2: "50%" },
          },
        },
        rudderFan: {
          d: "M64.3226 613.911L106.5 599H137.5L115.974 610.908C114.924 611.489 114.618 612.856 115.32 613.829L164.459 681.902C166.451 684.662 165.164 688.561 161.921 689.593L136.685 697.623C135.959 697.854 135.166 697.653 134.638 697.105L62.388 622.094C59.865 619.474 60.8937 615.123 64.3226 613.911Z",
          fill: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#737373" },
              { offset: "100%", color: "#D9D9D9" },
            ],
            attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
          },
          transformOrigin: "122 650",
        },
        agitatorDisplayRect1: {
          x: 275,
          y: 553,
          width: 286,
          height: 124,
          rx: 8,
          fill: "white",
        },
        agitatorDisplayRect2: {
          x: 276.5,
          y: 554.5,
          width: 283,
          height: 121,
          rx: 6.5,
          stroke: "#737373",
          strokeWidth: 3,
          fill: "none",
        },
        agitatorDisplayText: {
          x: 290,
          y: 600,
          text: "Agitator: 0%",
          fontSize: 16,
          fontFamily: "Arial",
          fill: "#333",
        },
        waterLevelRect1: {
          x: 275,
          y: 396,
          width: 286,
          height: 124,
          rx: 8,
          fill: "white",
        },
        waterLevelRect2: {
          x: 276.5,
          y: 397.5,
          width: 283,
          height: 121,
          rx: 6.5,
          stroke: "#737373",
          strokeWidth: 3,
          fill: "none",
        },
        waterLevelDisplayText: {
          x: 290,
          y: 440,
          text: "Water Level: 50%",
          fontSize: 16,
          fontFamily: "Arial",
          fill: "#333",
        },
        tempLevelRect1: {
          x: 275,
          y: 244,
          width: 286,
          height: 124,
          rx: 8,
          fill: "white",
        },
        tempLevelRect2: {
          x: 276.5,
          y: 245.5,
          width: 283,
          height: 121,
          rx: 6.5,
          stroke: "#737373",
          strokeWidth: 3,
          fill: "none",
        },
        tempLevelDisplayText: {
          x: 360,
          y: 340,
          text: "Temp: --°C",
          fontSize: 16,
          fontFamily: "Arial",
          fill: "#333",
        },
        tempLevelDisplayLable: {
          x: 290,
          y: 300,
          text: "Temp: --°C",
          fontSize: 16,
          fontFamily: "Arial",
          fill: "#333",
        },
        motorConnector: {
          d: "M73.399 89L73 53H156V66.6C124.804 71.9268 102.939 77.8648 73.399 89Z",
          fill: "#CECECE",
        },
      },
    };
  }

  preinitialize() {
    this.markup = joint.util.svg`
            <g @selector="scalingGroup">
                <!-- Your existing markup goes here -->
                <g @selector="connectorOne">
                    <rect @selector="connectorOneRect1"/>
                    <rect @selector="connectorOneRect2"/>
                    <rect @selector="connectorOneRect3"/>
                </g>
                <g @selector="vatBody">
                    <g @selector="topLid">
                        <path @selector="topLidPath1"/>
                        <path @selector="topLidPath2"/>
                    </g>
                    <path @selector="squareBody"/>
                    <g @selector="waterDisplayGroup">
                        <rect @selector="transDisplay"/>
                        <rect @selector="waterLevelFill"/>
                        <circle @selector="bubble1"/>
                        <circle @selector="bubble2"/>
                        <circle @selector="bubble3"/>  
                        <circle @selector="bubble4"/>
                        <circle @selector="bubble5"/>
                        <circle @selector="bubble6"/>
                        <circle @selector="bubble7"/>  
                        <circle @selector="bubble8"/> 
                        <circle @selector="bubble9"/>
                        <circle @selector="bubble10"/> 
                    </g>
                </g>
                <g @selector="rudder">
                    <rect @selector="rudderPole"/>
                    <g @selector="fanUnit">
                        <rect @selector="fanConnector"/>
                        <path @selector="rudderFan"/>
                    </g>
                </g>
                <g @selector="sideDisplays">
                    <g @selector="agitator">
                        <g @selector="agitatorDisplay">
                            <rect @selector="agitatorDisplayRect1"/>
                            <rect @selector="agitatorDisplayRect2"/>
                            <text @selector="agitatorDisplayText"/>
                        </g>
                    </g>
                    <g @selector="contentLevel">
                        <g @selector="waterLevel">
                            <rect @selector="waterLevelRect1"/>
                            <rect @selector="waterLevelRect2"/>
                            <text @selector="waterLevelDisplayText"/>
                        </g>
                    </g>
                    <g @selector="tempLevel">
                        <g @selector="waterLevel_2">
                            <rect @selector="tempLevelRect1"/>
                            <rect @selector="tempLevelRect2"/>
                            <text @selector="tempLevelDisplayLable"/>
                            <text @selector="tempLevelDisplayText"/>
                        </g>
                    </g>
                </g>
                <path @selector="motorConnector"/>
            </g>
        `;
  }

  initialize() {
    joint.dia.Element.prototype.initialize.apply(this, arguments);
    // Update scale when size changes
    this.on("change:size", this.updateScale);

    // Initialize scale
    this.updateScale();

    this.bubbleAnimations = [];

    this.on(
      "change:selectedValue change:deviceData change:temperature",
      this.updateTemperatureDisplay,
      this
    ); // Add temperature listener

    // Update water level when it changes
    // this.on("change:waterLevel", this.updateWaterLevel);
    // this.on("change:agitatorSpeed", this.updateAgitator);
    this.on("change:temperature", this.updateTemperatureDisplay, this); // Add temperature listener
  }

  updateScale() {
    const size = this.get("size");
    const originalWidth = 617;
    const originalHeight = 761;

    // Calculate scale factors
    const scaleX = size.width / originalWidth;
    const scaleY = size.height / originalHeight;

    // Apply scale to the group
    this.attr("scalingGroup", {
      transform: `scale(${scaleX},${scaleY})`,
    });

    this.scalePorts(scaleX, scaleY);

    // Update water level position (needs special handling)
    // this.updateWaterLevel();

    // Update temperature display after scaling
    this.updateTemperatureDisplay();
  }

  updateTemperatureDisplay() {
    const size = this.get("size");
    const scaleX = size.width / 617;
    const scaleY = size.height / 761;
    const minScale = Math.min(scaleX, scaleY);

    const selectedValue = this.get("selectedValue");
    const deviceData = this.get("deviceData") || {};
    const temperature = this.get("temperature") || 0;

    let displayValue;
    let displayText;
    let displayLabel;

    // Helper function to get the primary selected value
    const getPrimaryValue = (value) => {
      if (Array.isArray(value) && value.length > 0) {
        return value[0];
      }
      return value;
    };

    // Helper function to format label text
    const formatLabel = (value) => {
      if (!value || typeof value !== "string") {
        return "TEMPERATURE:";
      }
      return value.toUpperCase() + ":";
    };

    const primaryValue = getPrimaryValue(selectedValue);

    if (primaryValue && deviceData[primaryValue] !== undefined) {
      // If a specific value is selected and exists in device data, use it
      displayValue = deviceData[primaryValue];
      displayText = `${displayValue}`;
      displayLabel = formatLabel(primaryValue);
    } else if (primaryValue === "temperature" && temperature !== undefined) {
      // If temperature is specifically selected, use the temperature property
      displayValue = temperature;
      displayText = `${displayValue}°C`;
      displayLabel = "TEMPERATURE:";
    } else {
      // Default fallback
      displayValue = temperature;
      displayText = `${displayValue}`;
      displayLabel = "TEMPERATURE:";
    }

    // Format the display value
    if (typeof displayValue === "number") {
      const formattedValue = displayValue.toFixed(1);
      if (primaryValue === "temperature") {
        displayText = formattedValue + "°C";
      } else {
        displayText = formattedValue;
      }
    } else if (primaryValue === "temperature") {
      displayText = displayText + "°C";
    }

    this.attr("tempLevelDisplayLable", {
      text: displayLabel,
      fontSize: 65 * minScale,
      fontWeight: "bold",
      fontFamily: "Arial",
      fill: "#333",
    });

    this.attr("tempLevelDisplayText", {
      text: displayText,
      fontSize: 70 * minScale,
      fontWeight: "bold",
      fontFamily: "Arial",
      fill: "#333",
    });
  }

  scalePorts(scaleX, scaleY) {
    const portScale = Math.min(scaleX, scaleY);
    this.prop("ports/groups/in/size", {
      width: 59.5708 * portScale,
      height: 33.2459 * portScale,
    });
    this.prop("ports/groups/out/size", {
      width: 37.7213 * portScale,
      height: 61.982 * portScale,
    });
    const inPipeBodyX = 83.6196 * scaleX;
    const inPipeBodyY = 52 * scaleY;
    this.prop("ports/groups/in/attrs/pipeBody", {
      transform: `rotate(-90 ${83.6196 * scaleX} ${52 * scaleY})`,
      width: 33.2459 * portScale,
      height: 59.5708 * portScale,
      x: 83.6196 * scaleX,
      y: 52 * scaleY,
    });
    this.prop("ports/groups/in/attrs/pipeEnd", {
      transform: `rotate(-90 ${76 * scaleX} ${18.7541 * scaleY})`,
      width: 5.96721 * portScale,
      height: 74.1171 * portScale,
      x: 76 * scaleX,
      y: 18.7541 * scaleY,
    });
    this.prop("ports/groups/in/attrs/pipeEndStroke", {
      transform: `rotate(-90 ${78 * scaleX} ${10.7869 * scaleY})`,
      width: 8.78689 * portScale,
      height: 70.1171 * portScale,
      x: 78 * scaleX,
      y: 10.7869 * scaleY,
      strokeWidth: 4 * portScale,
    });
    this.prop("ports/groups/out/position/args", {
      x: 610 * scaleX,
      y: 670 * scaleY,
    });
    this.prop("ports/groups/out/attrs/pipeBody", {
      width: 37.7213 * scaleX,
      height: 61.982 * scaleY,
      x: scaleX,
      y: scaleY,
    });
    this.prop("ports/groups/out/attrs/pipeEnd", {
      width: 6.77049 * scaleX,
      height: 77.1171 * scaleY,
      x: 37.7213 * scaleX,
      y: -7.928 * scaleY,
    });
    this.prop("ports/groups/out/attrs/pipeEndStroke", {
      width: 10.5082 * scaleX,
      height: 73.1171 * scaleY,
      x: 46.49179 * scaleX,
      y: -5.928 * scaleY,
      strokeWidth: 4 * portScale,
    });
  }

  // Your existing getters/setters
  get waterLevel() {
    return this.get("waterLevel") || 0.5;
  }

  set waterLevel(value) {
    this.set("waterLevel", Math.max(0, Math.min(1, value)));
  }

  get agitatorSpeed() {
    return this.get("agitatorSpeed") || 0;
  }

  set agitatorSpeed(value) {
    this.set("agitatorSpeed", Math.max(0, Math.min(1, value)));
  }

  get temperature() {
    return this.get("temperature") || 0;
  }

  set temperature(value) {
    this.set("temperature", value);
  }

  setSelectedValue(value) {
    this.set("selectedValue", value);
  }

  // NEW METHOD: Update device data and refresh display
  updateDeviceData(data) {
    this.set("deviceData", data);
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

const VatWithAgitatorView = joint.dia.ElementView.extend({
  presentationAttributes: joint.dia.ElementView.addPresentationAttributes({
    waterLevel: ["WATER_LEVEL"],
    agitatorSpeed: ["AGITATOR_SPEED"],
    temperature: ["TEMPERATURE"], // Add temperature presentation attribute
  }),

  initFlag: [
    joint.dia.ElementView.Flags.RENDER,
    "WATER_LEVEL",
    "AGITATOR_SPEED",
    "TEMPERATURE", // Add temperature flag
  ],

  confirmUpdate(flag, opt) {
    console.log("confirmUpdate called with flags:", flag);
    let flags = joint.dia.ElementView.prototype.confirmUpdate.call(
      this,
      flag,
      opt
    );

    if (this.hasFlag(flags, "WATER_LEVEL")) {
      this.updateWaterLevel();
      flags = this.removeFlag(flags, "WATER_LEVEL");
    }

    if (this.hasFlag(flags, "AGITATOR_SPEED")) {
      this.updateAgitator();
      flags = this.removeFlag(flags, "AGITATOR_SPEED");
    }

    if (this.hasFlag(flags, "TEMPERATURE")) {
      // this.updateTemperature();
      flags = this.removeFlag(flags, "TEMPERATURE");
    }

    return flags;
  },

  initBubbleAnimations() {
    if (this.bubbleAnimationsInitialized) return;

    const bubbles = [];
    for (let i = 1; i <= 10; i++) {
      const bubble =
        this.findBySelector(`bubble${i}`)[0] ||
        this.el.querySelector(`[joint-selector="bubble${i}"]`) ||
        this.el.querySelector(`circle[selector="bubble${i}"]`);
      if (bubble) bubbles.push(bubble);
    }

    this.bubbleAnimations = bubbles.map((bubble, index) => {
      // Randomize bubble properties
      const size = 3 + Math.random() * 12;
      const startX = 40 + Math.random() * 140;
      const startY = 700 + Math.random() * 20;
      const duration = 2000 + Math.random() * 3000;
      const delay = Math.random() * 2000;
      const driftAmount = 10 + Math.random() * 30;

      // Set initial bubble properties
      bubble.setAttribute("r", size);
      bubble.setAttribute("cx", startX);
      bubble.setAttribute("cy", startY);

      // Create animation
      const keyframes = [
        {
          transform: `translate(0, 0)`,
          opacity: 0.3 + Math.random() * 0.5,
        },
        {
          transform: `translate(${
            index % 2 === 0 ? driftAmount : -driftAmount
          }px, -500px)`,
          opacity: 0,
        },
      ];

      return bubble.animate(keyframes, {
        duration: duration,
        delay: delay,
        fill: "forwards",
        iterations: Infinity,
      });
    });

    this.bubbleAnimationsInitialized = true;
  },

  updateBubbleAnimations(speed) {
    if (!this.bubbleAnimationsInitialized) this.initBubbleAnimations();

    this.bubbleAnimations.forEach((animation) => {
      if (speed > 0) {
        animation.playbackRate = speed * 3;
        animation.play();
      } else {
        animation.pause();
      }
    });
  },

  getFanAnimation() {
    if (this.fanAnimation) return this.fanAnimation;

    const fanEl =
      this.findBySelector("rudderFan")[0] ||
      this.el.querySelector('[joint-selector="rudderFan"]') ||
      this.el.querySelector('path[selector="rudderFan"]');

    if (!fanEl) {
      console.error("rudderFan element not found!");
      return null;
    }

    fanEl.style.transformOrigin = "122px 650px";

    const keyframes = [
      { transform: "rotateY(0deg)" },
      { transform: "rotateY(360deg)" },
    ];

    this.fanAnimation = fanEl.animate(keyframes, {
      duration: 2000,
      iterations: Infinity,
      easing: "linear",
    });
    this.fanAnimation.pause();
    return this.fanAnimation;
  },

  updateWaterLevel() {
    const waterLevel = this.model.get("waterLevel");
    const waterFill =
      this.findBySelector("waterLevelFill")[0] ||
      this.el.querySelector('[joint-selector="waterLevelFill"]') ||
      this.el.querySelector('path[selector="waterLevelFill"]');
    const waterText =
      this.findBySelector("waterLevelDisplayText")[0] ||
      this.el.querySelector('[joint-selector="waterLevelDisplayText"]') ||
      this.el.querySelector('path[selector="waterLevelDisplayText"]');
    console.log("waterLevel", waterLevel);
    if (waterFill) {
      const displayY = 216;
      const displayHeight = 509;

      const newHeight = displayHeight * waterLevel;
      const newY = displayY + (displayHeight - newHeight);

      const blueIntensity = Math.floor(100 + 155 * waterLevel);
      const opacity = 0.4 + 0.4 * waterLevel;

      waterFill.setAttribute("height", newHeight);
      waterFill.setAttribute("y", newY);
      waterFill.setAttribute(
        "fill",
        `rgba(100, 150, ${blueIntensity}, ${opacity})`
      );
    }
    if (waterText) {
      waterText.innerHTML = `<tspan fill="#000000">LEVEL:</tspan>\n<tspan fill="#406AE6">${Math.round(
        waterLevel * 100
      )}%</tspan>`;
      waterText.setAttribute(
        "style",
        "white-space: nowrap; font-size: 40px; font-family: Arial, sans-serif; font-weight: bold;"
      );
    }
  },

  updateAgitator() {
    const speed = this.model.get("agitatorSpeed");
    const agitatorText =
      this.findBySelector("agitatorDisplayText")[0] ||
      this.el.querySelector('[joint-selector="agitatorDisplayText"]') ||
      this.el.querySelector('path[selector="agitatorDisplayText"]');
    // const agitatorText = this.findBySelector("agitatorDisplayText")[0];

    if (agitatorText) {
      // agitatorText.textContent = `Agitator 81: ${Math.round(speed * 100)}%`;
      const statusText = speed === 0 ? "OFF" : "ON";
      const statusColor = speed === 0 ? "#000000" : "#078C00";
      agitatorText.innerHTML = `<tspan fill="#000000">AGITATOR:</tspan>\n<tspan fill="${statusColor}">${statusText}</tspan>`;
      agitatorText.setAttribute(
        "style",
        "white-space: nowrap; font-size: 35px; font-family: Arial, sans-serif; font-weight: bold;"
      );
    }

    this.updateBubbleAnimations(speed);
    if (speed > 0) {
      const anim = this.getFanAnimation();
      if (anim) {
        anim.playbackRate = speed * 2;
        anim.play();
      } else {
        console.error("No animation available");
      }
    } else {
      if (this.fanAnimation) {
        this.fanAnimation.cancel();
        this.fanAnimation = null;
        const fanEl = this.findBySelector("rudderFan")[0];
        if (fanEl) {
          fanEl.style.transform = "rotateY(0deg)";
        }
      }
    }
  },

  // NEW METHOD: Update temperature display
  // updateTemperature() {
  //   const temperature = this.model.get("temperature") || 0;
  //   const tempText =
  //     this.findBySelector("tempLevelDisplayText")[0] ||
  //     this.el.querySelector('[joint-selector="tempLevelDisplayText"]') ||
  //     this.el.querySelector('text[selector="tempLevelDisplayText"]');

  //   if (tempText) {
  //     tempText.innerHTML = `<tspan fill="#000000">TEMP:</tspan>\n<tspan fill="#406AE6">${temperature.toFixed(
  //       1
  //     )}°C</tspan>`;
  //     tempText.setAttribute(
  //       "style",
  //       "white-space: nowrap; font-size: 35px; font-family: Arial, sans-serif; font-weight: bold;"
  //     );
  //   }
  // },

  onRemove() {
    if (this.fanAnimation) {
      this.fanAnimation.cancel();
    }
    joint.dia.ElementView.prototype.onRemove.apply(this, arguments);
  },
});

export { VatWithAgitator, VatWithAgitatorView };
