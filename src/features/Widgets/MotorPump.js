import * as joint from "@joint/plus";

class MotorPump extends joint.dia.Element {
  defaults() {
    return {
      ...super.defaults,
      type: "MotorPump",
      size: { width: 814, height: 530 },
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
              args: { x: 617.928, y: 59 },
            },
            markup: joint.util.svg`
              <g @selector="portRoot">
                <rect @selector="pipeBody" transform="rotate(-90)" />
                <rect @selector="pipeEnd" transform="rotate(-90)" />
                <rect @selector="pipeEndStroke" transform="rotate(-90)" />
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
                magnet: "active",
              },
              pipeEnd: {
                width: 6.77049,
                height: 77.1171,
                x: -7.4918,
                y: 37.928,
                fill: "#808080",
                magnet: "active",
              },
              pipeEndStroke: {
                width: 10.5082,
                height: 73.1171,
                x: -5.928,
                y: 46.4918,
                fill: "white",
                stroke: "#808080",
                strokeWidth: 4,
              },
            },
          },
          out: {
            position: {
              name: "absolute",
              args: { x: 730, y: 359.928 },
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
      <path @selector="mainBody"/>
      <rect @selector="leftFoot"/>
      <rect @selector="rightFoot"/>
      <rect @selector="base"/>
      <path @selector="topComponent"/>
      <rect @selector="controlPanelBorder"/>
      <rect @selector="controlPanel1"/>
      <rect @selector="controlPanel2"/>
      <rect @selector="controlPanel3"/>
      <rect @selector="controlPanel4"/>
      <rect @selector="controlPanel5"/>
      <rect @selector="controlPanel6"/>
      <rect @selector="controlPanel7"/>
      <rect @selector="controlPanel8"/>
      <rect @selector="controlPanel9"/>
      <rect @selector="controlPanel10"/>
      <path @selector="leftLine"/>
      <path @selector="rightLine"/>
      <path @selector="rightComponent"/>
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

    // Calculate scale factors based on original size (814x530)
    const scaleX = width / 814;
    const scaleY = height / 530;
    const minScale = Math.min(scaleX, scaleY);

    // Update attributes with scaling
    this.attr({
      mainBody: {
        d: this.scalePath(
          "M50 182H611C615.418 182 619 185.582 619 190V459C619 463.418 615.418 467 611 467H50C23.4903 467 2 445.51 2 419V230C2 203.49 23.4903 182 50 182Z",
          scaleX,
          scaleY
        ),
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
      leftFoot: {
        x: 146 * scaleX,
        y: 469 * scaleY,
        width: 76 * scaleX,
        height: 40 * scaleY,
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
      rightFoot: {
        x: 453 * scaleX,
        y: 469 * scaleY,
        width: 76 * scaleX,
        height: 40 * scaleY,
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
      base: {
        x: 62 * scaleX,
        y: 509 * scaleY,
        width: 692 * scaleX,
        height: 21 * scaleY,
        fill: "#808080",
      },
      topComponent: {
        d: this.scalePath(
          "M475.5 135H215.5C191.476 135 172 154.476 172 178.5H519C519 154.476 499.524 135 475.5 135Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "51.4423%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "0%", y1: "50%", x2: "100%", y2: "50%" },
        },
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      controlPanelBorder: {
        x: 111 * scaleX,
        y: 186 * scaleY,
        width: 455 * scaleX,
        height: 276 * scaleY,
        fill: "none",
        stroke: "black",
        strokeWidth: 4 * minScale,
      },
      controlPanel1: {
        x: 109 * scaleX,
        y: 184 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel2: {
        x: 109 * scaleX,
        y: 212 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel3: {
        x: 109 * scaleX,
        y: 240 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel4: {
        x: 109 * scaleX,
        y: 268 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel5: {
        x: 109 * scaleX,
        y: 296 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel6: {
        x: 109 * scaleX,
        y: 324 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel7: {
        x: 109 * scaleX,
        y: 352 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel8: {
        x: 109 * scaleX,
        y: 380 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel9: {
        x: 109 * scaleX,
        y: 408 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      controlPanel10: {
        x: 109 * scaleX,
        y: 436 * scaleY,
        width: 459 * scaleX,
        height: 28 * scaleY,
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "15.3846%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
      },
      leftLine: {
        d: this.scalePath("M111 184L111 465", scaleX, scaleY),
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      rightLine: {
        d: this.scalePath("M567 184L567 465", scaleX, scaleY),
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
      rightComponent: {
        d: this.scalePath(
          "M618 427.5V139.667C618 116.655 599.345 98 576.333 98C571.731 98 568 94.269 568 89.6667V58H729.5V88C729.5 93.5228 725.023 98 719.5 98H672V149.435C672 167.298 681.53 183.804 697 192.736L704.5 197.066C719.97 205.998 729.5 222.504 729.5 240.368V457.5C729.5 468.546 720.546 477.5 709.5 477.5H668C640.386 477.5 618 455.114 618 427.5Z",
          scaleX,
          scaleY
        ),
        fill: {
          type: "linearGradient",
          stops: [
            { offset: "0%", color: "#737373" },
            { offset: "51.4423%", color: "#D9D9D9" },
            { offset: "100%", color: "#737373" },
          ],
          attrs: { x1: "50%", y1: "100%", x2: "50%", y2: "0%" },
        },
        stroke: "#808080",
        strokeWidth: 4 * minScale,
      },
    });

    // Update port positions
    this.prop("ports/groups/in/position/args", {
      x: 617.928 * scaleX,
      y: 59 * scaleY,
    });
    this.prop("ports/groups/out/position/args", {
      x: 730 * scaleX,
      y: 359.928 * scaleY,
    });

    const portScale = minScale;

    this.prop("ports/groups/in/size", {
      width: 37.7213 * portScale,
      height: 61.982 * portScale,
    });
    this.prop("ports/groups/out/size", {
      width: 37.7213 * portScale,
      height: 61.982 * portScale,
    });

    // Update port attributes
    this.prop("ports/groups/in/attrs/pipeBody", {
      width: 37.7213 * portScale,
      height: 61.982 * portScale,
    });
    this.prop("ports/groups/in/attrs/pipeEnd", {
      width: 6.77049 * portScale,
      height: 77.1171 * portScale,
      x: 37.928 * portScale,
      y: -7.4918 * portScale,
    });
    this.prop("ports/groups/in/attrs/pipeEndStroke", {
      width: 10.5082 * portScale,
      height: 73.1171 * portScale,
      x: 46.4918 * portScale,
      y: -5.928 * portScale,
      strokeWidth: 4 * portScale,
    });

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
      x: 46.4918 * portScale,
      y: -5.928 * portScale,
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
}

export default MotorPump;
