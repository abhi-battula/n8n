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

type NodeKind = "webhook" | "schedule" | "http" | "telegram" | "delay";
interface NodeType {
    id: string;
    kind: NodeKind;
    position: {
        x: number;
        y: number;
    }
    data: any;
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
        kind: zod.enum(["webhook","schedule","http","telegram","delay"]),
        position: zod.object({
        x: zod.number(),
        y: zod.number(),
        }),
        data: zod.any()
    })).min(1),
    edges: zod.array(zod.object({
        id: zod.string(),
        source:  zod.string(),
        target:  zod.string()
    }))
 }) 