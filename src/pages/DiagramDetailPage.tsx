// src/pages/DiagramDetailPage.tsx
import React, { useEffect, useRef, useState } from "react";
import * as go from "gojs";

const DiagramDetailPage: React.FC = () => {
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const [diagram, setDiagram] = useState<go.Diagram | null>(null);
  const [jsonOutput, setJsonOutput] = useState("");
  const [svgOutput, setSvgOutput] = useState("");

  useEffect(() => {
    if (!diagramRef.current) return;
    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, diagramRef.current, {
      "undoManager.isEnabled": true,
      model: new go.GraphLinksModel({
        linkKeyProperty: "key",
      }),
    });

    // 🔹 Template para un item (atributo o método)
    const itemTemplate =
      $(go.Panel, "Horizontal",
        $(go.TextBlock,
          {
            margin: 2,
            editable: true,
            stroke: "#333",
            font: "10pt sans-serif"
          },
          new go.Binding("text", "text").makeTwoWay()
        ),
        $("Button",
          {
            margin: 2,
            click: (e, btn) => {
              const item = btn.part?.data;
              const panel = btn.part as go.Panel;
              if (!item || !panel) return;
              const node = panel.part as go.Node;
              const diagram = node.diagram;
              if (!diagram) return;
              diagram.startTransaction("remove item");
              const arr = (node.data.attributes ?? []).includes(item)
                ? node.data.attributes
                : node.data.methods;
              (diagram.model as go.GraphLinksModel).removeArrayItem(arr, arr.indexOf(item));
              diagram.commitTransaction("remove item");
            }
          },
          $(go.TextBlock, "-", { stroke: "red", font: "bold 12pt sans-serif" })
        )
      );

    // 🔹 Plantilla de nodo UML Class
    myDiagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, { fill: "lightyellow", stroke: "black" }),
        $(go.Panel, "Vertical",
          { stretch: go.GraphObject.Fill, margin: 4 },
          // Nombre de la clase
          $(go.TextBlock,
            {
              font: "bold 12pt sans-serif",
              editable: true,
              margin: 4,
              alignment: go.Spot.Center
            },
            new go.Binding("text", "name").makeTwoWay()
          ),
          // Sección atributos
          $(go.Panel, "Vertical",
            $(go.TextBlock, "Atributos",
              { font: "bold 10pt sans-serif", margin: 2 }
            ),
            $("Button",
              { margin: 2, click: (e, btn) => {
                const node = btn.part as go.Node;
                if (!node) return;
                const diagram = node.diagram;
                if (!diagram) return;
                diagram.startTransaction("add attribute");
                (diagram.model as go.GraphLinksModel).addArrayItem(node.data.attributes, { text: "nuevoAtributo: tipo" });
                diagram.commitTransaction("add attribute");
              }},
              $(go.TextBlock, "+", { stroke: "green", font: "bold 12pt sans-serif" })
            ),
            $(go.Panel, "Vertical",
              new go.Binding("itemArray", "attributes").makeTwoWay(),
              { itemTemplate }
            )
          ),
          // Sección métodos
          $(go.Panel, "Vertical",
            $(go.TextBlock, "Métodos",
              { font: "bold 10pt sans-serif", margin: 2 }
            ),
            $("Button",
              { margin: 2, click: (e, btn) => {
                const node = btn.part as go.Node;
                if (!node) return;
                const diagram = node.diagram;
                if (!diagram) return;
                diagram.startTransaction("add method");
                (diagram.model as go.GraphLinksModel).addArrayItem(node.data.methods, { text: "nuevoMetodo()" });
                diagram.commitTransaction("add method");
              }},
              $(go.TextBlock, "+", { stroke: "green", font: "bold 12pt sans-serif" })
            ),
            $(go.Panel, "Vertical",
              new go.Binding("itemArray", "methods").makeTwoWay(),
              { itemTemplate }
            )
          )
        )
      );

    // 🔹 Plantilla de enlaces UML
    myDiagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.Orthogonal },
      $(go.Shape),
      $(go.Shape, { toArrow: "OpenTriangle" })
    );

    // 🔹 Modelo inicial
    myDiagram.model = new go.GraphLinksModel(
      [
        {
          key: 1,
          name: "Estudiante",
          attributes: [
            { text: "- id: int" },
            { text: "- nombre: string" },
            { text: "- edad: int" }
          ],
          methods: [{ text: "+ matricular()" }],
        },
        {
          key: 2,
          name: "Curso",
          attributes: [
            { text: "- id: int" },
            { text: "- nombre: string" }
          ],
          methods: [{ text: "+ getAlumnos()" }],
        },
      ],
      [{ key: -1, from: 1, to: 2 }]
    );

    setDiagram(myDiagram);

    return () => {
      myDiagram.div = null;
    };
  }, []);

  // 🔹 Añadir nueva clase
  const handleAddClass = () => {
    if (diagram) {
      const model = diagram.model as go.GraphLinksModel;
      const newKey = model.nodeDataArray.length + 1;
      model.addNodeData({
        key: newKey,
        name: "NuevaClase",
        attributes: [{ text: "+ nuevoAtributo: tipo" }],
        methods: [{ text: "+ nuevoMetodo()" }],
      });
      diagram.centerRect(new go.Rect(0, 0, 0, 0));
    }
  };

  // 🔹 Exportar a JSON
  const handleExportJSON = () => {
    if (diagram) {
      const json = diagram.model.toJson();
      setJsonOutput(json);
    }
  };

  // 🔹 Exportar a SVG
  const handleExportSVG = () => {
    if (diagram) {
      const svg = diagram.makeSvg({ scale: 1.0 });
      if (svg) {
        const svgStr = new XMLSerializer().serializeToString(svg);
        setSvgOutput(svgStr);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">📊 UML Class Diagram (GoJS)</h2>

      <div className="space-x-4">
        <button onClick={handleAddClass} className="bg-purple-600 text-white px-4 py-2 rounded">
          ➕ Agregar Clase
        </button>
        <button onClick={handleExportJSON} className="bg-blue-600 text-white px-4 py-2 rounded">
          📦 Exportar JSON
        </button>
        <button onClick={handleExportSVG} className="bg-green-600 text-white px-4 py-2 rounded">
          🖼 Exportar SVG
        </button>
      </div>

      <div
        ref={diagramRef}
        style={{ width: "100%", height: "70vh", border: "1px solid #ccc" }}
        className="bg-white rounded shadow"
      />

      {jsonOutput && (
        <div className="w-full max-w-4xl">
          <h3 className="font-semibold mt-4">📦 Export JSON:</h3>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
            {jsonOutput}
          </pre>
        </div>
      )}

      {svgOutput && (
        <div className="w-full max-w-4xl">
          <h3 className="font-semibold mt-4">🖼 Export SVG:</h3>
          <div
            className="bg-gray-100 p-3 rounded overflow-auto max-h-60"
            dangerouslySetInnerHTML={{ __html: svgOutput }}
          />
        </div>
      )}
    </div>
  );
};

export default DiagramDetailPage;
