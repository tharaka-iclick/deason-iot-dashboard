import React, { useEffect, useRef, useState } from 'react';
import * as joint from '@joint/plus';

// --- Placeholders for your SVG assets ---
// You will need to replace these string placeholders with your actual SVG imports or content.
const MotorPumpSVG = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>';
const HeatPumpSVG = '<svg viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" stroke="black" stroke-width="3" fill="blue" /></svg>';
const CoolingPlate = '<svg viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" stroke="black" stroke-width="3" fill="lightblue" /></svg>';
const VatAgitator = '<svg viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" stroke="black" stroke-width="3" fill="green" /></svg>';
const Chille = '<svg viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" stroke="black" stroke-width="3" fill="purple" /></svg>';
const IceBank = '<svg viewBox="0 0 100 100"><rect width="80" height="80" x="10" y="10" stroke="black" stroke-width="3" fill="white" /></svg>';


// --- Custom Pipe Definition ---
const LIQUID_COLOR = "#00f";
const FLOW_FLAG = "FLOW";

// The Pipe01 model class.
export class Pipe01 extends joint.dia.Link {
    defaults() {
        return {
            ...super.defaults,
            type: "Pipe01",
            z: -1,
            router: { name: "rightAngle" },
            flow: 1,
            attrs: {
                liquid: {
                    connection: true,
                    stroke: LIQUID_COLOR,
                    strokeWidth: 10,
                    strokeLinejoin: "round",
                    strokeLinecap: "square",
                    strokeDasharray: "10,20",
                },
                line: {
                    connection: true,
                    stroke: "#eee",
                    strokeWidth: 10,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                },
                outline: {
                    connection: true,
                    stroke: "#444",
                    strokeWidth: 16,
                    strokeLinejoin: "round",
                    strokeLinecap: "round",
                },
            },
        };
    }

    preinitialize() {
        this.markup = joint.util.svg `
            <path @selector="outline" fill="none"/>
            <path @selector="line" fill="none"/>
            <path @selector="liquid" fill="none"/>
        `;
    }

    get flow() {
        return this.get("flow") || 0;
    }

    set flow(value) {
        this.set("flow", value);
    }
}

// The PipeView01 view class for rendering the pipe.
export class PipeView01 extends joint.dia.LinkView {
    presentationAttributes = joint.dia.LinkView.addPresentationAttributes({
        flow: [FLOW_FLAG],
    });

    initFlag = [...super.initFlag, FLOW_FLAG];
    flowAnimation = null;

    confirmUpdate(...args) {
        let flags = super.confirmUpdate(...args);
        if (this.hasFlag(flags, FLOW_FLAG)) {
            this.updateFlow();
            flags = this.removeFlag(flags, FLOW_FLAG);
        }
        return flags;
    }

    getFlowAnimation() {
        if (this.flowAnimation) return this.flowAnimation;
        const [liquidEl] = this.findBySelector('liquid');
        if (!liquidEl) return null;
        const dashArray = liquidEl.getAttribute('stroke-dasharray');
        if (!dashArray || dashArray === 'none') return null;
        const patternLength = dashArray.split(/[\s,]+/).map(n => parseFloat(n) || 0).reduce((a, b) => a + b, 0);
        if (patternLength === 0) return null;
        const keyframes = [{ strokeDashoffset: 0 }, { strokeDashoffset: -patternLength }];
        const animation = liquidEl.animate(keyframes, {
            duration: 1500,
            iterations: Infinity,
            fill: 'forwards'
        });
        this.flowAnimation = animation;
        return animation;
    }

    updateFlow() {
        const animation = this.getFlowAnimation();
        if (!animation) return;
        const flowRate = this.model.get('flow') || 0;
        animation.playbackRate = flowRate;
        const [liquidEl] = this.findBySelector('liquid');
        if (liquidEl) {
            liquidEl.style.stroke = flowRate === 0 ? '#ccc' : LIQUID_COLOR;
        }
    }
}

// Factory function for creating new pipes.
export const createPipe = (id) => {
    return new Pipe01({
        id: `pipe${id}`,
        attrs: {
            labels: [{
                attrs: {
                    text: {
                        text: ` Pipe ${id} `,
                        fontFamily: "sans-serif",
                        fontSize: 10,
                    },
                    rect: { fillOpacity: 0.9 },
                },
                position: { args: { keepGradient: true, ensureLegibility: true } },
            }, ],
        },
    });
};

// --- Placeholder for your custom TemplateImage class ---
// You will need to provide the full definition for your TemplateImage class.
class TemplateImage extends joint.shapes.standard.Image {
    defaults() {
        return joint.util.deepSupplement({
            type: 'custom.TemplateImage',
            attrs: {
                root: {
                    magnet: false
                }
            }
        }, joint.shapes.standard.Image.prototype.defaults);
    }
}


