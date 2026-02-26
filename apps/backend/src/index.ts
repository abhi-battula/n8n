import express from "express";
import cors from "cors";
import { signupSchema, signinSchema, WorkflowSchema, WorkflowType } from "./common/common";
import { prisma } from "./prisma";
import { authMiddleware } from "./middleware";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("inside get metjhod");
  res.json("i am working")
})

app.post("/signup", async (req, res) => {
  const { success, data } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid inputs" });
  }
  const { name, email, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(name, email, password);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })
    const JWT_SECRET = process.env.JWT_SECRET!;
    const token = await jwt.sign({ id: newUser.id }, JWT_SECRET);
    return res.status(200).json({
      message: "user created successfully",
      token
    })
  } catch (e) {
    console.error("------------Signup error:", e);
    return res.status(500).json({ message: "Error creating user" });
  }

})

app.post("/signin", async (req, res) => {
  const { success, data } = signinSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid inputs" });
  }
  const { email, password } = data;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })
    if (!user) {
      return res.status(400).json({ message: "user does not exist" })
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ message: "password is not correct" })
    }
    const JWT_SECRET = process.env.JWT_SECRET!;
    const token = await jwt.sign({ id: user.id }, JWT_SECRET);
    return res.status(200).json({ message: "logged in successfully", token })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "error while fetching details" });
  }

})

// These will ALWAYS be required:
// At least one node
// Exactly one trigger
// All edges reference valid nodes
// No duplicate node IDs
// No duplicate edge IDs
// These are not about branching.
// These are about graph integrity.
//-----keep all them in one method like check nodeIntegrity() which we can call while creating and updating.
//------current work , mostly create workflow completed and nodes,edges,workflow types also defined , just copy paste in ui.
// ----- remainig work , ui , update workflow , get specific work flow, get all workflows , delete work flow.

app.post("/workflow", authMiddleware, async (req, res) => {
  //zod schema
  const userId = req.userId!;
  // console.log("req222",req);

  const { success, data } = WorkflowSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid inputs" });
  }
  const { name, nodes, edges } = data;
  const workflowValidation = validateWorkflow(data)
  if (!workflowValidation.valid) {
    return res.status(400).json({ message: workflowValidation.message })
  }
  try {
    const workflow = await prisma.workflow.create({
      data: {
        name,
        nodes,
        edges,
        userId
      }
    })
    return res.status(200).json({ message: "workflow created successfully", workflowId: workflow.id })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "error while adding workflow" })
  }
})

app.get("/workflows", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  try {
    const workflows = await prisma.workflow.findMany({
      where: {
        userId
      }
    })
    return res.status(200).json({ message: "workflows fetched successfully", data: workflows })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "error while fetching workflows" })
  }
})

app.get<{ id: string }>("/workflow/:id", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const id = req.params.id;
  try {
    const workflow = await prisma.workflow.findFirst({
      where: {
        userId,
        id
      }
    })
    if (!workflow) {
      return res.status(404).json({ message: "Workflow not found" });
    }
    return res.status(200).json({ message: "workflows fetched successfully", data: workflow })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "error while fetching workflows" })
  }
})

app.put<{ id: string }>("/workflow/:id", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const id = req.params.id;
  const { success, data } = WorkflowSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid inputs" });
  }
  const { name, nodes, edges } = data;
  const workflowValidation = validateWorkflow(data)
  if (!workflowValidation.valid) {
    return res.status(400).json({ message: workflowValidation.message })
  }
  try {
    const workflow = await prisma.workflow.update({
      where: { userId, id },
      data: {
        name,
        nodes,
        edges
      }
    })
    return res.status(200).json({ message: "updated the workflow successfully", data: workflow })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "error while updating workflow" })
  }
})

app.delete<{ id: string }>("/workflow/:id", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  try {
    await prisma.workflow.delete({
      where: {
        userId,
        id
      }
    })
    return res.status(200).json({ message: "successfully deleted the workflow" })
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "error while deleting the workflow" })
  }
})

function validateWorkflow(workflow: WorkflowType): { valid: boolean, message?: string } {
  const { nodes, edges } = workflow;
  // at least one node 
  if (nodes.length == 0) return { valid: false, message: "no nodes present" }

  const triggerCount = nodes.filter(n =>
    ["webhook", "schedule"].includes(n.kind)
  ).length;
  if (triggerCount !== 1) return { valid: false, message: "triggers are not valid" }

  const nodeIds = nodes.map(n => n.id);
  const nodeIdSet = new Set(nodeIds);
  if (nodeIdSet.size !== nodeIds.length) return { valid: false, message: "node ids are not unique" };

  const edgeIds = edges.map(e => e.id);
  const edgeIdSet = new Set(edgeIds);
  if (edgeIdSet.size !== edgeIds.length) return { valid: false, message: "edge ids are not unique" };

  for (const e of edges) {
    if (!nodeIdSet.has(e.source) || !nodeIdSet.has(e.target)) {
      return { valid: false, message: "Invalid edge reference" };
    }
  }
  return { valid: true };
}
app.listen(3000, () => {
  console.log(" i am listening");

})