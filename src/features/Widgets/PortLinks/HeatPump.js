import { dia, util } from "@joint/plus";
import * as joint from "@joint/plus";

const POWER_FLAG = "POWER";

const r = 30;
const d = 10;
const l = (3 * r) / 4;

class HeatPump extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "HeatPump",
      size: { width: 680, height: 396 }, // Default size
      power: 0,
      attrs: {
        root: {
          magnetSelector: "body",
        },
        body: {
          refWidth: "100%",
          refHeight: "100%",
          fill: "none",
        },
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
    this.on("change:size", this.updateAttrs, this);
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

  get power() {
    return this.get("power") || 0;
  }

  set power(value) {
    this.set("power", value);
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

    // Calculate scale factors based on original size (680x396)
    const scaleX = width / 680;
    const scaleY = height / 396;

    // Calculate the scaled center position (original center was at 423.5, 188.5)
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
    console.log("togglePower called with power:", power); // Debug
    console.log("HeatPump togglePower called with power:", power);
    console.log("Model attributes:", model.attributes);

    if (power > 0) {
      const anim = this.getSpinAnimation();
      if (anim) {
        anim.playbackRate = power;
        anim.play();
        console.log("Animation playing with playbackRate:", power); // Debug
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

export { HeatPump, HeatPumpView };
