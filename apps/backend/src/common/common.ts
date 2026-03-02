import zod, { string } from "zod";

export const signinSchema = zod.object({
    email : zod.email(),
    password : zod.string()
})

export type Signin = zod.infer<typeof signinSchema>;   

export const signupSchema = zod.object({
    name : zod.string(),
    email : zod.email(),
    password : zod.string()
})

export type Signup = zod.infer<typeof signupSchema>;

type NodeKind = "webhook" | "schedule" | "manual" | "http" | "telegram" | "delay";
export interface NodeType {
    id: string;
    type:string;
    position: {
        x: number;
        y: number;
    }
    data: {
        kind: NodeKind;
        metaData: any;
    }
}

interface EdgeType {
    id: string;
    source: string;
    target: string;
}
export interface WorkflowType {
    name: string;
    nodes: NodeType[];
    edges: EdgeType[];
 }

 export const WorkflowSchema = zod.object({
    name: zod.string().min(1),
    nodes: zod.array(zod.object({
        id: zod.string(),
        type: zod.string(),
        position: zod.object({
        x: zod.number(),
        y: zod.number(),
        }),
        data: zod.object({
            kind: zod.enum(["webhook","manual","schedule","http","telegram","delay"]),
            metaData:zod.any()
        })
    })).min(1),
    edges: zod.array(zod.object({
        id: zod.string(),
        source:  zod.string(),
        target:  zod.string()
    }))
 }) 

type NodeStatus = "pending" | "running" | "success" | "failed";

export type NodeStates = Record<string, NodeStatus>;