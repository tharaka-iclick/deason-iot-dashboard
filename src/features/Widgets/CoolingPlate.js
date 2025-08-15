import * as joint from "@joint/plus";

class CoolingPlate extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "CoolingPlate",
      size: { width: 621, height: 812 },
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
              args: { x: 517, y: 132 },
            },
            markup: joint.util.svg`
              <g @selector="portRoot">
                <rect @selector="pipeBody" />
                <rect @selector="pipeEnd" />
                <rect @selector="pipeEndStroke" />
              </g>
            `,
            size: { width: 83, height: 62 },
            attrs: {
              portRoot: {
                magnetSelector: "pipeEnd",
              },
              pipeBody: {
                width: 83,
                height: 62,
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
                magnet: "active",
              },
              pipeEnd: {
                width: 6.77049,
                height: 77.1171,
                x: 82.721,
                y: -8.1171,
                fill: "#808080",
                magnet: "active",
              },
              pipeEndStroke: {
                width: 10.5082,
                height: 73.1171,
                x: 91.492,
                y: -6.1171,
                fill: "white",
                stroke: "#808080",
                strokeWidth: 4,
              },
            },
          },
          out: {
            position: {
              name: "absolute",
              args: { x: 517, y: 628 },
            },
            markup: joint.util.svg`
              <g @selector="portRoot">
                <rect @selector="pipeBody" />
                <rect @selector="pipeEnd" />
                <rect @selector="pipeEndStroke" />
              </g>
            `,
            size: { width: 83, height: 62 },
            attrs: {
              portRoot: {
                magnetSelector: "pipeEnd",
              },
              pipeBody: {
                width: 83,
                height: 62,
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
                magnet: "active",
              },
              pipeEnd: {
                width: 6.77049,
                height: 77.1171,
                x: 82.721,
                y: -8.1171,
                fill: "#808080",
                magnet: "active",
              },
              pipeEndStroke: {
                width: 10.5082,
                height: 73.1171,
                x: 91.492,
                y: -6.1171,
                fill: "white",
                stroke: "#808080",
                strokeWidth: 4,
              },
            },
          },
        },
        items: [
          { id: "in", group: "in" },
          { id: "out", group: "out" },
        ],
      },
    };
  }

  // Rest of your existing code remains exactly the same
  preinitialize() {
    this.markup = joint.util.svg`
      <rect @selector="body"/>
      <path @selector="container1"/>
      <path @selector="container2"/>
      <path @selector="container3"/>
      ${Array.from(
        { length: 19 },
        (_, i) => `
        <path @selector="fin1_${i}"/>
        <path @selector="fin2_${i}"/>
        <path @selector="fin3_${i}"/>
      `
      ).join("")}
      <g @selector="controlPanelGroup" filter="url(#filter0_d_2026_4)">
        <rect @selector="controlPanel"/>
        <rect @selector="controlPanelBorder"/>
      </g>
      <rect @selector="leftFoot"/>
      <rect @selector="rightFoot"/>
      <path @selector="endCap1"/>
      <path @selector="endCap2"/>
      <path @selector="endCap3"/>
      <path @selector="endCap4"/>
      <path @selector="endCap5"/>
      <path @selector="endCap6"/>
      <path @selector="endCap7"/>
      <path @selector="endCap8"/>
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
    const scaleX = width / 621;
    const scaleY = height / 812;
    const minScale = Math.min(scaleX, scaleY);

    // Define fin positions (16 fins, spaced evenly from x=75 to x=480)
    const finBaseX = [
      75, 97.5, 120, 142.5, 165, 187.5, 210, 232.5, 255, 277.5, 300, 322.5, 345,
      367.5, 390, 412.5, 435, 457.5, 480,
    ];
    const finWidth = 12.5;

    this.attr({
      container1: {
        d: this.scalePath(
          "M53 54L53 273L466 273L489 273L489 54L53 54Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.259615", color: "#D9D9D9" },
            { offset: "0.509615", color: "white" },
            { offset: "0.740385", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "100%", y1: "50%", x2: "0%", y2: "50%" },
        },
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      container2: {
        d: this.scalePath(
          "M53 294L53 513L466 513L489 513L489 294L53 294Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.259615", color: "#D9D9D9" },
            { offset: "0.509615", color: "white" },
            { offset: "0.740385", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "100%", y1: "50%", x2: "0%", y2: "50%" },
        },
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      container3: {
        d: this.scalePath(
          "M53 533.5L53 752.5L466 752.5L489 752.5L489 533.5L53 533.5Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.259615", color: "#D9D9D9" },
            { offset: "0.509615", color: "white" },
            { offset: "0.740385", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "100%", y1: "50%", x2: "0%", y2: "50%" },
        },
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      controlPanel: {
        x: 127 * scaleX,
        y: 100 * scaleY,
        width: 286 * scaleX,
        height: 124 * scaleY,
        rx: 8 * scaleX,
        ry: 8 * scaleY,
        fill: "white",
      },
      controlPanelBorder: {
        x: 128.5 * scaleX,
        y: 101.5 * scaleY,
        width: 283 * scaleX,
        height: 121 * scaleY,
        rx: 6.5 * scaleX,
        ry: 6.5 * scaleY,
        fill: "none",
        stroke: "#737373",
        strokeWidth: 3 * minScale,
      },
      controlPanelGroup: {
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
      leftFoot: {
        x: 25 * scaleX,
        y: 0, // Changed from 812 * scaleY to 0
        width: 27 * scaleX,
        height: 812 * scaleY,
        // transform: "rotate(-180 52 812)",
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        },
      },
      rightFoot: {
        x: 490 * scaleX,
        y: 0,
        width: 27 * scaleX,
        height: 812 * scaleY,
        // transform: "rotate(-180 517 812)",
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
        },
      },
      endCap1: {
        d: this.scalePath(
          "M517 22L517 53.1111L517 62L527.623 62C530.384 62 532.623 59.7614 532.623 57L532.623 50.4444L540 50.4444L540 33.5556L532.623 33.5556L532.623 27C532.623 24.2386 530.384 22 527.623 22L517 22Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#737373",
        strokeWidth: 2 * minScale,
      },
      endCap2: {
        d: this.scalePath(
          "M24 63L24 31.8889L24 23L13.3774 23C10.6159 23 8.37736 25.2386 8.37736 28L8.37736 34.5556L0.999998 34.5556L0.999995 51.4444L8.37735 51.4444L8.37735 58C8.37735 60.7614 10.6159 63 13.3773 63L24 63Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#737373",
        strokeWidth: 2 * minScale,
      },
      endCap3: {
        d: this.scalePath(
          "M517 263L517 294.111L517 303L527.623 303C530.384 303 532.623 300.761 532.623 298L532.623 291.444L540 291.444L540 274.556L532.623 274.556L532.623 268C532.623 265.239 530.384 263 527.623 263L517 263Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#737373",
        strokeWidth: 2 * minScale,
      },
      endCap4: {
        d: this.scalePath(
          "M24 303L24 271.889L24 263L13.3774 263C10.6159 263 8.37736 265.239 8.37736 268L8.37736 274.556L0.999998 274.556L0.999995 291.444L8.37735 291.444L8.37735 298C8.37735 300.761 10.6159 303 13.3773 303L24 303Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#737373",
        strokeWidth: 2 * minScale,
      },
      endCap5: {
        d: this.scalePath(
          "M517 503L517 534.111L517 543L527.623 543C530.384 543 532.623 540.761 532.623 538L532.623 531.444L540 531.444L540 514.556L532.623 514.556L532.623 508C532.623 505.239 530.384 503 527.623 503L517 503Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#737373",
        strokeWidth: 2 * minScale,
      },
      endCap6: {
        d: this.scalePath(
          "M24 543L24 511.889L24 503L13.3774 503C10.6159 503 8.37736 505.239 8.37736 508L8.37736 514.556L0.999998 514.556L0.999995 531.444L8.37735 531.444L8.37735 538C8.37735 540.761 10.6159 543 13.3773 543L24 543Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#737373",
        strokeWidth: 2 * minScale,
      },
      endCap7: {
        d: this.scalePath(
          "M517 742L517 773.111L517 782L527.623 782C530.384 782 532.623 779.761 532.623 777L532.623 770.444L540 770.444L540 753.556L532.623 753.556L532.623 747C532.623 744.239 530.384 742 527.623 742L517 742Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#737373",
        strokeWidth: 2 * minScale,
      },
      endCap8: {
        d: this.scalePath(
          "M24 783L24 751.889L24 743L13.3774 743C10.6159 743 8.37736 745.239 8.37736 748L8.37736 754.556L0.999998 754.556L0.999995 771.444L8.37735 771.444L8.37735 778C8.37735 780.761 10.6159 783 13.3773 783L24 783Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "0.514423", color: "#D9D9D9" },
            { offset: "1", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "0%", x2: "50%", y2: "100%" },
        },
        stroke: "#737373",
        strokeWidth: 2 * minScale,
      },
    });

    // Update fins for each container
    [1, 2, 3].forEach((containerIndex) => {
      const yStart =
        containerIndex === 1 ? 54 : containerIndex === 2 ? 294 : 533.5;
      const yEnd =
        containerIndex === 1 ? 272.5 : containerIndex === 2 ? 512.5 : 752;
      finBaseX.forEach((x, i) => {
        this.attr(`fin${containerIndex}_${i}`, {
          d: this.scalePath(
            `M${x} ${yStart}L${x} ${yEnd}L${x - finWidth} ${yEnd}L${
              x - finWidth
            } ${yStart}L${x} ${yStart}Z`,
            scaleX,
            scaleY
          ),
          fill: "white",
          stroke: "#737373",
          strokeWidth: 1 * minScale,
        });
      });
    });

    // Update port positions and sizes
    this.prop("ports/groups/in/position/args", {
      x: 517 * scaleX,
      y: 132 * scaleY,
    });
    this.prop("ports/groups/out/position/args", {
      x: 517 * scaleX,
      y: 628 * scaleY,
    });

    const portScale = minScale;
    this.prop("ports/groups/in/size", {
      width: 83 * portScale,
      height: 62 * portScale,
    });
    this.prop("ports/groups/out/size", {
      width: 83 * portScale,
      height: 62 * portScale,
    });

    this.prop("ports/groups/in/attrs/pipeBody", {
      width: 83 * portScale,
      height: 62 * portScale,
    });
    this.prop("ports/groups/in/attrs/pipeEnd", {
      width: 6.77049 * portScale,
      height: 77.1171 * portScale,
      x: 82.721 * portScale,
      y: -8.1171 * portScale,
    });
    this.prop("ports/groups/in/attrs/pipeEndStroke", {
      width: 10.5082 * portScale,
      height: 73.1171 * portScale,
      x: 91.492 * portScale,
      y: -6.1171 * portScale,
      strokeWidth: 4 * portScale,
    });

    this.prop("ports/groups/out/attrs/pipeBody", {
      width: 83 * portScale,
      height: 62 * portScale,
    });
    this.prop("ports/groups/out/attrs/pipeEnd", {
      width: 6.77049 * portScale,
      height: 77.1171 * portScale,
      x: 82.721 * portScale,
      y: -8.1171 * portScale,
    });
    this.prop("ports/groups/out/attrs/pipeEndStroke", {
      width: 10.5082 * portScale,
      height: 73.1171 * portScale,
      x: 91.492 * portScale,
      y: -6.1171 * portScale,
      strokeWidth: 4 * portScale,
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

export default CoolingPlate;
