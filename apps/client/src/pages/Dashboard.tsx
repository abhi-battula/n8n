import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Navbar from "../components/Navbar"
import useWorkflows from "../hooks/WorkflowHook";
import type { WorkflowType } from "../types/types";
import { useEffect, useState } from "react";

export default function () {
  const {loading,workflows} = useWorkflows();
  const navigate = useNavigate();
  // if(loading){
  //   return(
  //     <div>
  //       <Navbar />
  //       <div>loading------------</div>
  //     </div>
  //   )
  // }
  console.log("from dashoboard",workflows);
  function navigateToCreateWorkflow(){
    navigate("/workflow/new")
  }
  return <div>
    <Navbar />
    <div className="flex justify-end mr-4">
      <button className="mt-2 cursor-pointer text-sm px-3 py-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition" onClick={navigateToCreateWorkflow}>Create</button>
    </div>
    {workflows.map(w=>{
      return <Card workflow={w}/>
    })}
  </div>
}

