import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import type { NodeData } from "../types/types"

type AppNode = Node<NodeData,"custom">
export const CustomNode = ({data}:NodeProps<AppNode>) => {
  const isTrigger = ['manual', 'webhook', 'schedule'].includes(data.kind)
    // console.log("data&&&&",data);
    
  return (  
    <div className="p-2 bg-white border rounded">
      {isTrigger && <Handle type="source" position={Position.Right} />}
      {!isTrigger && <Handle type="target" position={Position.Left} />}
      {!isTrigger && <Handle type="source" position={Position.Right} />}
      <div>{data.kind}</div>
    </div>
  )
}