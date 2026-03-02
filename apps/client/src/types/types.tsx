export type SigninType = {
  email: string;
  password: string
}

export interface SignupType {
  name: string;
  email: string;
  password: string
}

export type NodeKind = "webhook" | "schedule" | "manual" | "http" | "telegram" | "delay";
export type NodeData = {
  kind: NodeKind;
  metaData: any;
}
export interface NodeType {
  id: string;
  type:string; // remove type before sending to backend
  position: {
    x: number;
    y: number;
  }
  data: NodeData;
}

export interface EdgeType {
  id: string;
  source: string;
  target: string;
}
export interface WorkflowType {
  id?: string;
  name: string;
  nodes: NodeType[];
  edges: EdgeType[];
}