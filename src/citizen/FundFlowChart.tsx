import { Flowchart, Edge, Node } from "flowchart-react"

interface Transaction {
  from: string
  to: string
  amount: number
  date: string
}

interface FundFlowChartProps {
  transactions: Transaction[]
}

export default function FundFlowChart({ transactions }: FundFlowChartProps) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const nodeMap = new Map<string, number>()

  transactions.forEach((transaction, index) => {
    if (!nodeMap.has(transaction.from)) {
      nodeMap.set(transaction.from, nodes.length)
      nodes.push({ id: nodes.length.toString(), label: transaction.from })
    }
    if (!nodeMap.has(transaction.to)) {
      nodeMap.set(transaction.to, nodes.length)
      nodes.push({ id: nodes.length.toString(), label: transaction.to })
    }

    edges.push({
      id: index.toString(),
      from: nodeMap.get(transaction.from)!.toString(),
      to: nodeMap.get(transaction.to)!.toString(),
      label: `$${transaction.amount.toLocaleString()}`,
    })
  })

  return (
    <div className="h-[500px] border border-gray-300 rounded">
      <Flowchart
        nodes={nodes}
        edges={edges}
        onNodeClick={() => {}}
        onEdgeClick={() => {}}
        className="w-full h-full"
      />
    </div>
  )
}