// --- The main React Component ---
const FullJointJSExample = () => {
    // Refs for DOM elements
    const paperContainerRef = useRef(null);
    const stencilContainerRef = useRef(null);
    const inspectorContainerRef = useRef(null);
    const commandManagerRef = useRef(null);
    const paperRef = useRef(null);
    const stencilRef = useRef(null);
    const inspectorInstanceRef = useRef(null);
    const timerRef = useRef(null);
    const lastViewRef = useRef(null);
    const portIdCounterRef = useRef(0);
    const deviceSubscriptions = useRef(new Map());
    const cellDeviceData = useRef(new Map());

    // State
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedEUI, setSelectedEUI] = useState('');
    const [selectedDevice, setSelectedDevice] = useState('');
    const [currentFileHandle, setCurrentFileHandle] = useState(null);
    const [currentFileName, setCurrentFileName] = useState('');
    const [currentCmdId, setCurrentCmdId] = useState(null);
    const [deviceEUIs, setDeviceEUIs] = useState([]);
    const [deviceIDs, setDeviceIDs] = useState([]);

    useEffect(() => {
        const { dia, shapes, mvc, ui, highlighters, util } = joint;
        const namespace = {
            ...shapes,
            custom: { TemplateImage },
            Pipe01,
        };

        // Helper functions (placeholders, implement as needed)
        const log = (context, message) => console.log(`[${context}] ${message}`);
        const isSaved = (commandManager, cmdId) => !commandManager.hasUndo();
        const getCellId = (cell) => cell.id;
        const unsubscribeCellFromDevice = (cellId) => { /* Your logic here */ };

        const graph = new dia.Graph({}, { cellNamespace: namespace });
        const commandManager = new dia.CommandManager({ graph: graph });
        commandManagerRef.current = commandManager;

        commandManager.on("stack:push", (cmd) => {
            const cmdId = joint.util.uuid();
            // Assuming cmd is an array-like object
            Array.from(cmd).forEach((c) => (c.id = cmdId));
        });

        commandManager.on("stack", () => {
            if (currentFileHandle) {
                setCurrentFileName((prev) =>
                    isSaved(commandManager, currentCmdId) ?
                    prev.replace("*", "") :
                    prev.replace("*", "") + "*"
                );
            }
        });

        let linkIdCounter = 0;

        const paper = new dia.Paper({
            model: graph,
            cellViewNamespace: { ...namespace, PipeView01 },
            linkView: (link) => {
                if (link.get('type') === 'Pipe01') {
                    return PipeView01;
                }
                return dia.LinkView;
            },
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
                const sourceGroup = sourceView.findAttribute("port-group", sourceMagnet);
                const sourcePort = sourceView.findAttribute("port", sourceMagnet);
                const source = sourceView.model;
                if (sourceGroup !== "out") {
                    log("paper<validateMagnet>", "It's not possible to create a link from an inbound port.");
                    return false;
                }
                if (graph.getConnectedLinks(source, { outbound: true }).find((link) => link.source().port === sourcePort)) {
                    log("paper<validateMagnet>", "The port has already an outbound link (we allow only one link per port)");
                    return false;
                }
                return true;
            },
            validateConnection: (sourceView, sourceMagnet, targetView, targetMagnet) => {
                if (sourceView === targetView) return false;
                const targetGroup = targetView.findAttribute("port-group", targetMagnet);
                const targetPort = targetView.findAttribute("port", targetMagnet);
                const target = targetView.model;
                if (target.isLink()) return false;
                if (targetGroup !== "in") return false;
                if (graph.getConnectedLinks(target, { inbound: true }).find((link) => link.target().port === targetPort)) {
                    return false;
                }
                return true;
            },
            snapLinks: { radius: 10 },
            snapLabels: true,
            markAvailable: true,
        });

        paperRef.current = paper;
        if (paperContainerRef.current) {
            paperContainerRef.current.innerHTML = ''; // Clear previous paper
            paperContainerRef.current.appendChild(paper.el);
        }

        const clearTools = () => paper.removeTools();

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
                        attributes: { r: 10, fill: "#FFD5E8", stroke: "#FD0B88", "stroke-width": 2, cursor: "pointer" },
                      },
                      {
                        tagName: "path",
                        selector: "icon",
                        attributes: { d: "M -4 -4 4 4 M -4 4 4 -4", fill: "none", stroke: "#333", "stroke-width": 3, "pointer-events": "none" },
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
        
        // --- Stencil Setup ---
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
            layout: { columns: 1, rowHeight: "compact", rowGap: 10, columnWidth: 200, marginY: 10, resizeToFit: false, dx: 0, dy: 0 },
            dragStartClone: (cell) => {
                const clone = cell.clone();
                if (clone.get("port")) {
                    const { width, height } = clone.size();
                    clone.attr("body/fill", "lightgray");
                    clone.attr("body/transform", `translate(-${width / 2}, -${height / 2})`);
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
        if (stencilContainerRef.current) {
            stencilContainerRef.current.innerHTML = ''; // Clear previous stencil
            stencilContainerRef.current.appendChild(stencil.el);
        }
        
        // Add your stencil elements and ports here
        // const stencilElements = [ ... ];
        // const stencilPorts = [ ... ];
        // stencil.load({ elements: stencilElements, ports: stencilPorts });
        
        stencil.render();

        // Cleanup function
        return () => {
            deviceSubscriptions.current.forEach((unsubscribe) => unsubscribe());
            deviceSubscriptions.current.clear();
            cellDeviceData.current.clear();
            paper.remove();
            stencil.remove();
        };
    }, []); // Empty dependency array ensures this runs only once.

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
            <div ref={stencilContainerRef} style={{ width: '240px', borderRight: '1px solid #ccc', background: '#FCFCFC' }}></div>
            <div ref={paperContainerRef} style={{ flex: 1, position: 'relative' }}></div>
            <div ref={inspectorContainerRef} style={{ width: '300px', borderLeft: '1px solid #ccc', background: '#FCFCFC', padding: '8px' }}></div>
        </div>
    );
};

export default FullJointJSExample;
