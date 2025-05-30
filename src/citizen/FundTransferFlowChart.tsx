import { useState, useEffect, useRef } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon } from "lucide-react";

interface FlowChartProps {
  projectBudget: number;
  laborSpent: number;
  materialSpent: number;
}

const nodeStyle = {
  padding: "10px",
  borderRadius: "5px",
  fontSize: "12px",
  textAlign: "center" as const,
  border: "1px solid #e2e8f0",
  width: 180,
};

const CustomNode = ({ data }: { data: { label: string } }) => (
  <div style={nodeStyle}>
    {data.label.split("\n").map((line, i) => (
      <div key={i}>{line}</div>
    ))}
  </div>
);

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export default function FundTransferFlowChart({
  projectBudget,
  laborSpent,
  materialSpent,
}: FlowChartProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const newNodes: Node[] = [
        {
          id: "1",
          type: "custom",
          position: { x: 0, y: 0 },
          data: { label: `Government\n₹${projectBudget.toLocaleString()}` },
          style: { backgroundColor: "#e2e8f0" },
        },
        {
          id: "2",
          type: "custom",
          position: { x: 250, y: 0 },
          data: { label: `Contractor\n₹${projectBudget.toLocaleString()}` },
          style: { backgroundColor: "#bfdbfe" },
        },
        {
          id: "3",
          type: "custom",
          position: { x: 500, y: -75 },
          data: { label: `Labor\n₹${laborSpent.toLocaleString()}` },
          style: { backgroundColor: "#bbf7d0" },
        },
        {
          id: "4",
          type: "custom",
          position: { x: 500, y: 75 },
          data: {
            label: `Material Suppliers\n₹${materialSpent.toLocaleString()}`,
          },
          style: { backgroundColor: "#fde68a" },
        },
      ];

      const newEdges: Edge[] = [
        {
          id: "e1-2",
          source: "1",
          target: "2",
          animated: true,
          label: `₹${projectBudget.toLocaleString()}`,
          style: { stroke: "#94a3b8" },
        },
        {
          id: "e2-3",
          source: "2",
          target: "3",
          animated: true,
          label: `₹${laborSpent.toLocaleString()}`,
          style: { stroke: "#94a3b8" },
        },
        {
          id: "e2-4",
          source: "2",
          target: "4",
          animated: true,
          label: `₹${materialSpent.toLocaleString()}`,
          style: { stroke: "#94a3b8" },
        },
      ];

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [isVisible, projectBudget, laborSpent, materialSpent]);

  return (
    <Card ref={chartRef} className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowDownIcon className="mr-2" />
          Fund Transfer Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: "400px" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}
