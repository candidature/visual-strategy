//TBD: change coreFlow3 to have a loader, this loader will fetch the data. 
//Currently we are passing data which does not refresh the layout.
//This also make coreflow assume we are changing node/edges whenever we click next/previous, this creates multiple copies which are useless.
//We also need to fix next back to be more precise.

import React, {useContext, useEffect, useState} from 'react'
import {ReactFlow, ReactFlowProvider} from "@xyflow/react";
import CoreFlow5 from "./CoreFlow5.jsx";
import {ChakraProvider} from "@chakra-ui/react";
import {useLoaderData, useNavigate, useParams, useSearchParams} from "react-router-dom";
import customFetch from "../utils/customFetch.js";
import HistoryPoints from './HistoryPoints'
import {toast} from "react-toastify";
import {json} from "@remix-run/router";
import {DashboardContext} from "./DashboardLayout.jsx";

import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import { Badge, Stack } from "@chakra-ui/react"
import { useCallback } from 'react';


export const loader = async ({params,request})=> {

    const zoomNodeName = new URL(request.url).searchParams.get('zoomNodeName');
    const originDocumentId = new URL(request.url).searchParams.get('originDocumentId');
    const historyDocumentId = new URL(request.url).searchParams.get('historyDocumentId');
    const historyIndex = new URL(request.url).searchParams.get('historyIndex');


    try {
        const [initialData, allInitiativeData, fullHistory] = await Promise.all([
            //await customFetch.get("/flow-test/"+params.initiative+"?zoomNodeName="+zoomNodeName),
            //localhost:5100/api/v1/initiative2/Migrate to cloud
            await customFetch.get("initiative2/"+params.initiative+"?zoomNodeName="+zoomNodeName),
            await customFetch.get("/initiative2/all-initiatives"),
            await customFetch.get("/history/"+originDocumentId)
            //await customFetch.get("/flow-test")
        ]);

        //console.log(fullHistory)
        fullHistory.data.push(initialData.data)
        let initialData2 = initialData.data
        fullHistory.data.map((d)=>{
          //console.log(d)
        })

        //console.log(fullHistory)

        return json({ initialData, allInitiativeData,fullHistory, originDocumentId, historyDocumentId, historyIndex});
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return error;
    }
}


