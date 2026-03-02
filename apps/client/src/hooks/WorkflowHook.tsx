import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { WorkflowType } from "../types/types";


export default function useWorkflows() {
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate("/signin")
    axios.get("http://localhost:3000/workflows", {
      headers: {
        Authorization: token
      }
    }).then(res => {
      console.log("response from workflows  ", res);
      setWorkflows(res.data.data);
      setLoading(false);
    })
  }, [])

  return {
    loading, workflows
  }
}

export function useWorkflowById(id?: string) {
  console.log("executed wioth id as --->", id);

  const [loading, setLoading] = useState(true);
  const [workflow, setWorkflow] = useState<WorkflowType>();
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('token');
    if (!token) navigate("/signin")
    axios.get(`http://localhost:3000/workflow/${id}`, {
      headers: {
        Authorization: token
      }
    }).then(res => {
      console.log("response from workflows  ", res);
      setWorkflow(res.data.data);
      setLoading(false);
    })
  }, [])
  return {
    workflow, loading
  };
}

export function useSaveWorkflow() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const saveWorkflow = async (workflow: WorkflowType) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const res = await axios.post(
        "http://localhost:3000/workflow",
        workflow,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const workflowId: string = res.data.workflowId;

      navigate(`/workflow/${workflowId}`);

    } catch (error) {
      console.error("Failed to save workflow", error);
    } finally {
      setLoading(false);
    }
  };

  return { saveWorkflow, loading };
}

export function useUpdateWorkflow() {
  const navigate = useNavigate();
  const updateWorkflow = async (workflow: WorkflowType, workflowId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const res = await axios.put(
        `http://localhost:3000/workflow/${workflowId}`,
        workflow,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      navigate(`/workflow/${workflowId}`);
    } catch (e) {
      console.log("error while updating the workflow-->", e);
    }
  }
  return {updateWorkflow};
}