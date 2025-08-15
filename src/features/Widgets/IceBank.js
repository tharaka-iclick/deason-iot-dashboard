import * as joint from "@joint/plus";

class IceBank extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "IceBank",
      size: { width: 856, height: 742 },
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
        items: [
          { group: "in", id: "in1" }, // Port 1: Input at (665, 215.928)
          { group: "in", id: "in2" }, // Port 2: Output at (665, 440.928)
          { group: "out", id: "out2" }, // Port 3: Output at (59, 310.189)
          { group: "out", id: "out3" }, // Port 4: Output at (59, 670.189)
        ],
        groups: {
          in: {
            position: {
              name: "right",
            },
            markup: joint.util.svg`
              <g @selector="portRoot">
                <rect @selector="pipeBody" />
                <rect @selector="pipeEnd" />
                <rect @selector="pipeEndStroke" />
              </g>
            `,
            size: { width: 37.7213, height: 61.982 },
            z: 10,
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
                magnet: "passive",
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
          out: {
            position: {
              name: "right",
            },
            markup: joint.util.svg`
              <g @selector="portRoot">
                <rect @selector="pipeBody" />
                <rect @selector="pipeEnd" />
                <rect @selector="pipeEndStroke" />
              </g>
            `,
            size: { width: 37.7213, height: 61.982 },
            z: 10,
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
      <rect @selector="mainBody"/>
      <line @selector="horizontalLine"/>
      <circle @selector="bottomCircle"/>
      <circle @selector="valve1Circle"/>
      <line @selector="valve1Line1"/>
      <line @selector="valve1Line2"/>
      <circle @selector="valve2Circle"/>
      <line @selector="valve2Line1"/>
      <line @selector="valve2Line2"/>
      <circle @selector="valve3Circle"/>
      <line @selector="valve3Line1"/>
      <line @selector="valve3Line2"/>
      <circle @selector="valve4Circle"/>
      <line @selector="valve4Line1"/>
      <line @selector="valve4Line2"/>
      <path @selector="topVertical"/>
      <path @selector="topHorizontal"/>
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

    // Calculate scale factors based on original size (856x742)
    const scaleX = width / 856;
    const scaleY = height / 742;
    const minScale = Math.min(scaleX, scaleY);

    // Update attributes with scaling
    this.attr({
      mainBody: {
        x: 53 * scaleX,
        y: 175 * scaleY,
        width: 617 * scaleX,
        height: 565 * scaleY,
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
      horizontalLine: {
        x1: 51 * scaleX,
        y1: 584 * scaleY,
        x2: 672 * scaleX,
        y2: 584 * scaleY,
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      bottomCircle: {
        cx: 354.5 * scaleX,
        cy: 666.5 * scaleY,
        r: 9.5 * minScale,
        fill: "#D9D9D9",
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      valve1Circle: {
        cx: 138 * scaleX,
        cy: 247 * scaleY,
        r: 11 * minScale,
        fill: "white",
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve1Line1: {
        x1: 129.586 * scaleX,
        y1: 255.586 * scaleY,
        x2: 145.586 * scaleX,
        y2: 239.586 * scaleY,
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve1Line2: {
        x1: 129.414 * scaleX,
        y1: 238.586 * scaleY,
        x2: 146.414 * scaleX,
        y2: 255.586 * scaleY,
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve2Circle: {
        cx: 280 * scaleX,
        cy: 247 * scaleY,
        r: 11 * minScale,
        fill: "white",
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve2Line1: {
        x1: 271.586 * scaleX,
        y1: 255.586 * scaleY,
        x2: 287.586 * scaleX,
        y2: 239.586 * scaleY,
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve2Line2: {
        x1: 271.414 * scaleX,
        y1: 238.586 * scaleY,
        x2: 288.414 * scaleX,
        y2: 255.586 * scaleY,
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve3Circle: {
        cx: 280 * scaleX,
        cy: 385 * scaleY,
        r: 11 * minScale,
        fill: "white",
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve3Line1: {
        x1: 271.586 * scaleX,
        y1: 393.586 * scaleY,
        x2: 287.586 * scaleX,
        y2: 377.586 * scaleY,
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve3Line2: {
        x1: 271.414 * scaleX,
        y1: 376.586 * scaleY,
        x2: 288.414 * scaleX,
        y2: 393.586 * scaleY,
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve4Circle: {
        cx: 139 * scaleX,
        cy: 385 * scaleY,
        r: 11 * minScale,
        fill: "white",
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve4Line1: {
        x1: 130.586 * scaleX,
        y1: 393.586 * scaleY,
        x2: 146.586 * scaleX,
        y2: 377.586 * scaleY,
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      valve4Line2: {
        x1: 130.414 * scaleX,
        y1: 376.586 * scaleY,
        x2: 147.414 * scaleX,
        y2: 393.586 * scaleY,
        stroke: "#737373",
        strokeWidth: 4 * minScale,
      },
      topVertical: {
        d: this.scalePath("M551 112H568V173H551V112Z", scaleX, scaleY),
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
      topHorizontal: {
        d: this.scalePath("M541 85H578V118H541V85Z", scaleX, scaleY),
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
      //   pipe1: {
      //     x: 659 * scaleX,
      //     y: 552.728 * scaleY,
      //     width: 18 * scaleX,
      //     height: 259.679 * scaleY,
      //     transform: "rotate(-45)",
      //     fill: "#808080",
      //   },
      //   pipe2: {
      //     x: 659 * scaleX,
      //     y: 742 * scaleY,
      //     width: 18 * scaleX,
      //     height: 196 * scaleY,
      //     transform: "rotate(-90)",
      //     fill: "#808080",
      //   },
    });

    // Update port positions
    this.prop("ports/items/0/args", {
      x: 665 * scaleX,
      y: 215.928 * scaleY,
    });
    this.prop("ports/items/1/args", {
      x: 665 * scaleX,
      y: 440.928 * scaleY,
    });
    this.prop("ports/items/2/args", {
      x: 59 * scaleX,
      y: 310.189 * scaleY,
      transform: "rotate(180)",
    });
    this.prop("ports/items/3/args", {
      x: 59 * scaleX,
      y: 670.189 * scaleY,
      transform: "rotate(180)",
    });

    this.prop(
      "ports/items/2/attrs/portRoot/transform",
      `rotate(180, ${1 * scaleX}, ${1 * scaleY})`
    );
    this.prop(
      "ports/items/3/attrs/portRoot/transform",
      `rotate(180, ${1 * scaleX}, ${1 * scaleY})`
    );

    const portScale = minScale;

    // Update port sizes and attributes
    ["in", "out"].forEach((portGroup) => {
      this.prop(`ports/groups/${portGroup}/size`, {
        width: 37.7213 * portScale,
        height: 61.982 * portScale,
      });
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
}

export default IceBank;