export default function SelectInitiative4() {
    const { initiative } = useParams();

    const theme = useTheme();

    

    let {initialData,allInitiativeData,fullHistory, originDocumentId, historyDocumentId,historyIndex}  = useLoaderData()

    //console.log("initial data"+JSON.stringify(initialData))
    //console.log("historial data"+JSON.stringify(fullHistory.data));

    const [data, setData] = useState(fullHistory.data[-1])
    const [activeStep, setActiveStep] = useState(fullHistory.data.length-1);
    const [newFullHistory, setNewFullHistory] = useState(false)
    const navigate = useNavigate()
    


    const [searchParams, setSearchParams] = useSearchParams();
    const [currentInitiative, setCurrentInitiative] = useState({name:initiative,id:initialData.data._id});

    const [currentInitiativeName, setCurrentInitiativeName] = useState(initiative)
    const [currentInitiativeDocumentId, setCurrentInitiativeDocumentId] = useState(initialData.data._id)

    const [currentInitiativeOriginDocumentId, setCurrentInitiativeOriginDocumentId] = useState(originDocumentId)


    const zoomNodeName = searchParams.get("zoomNodeName");
    const [toBeZoomedNodeId,setToBeZoomedNodeId] = useState("")


    
    const [initiativesFromDB, setInitiativesFromDB] = useState([allInitiativeData]);
    const [toBeZoomedNode, setToBeZoomedNode] = useState()


    console.log(allInitiativeData)
    const [reload, setReload] = useState(true)


    //console.log("entire history size" + fullHistory.data.length)

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
          
          console.log("Now exploring.. On next click"+(prevActiveStep+1))
          if(prevActiveStep<fullHistory.data.length) {
            //console.log(prevActiveStep);
            console.log(fullHistory.data[prevActiveStep+1]._id)
            setData({data: fullHistory.data[prevActiveStep]})
            //localhost:5100/api/v1/history/documentId/675de5e6147abd4ab5806689
            navigate(`/history/documentId/${fullHistory.data[prevActiveStep+1]._id}`, { replace: true });
            return (prevActiveStep+1)
          } else {
            toast.error("Reached at history "+prevActiveStep);
          }
        
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
          if(prevActiveStep=>0 && prevActiveStep && fullHistory.data.length-1){
            let stepNo = fullHistory.data.length-1-prevActiveStep;

            console.log("Now showing : "+(prevActiveStep-1))
            //console.log("On previous click"+(fullHistory.data.length-1-prevActiveStep))
            console.log(fullHistory.data[prevActiveStep-1]._id)
            //http://localhost:5173/dashboard/init102?documentId=675df7eb3cef1e7fdb0235df
            navigate(`/dashboard/${initiative}?originDocumentId=${originDocumentId}&historyDocumentId=${fullHistory.data[prevActiveStep-1]._id}`, { replace: true });

            setData({data: fullHistory.data[stepNo]})
            return (prevActiveStep - 1)
          } else {
            toast.error("Reached at history "+prevActiveStep);
          }
        });
    };

    


    //let toBeZoomedNodeId = ""

    useEffect(() => {

      


      //console.log(initialData)
      setData(initialData)
            

      let initialInitiatives = []
        //console.log(allInitiativeData.data)
        //console.log(allInitiativeData)
        allInitiativeData.data.map((document)=>{
            //console.log(document)
          document.nodes.map((node)=>{
            if(node.type==="INITIATIVE_NODE"){
                //console.log(node.data.name)
                initialInitiatives.push({name: node.data.name, id: node.id, documentId: document._id});
            }
            //console.log(node.type+node.data.name+zoomNodeName)
            if(zoomNodeName && node.data.name===zoomNodeName) {
              setToBeZoomedNodeId(node.id)
              console.log(toBeZoomedNodeId)
            }
          })
        })
        
        // .data.nodes.map((i)=>{
        //     if(i.type==="INITIATIVE_NODE"){
        //         initialInitiatives.push(i.data.name);
        //     }
            
        //     //console.log(n.data.name);
        //     //console.log(n.data.name , zoomNodeName)
        //     if(i.data.name===zoomNodeName) {
        //         toBeZoomedNodeId = i.data.id
        //         console.log("MATCH FOUND")
        //     } else {
        //         console.log("zoom node name not found",i.name)
        //     }
        // })

        setInitiativesFromDB(initialInitiatives);

        

        // customFetch.get("/history/"+originDocumentId).then((data)=>{
        //   //console.log(data.data)
        //   if(data) {
        //     fullHistory=data
        //     console.log(fullHistory.data.length-1)
        //     fullHistory.data.push(initialData.data)
        //     setNewFullHistory(fullHistory)
        // }})

    },[setToBeZoomedNodeId, setCurrentInitiative,currentInitiative,originDocumentId],setCurrentInitiativeOriginDocumentId)

    //TBD: set originDocumentId as state, if this changes update the history.

  
    const handleInitiativeChange = useCallback(async (event)=> {
      let eventData = (event.target.value)
      let splitOutput = (eventData.split("_"))
      setCurrentInitiative({name: splitOutput[0], id: splitOutput[1]})
      
      console.log("switching to " + splitOutput[0] +" and "+ splitOutput[1])

      setCurrentInitiativeName(splitOutput[0])
      //setCurrentInitiativeDocumentId(splitOutput[1])
      
      setCurrentInitiativeOriginDocumentId(splitOutput[1])

      console.log("calling endpoing initiative2/"+currentInitiative.name+"?originDocumentId="+currentInitiativeOriginDocumentId)
      //setting data is important so that page refreshes, else it does not refresh!! - TBD in the very future how to optimise it.
      //await customFetch.get("initiative2/"+currentInitiative.name+"?originDocumentId="+currentInitiativeOriginDocumentId)
      await customFetch.get("/history/"+currentInitiativeOriginDocumentId)
      .then((data)=>{
        //setData(data)
        fullHistory = data
        console.log(fullHistory)
        return navigate("/dashboard/"+splitOutput[0]+"?originDocumentId="+splitOutput[1]);
      }).catch((error)=> {
        console.log(error)
      })


      await customFetch.get("initiative2/"+currentInitiative.name+"?zoomNodeName="+zoomNodeName)
      .then((data)=>{
          initialData = data.data
          console.log("refetching initial data")
          console.log(data.data)
          console.log(fullHistory)
          fullHistory.push(initialData)
      }).catch((error)=>{
        console.log(error)
      })

    })

    // function handleOnChange(event){
    //   let eventData = (event.target.value)
    //   let splitOutput = (eventData.split("_"))
    //   setCurrentInitiative({name: splitOutput[0], id: splitOutput[1]})
      
    //   console.log("switching to " + splitOutput[0] +" and "+ splitOutput[1])

    //   setCurrentInitiativeName(splitOutput[0])
    //   //setCurrentInitiativeDocumentId(splitOutput[1])
    //   setCurrentInitiativeOriginDocumentId(splitOutput[1])
      
        
      
      
    //   console.log("calling endpoing")
    //   //setting data is important so that page refreshes, else it does not refresh!! - TBD in the very future how to optimise it.
    //   customFetch.get("initiative2/"+currentInitiative+"?originDocumentId="+currentInitiativeOriginDocumentId)
    //   .then(async (data)=>{
    //     //setData(data)
    //     fullHistory = data
    //     console.log(fullHistory)
    //     return navigate("/dashboard/"+splitOutput[0]+"?originDocumentId="+splitOutput[1]);
    //   }).catch((error)=>{
    //     console.log(error)
    //   })
        
    // }

    return (
        <>
       <HistoryPoints fullHistory={fullHistory}/>


        <ChakraProvider>
            <div className="Row">
                <div className="Column">
                    <select onChange={handleInitiativeChange}>
                        {initiativesFromDB.map((d,key)=>
                                                    

                        { //console.log(JSON.stringify(d) +""+currentInitiative.name)  
                          if(d.name === currentInitiative.name) {
                            return <option key={key} selected={true} value={d.documentId}>{d.name}</option>
                        }
                            return <option key={key} value={`${d.name}_${d.documentId}`}>{d.name}</option>
                        }
                        )}
                    </select>
                </div>

                <Stack direction="row">
                <Badge>Default</Badge>
                <Badge colorPalette="green">COMPLETED</Badge>
                <Badge colorPalette="red">TODO</Badge>
                <Badge colorPalette="purple">IN_PROGRESS</Badge>
                </Stack>

            </div>
                <ReactFlowProvider>
                
                <CoreFlow5 key={Date.now()} initiativeName={currentInitiativeName} documentId={currentInitiativeDocumentId}
                                historyDocumentId={historyDocumentId}
                               toBeZoomedNodeId={toBeZoomedNodeId}/>
                     {/* <CoreFlow2 initiativeData={data} initiativeName={currentInitiative.name}
                                toBeZoomedNodeId={toBeZoomedNodeId}
                                /> */}
                </ReactFlowProvider>
        </ChakraProvider>
        </>
    )
}
SelectInitiative4.loader = loader;