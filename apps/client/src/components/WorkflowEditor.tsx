// export default function WorkflowEditor(){
//     return <div>
//         workflow editor
//     </div>
// }

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type NodeChange, type EdgeChange, Background, Controls, type NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Navbar from './Navbar';
import type { NodeType, EdgeType, NodeKind, WorkflowType } from '../types/types';
import { CustomNode } from './CustomNode';
import { useNavigate, useParams } from 'react-router-dom';
import { useSaveWorkflow, useUpdateWorkflow, useWorkflowById } from '../hooks/WorkflowHook';
const initialNodes: NodeType[] = [
  // { id: 'n1', kind: "webhook", position: { x: 0, y: 0 }, data: { label: 'Manual' } },
  // { id: 'n2', kind: "http", position: { x: 0, y: 100 }, data: { label: 'http' } },
];
const initialEdges: EdgeType[] = [
  // { id: 'n1-n2', source: 'n1', target: 'n2' }
];
const nodeTypes = {
  custom: CustomNode,// shoule these things be outside or inside the function ?
};
export default function WorkflowEditor() {
  const [nodes, setNodes] = useState<NodeType[]>(initialNodes);
  const [edges, setEdges] = useState<EdgeType[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<NodeType>()
  const [workflowName, setWorkflowName] = useState("");
  const { workflowId } = useParams()
  const workflowRes = useWorkflowById(workflowId)
  const { saveWorkflow } = useSaveWorkflow()
  const { updateWorkflow } = useUpdateWorkflow()
  const navigate = useNavigate();
  useEffect(() => {
    if (workflowId) {

      if (workflowRes.workflow?.id && workflowRes.workflow.nodes && workflowRes.workflow.edges) {
        setWorkflowName(workflowRes.workflow.name);
        setNodes(workflowRes.workflow?.nodes)
        setEdges(workflowRes.workflow.edges)
      }
    }
  }, [workflowRes.workflow]);
  const onNodesChange = useCallback(
    (changes: NodeChange<NodeType>[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<EdgeType>[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );


  function addNode(kind: NodeKind) {
    const id = crypto.randomUUID();
    const newNode: NodeType = {
      id,
      type: "custom",
      position: {
        x: Math.random() * 150,
        y: Math.random() * 150
      },
      data: {
        kind,
        metaData: "just some use full data"
      }
    }
    setNodes(prev => [...prev, newNode]);
  }

  function deleteNode(selectedNode: NodeType) {
    setNodes(nodes => nodes.filter(n => n.id !== selectedNode.id))
    setEdges(edges => edges.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id))
  }

  function handleSaveWorkflow() {
    const workFlow: WorkflowType = {
      name: workflowName,
      nodes,
      edges
    }

    console.log("post workflow payload----------->", workFlow);
    saveWorkflow(workFlow)
  }

  function handleUpdateWorkflow() {
    if (!workflowId) return;
    const workFlow: WorkflowType = {
      name: workflowName,
      nodes,
      edges
    }

    console.log(`update workflow payload executed ${workflowId} ----------->`, workFlow);
    updateWorkflow(workFlow, workflowId)
  }
  //todo : in /workflow/:id page when clicking on save , it is not updating instead creating a new one , so check that.
  return (
    <div className='h-screen flex flex-col'>
      <Navbar />
      <div className='flex items-center justify-between px-6 py-2 border-b'>
        <div className="text-sm font-medium text-gray-700">
          Name: <span className="font-semibold text-gray-900">{workflowName}</span>
        </div>
        <div className='flex gap-2'>
          {workflowId && (
            <button className="text-sm px-3 py-1 rounded-md bg-emerald-200 text-emerald-800 hover:bg-emerald-300 transition shadow-sm cursor-pointer">Run</button>
          )}
          <button className="text-sm px-3 py-1 rounded-md bg-amber-200 text-amber-800 hover:bg-amber-300 transition shadow-sm cursor-pointer">enable/disable</button>
        </div>
        <div className='flex gap-2'>
          <button className="text-sm px-3 py-1 rounded-md bg-blue-200 text-blue-800 hover:bg-blue-300 transition shadow-sm cursor-pointer" onClick={workflowId ? handleUpdateWorkflow : handleSaveWorkflow}>save</button>
          <button className="text-sm px-3 py-1 rounded-md bg-rose-200 text-rose-800 hover:bg-rose-300 transition shadow-sm cursor-pointer" onClick={() => { navigate("/dashboard") }}>Back</button>
        </div>
      </div>
      <div className='flex flex-1'>
        <div className="w-1/4 border-r bg-white px-4 py-4">
          {/* Triggers */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Triggers
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => addNode('manual')}
                className="text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition text-left cursor-pointer"
              >
                Manual
              </button>

              <button
                onClick={() => addNode('webhook')}
                className="text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition text-left cursor-pointer"
              >
                Webhook
              </button>

              <button
                onClick={() => addNode('schedule')}
                className="text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition text-left cursor-pointer"
              >
                Schedule
              </button>
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Actions
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => addNode('http')}
                className="text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition text-left cursor-pointer"
              >
                HTTP
              </button>

              <button
                onClick={() => addNode('telegram')}
                className="text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition text-left cursor-pointer"
              >
                Telegram
              </button>

              <button
                onClick={() => addNode('delay')}
                className="text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-md transition text-left cursor-pointer"
              >
                Delay
              </button>
            </div>
          </div>
        </div>
        <div className='border w-2/4'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            onNodeClick={(event, node) => setSelectedNode(node)}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className='border w-1/4'>
          <div>right side</div>
          <div>
            <label htmlFor="">Workflow Name</label>
            <input className='border' type="text" onChange={(e) => { setWorkflowName(e.target.value) }} value={workflowName} />
          </div>
          {selectedNode && (
            <div>
              <p>{selectedNode.data.kind}</p>
              <p>{selectedNode.id}</p>
              <button onClick={() => { deleteNode(selectedNode) }}>Delete</button>
            </div>

          )}

        </div>
      </div>
    </div>
  );
}