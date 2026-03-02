import { useNavigate } from "react-router-dom";
import type { WorkflowType } from "../types/types";


export default function Card({ workflow }: { workflow: WorkflowType }){
    const navigate = useNavigate();
    function navigateToWorkflow(){
        console.log("card clicked");
        
        navigate(`/workflow/${workflow.id}`);
    }
    function deleteNode(e:React.MouseEvent){
        e.stopPropagation();
        console.log("Delete clicked");
    }
    return <div className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 bg-white hover:bg-gray-50 hover:shadow-sm transition cursor-pointer my-4" onClick={navigateToWorkflow}>
        <div className="font-medium text-gray-800">{workflow.name}</div>
        <button className="text-sm px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition" onClick={deleteNode}>Delete</button>
    </div>
}