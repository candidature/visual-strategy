//TBD: change coreFlow3 to have a loader, this loader will fetch the data. 
//Currently we are passing data which does not refresh the layout.
//This also make coreflow assume we are changing node/edges whenever we click next/previous, this creates multiple copies which are useless.
//We also need to fix next back to be more precise.

import React, {useContext, useEffect, useState} from 'react'
import {ReactFlow, ReactFlowProvider} from "@xyflow/react";
import CoreFlow2 from "./CoreFlow2.jsx";
import {ChakraProvider} from "@chakra-ui/react";
import {useLoaderData, useNavigate, useParams, useSearchParams} from "react-router-dom";
import customFetch from "../utils/customFetch.js";
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
    const currentDocumentId = new URL(request.url).searchParams.get('documentId');


    try {
        const [initialData, allInitiativeData, fullHistory] = await Promise.all([
            //await customFetch.get("/flow-test/"+params.initiative+"?zoomNodeName="+zoomNodeName),
            //localhost:5100/api/v1/initiative2/Migrate to cloud
            await customFetch.get("initiative2/"+params.initiative+"?zoomNodeName="+zoomNodeName),
            await customFetch.get("/initiative2/all-initiatives"),
            await customFetch.get("/history/"+currentDocumentId)
            //await customFetch.get("/flow-test")
        ]);

        //console.log(fullHistory)
        fullHistory.data.push(initialData.data)
        let initialData2 = initialData.data
        fullHistory.data.map((d)=>{
          console.log(d)
        }
        )
        //console.log(fullHistory)

        return json({ initialData, allInitiativeData,fullHistory});
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return error;
    }
}


export default function SelectInitiative4() {
    const { initiative } = useParams();


    const theme = useTheme();

    

    const {initialData,allInitiativeData,fullHistory}  = useLoaderData()

    //console.log("initial data"+JSON.stringify(initialData))
    //console.log("historial data"+JSON.stringify(fullHistory.data));

    const [data, setData] = useState(fullHistory.data[-1])
    const [activeStep, setActiveStep] = useState(fullHistory.data.length-1);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
          if(prevActiveStep<fullHistory.data.length) {
            console.log(prevActiveStep);
            setData({data: fullHistory.data[prevActiveStep]})
            return (prevActiveStep+1)
          } else {
            toast.error("Reached at history "+prevActiveStep);
          }
        
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
          if(prevActiveStep=>0 && prevActiveStep <= fullHistory.data.length-1){
            console.log(prevActiveStep)

            setData({data: fullHistory.data[prevActiveStep]})
            return (prevActiveStep - 1)
          } else {
            toast.error("Reached at history "+prevActiveStep);
          }
        });
    };

    

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentInitiative, setCurrentInitiative] = useState({name:initiative,id:""});

    const zoomNodeName = searchParams.get("zoomNodeName");
    const [toBeZoomedNodeId,setToBeZoomedNodeId] = useState("")


    const navigate = useNavigate()
    const [initiativesFromDB, setInitiativesFromDB] = useState([initiative]);
    const [toBeZoomedNode, setToBeZoomedNode] = useState()


    const [reload, setReload] = useState(true)

    //let toBeZoomedNodeId = ""

    useEffect(() => {
      setData(initialData)
      let initialInitiatives = []
        //console.log(allInitiativeData.data)
        console.log(allInitiativeData)
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

        

        //setToBeZoomedNode(toBeZoomedNodeId);
        //console.log(toBeZoomedNodeId)

        //console.log(initiativesFromDB);
    },[setToBeZoomedNodeId,setCurrentInitiative])


    const handleSelectChange = useCallback(async (event)=>{
      console.log(event.taget.value)
      let redirectTo = ""
      initiativesFromDB.map((initiative) => {
        console.log(event.target.value + initiative.name);
        if (event.target.value === initiative.name) {
          console.log("matched the name");
          //setCurrentInitiative({name: event.target.value, id: initiative.id});
          //setData(initialData)
          console.log("redirecting..");
          redirectTo=initiative.documentId
        }
      })
      navigate(`/dashboard/${event.target.value}?documentId=${redirectTo}`, { replace: true });

    })
    function handleOnChange(event){
      let eventData = (event.target.value)
      let splitOutput = (eventData.split("_"))
      setCurrentInitiative({name: splitOutput[0], id: splitOutput[1]})

      
      //setting data is important so that page refreshes, else it does not refresh!! - TBD in the very future how to optimise it.
      customFetch.get("initiative2/"+splitOutput[0]+"?documentId="+splitOutput[1])
      .then((data)=>{
        setData(data)
        return navigate("/dashboard/"+splitOutput[0]+"?documentId="+splitOutput[1]);
      })
      

        // //console.log(event.target.value);
        // return initiativesFromDB.map(async (initiative)=>{
        //   console.log(event.target.value+initiative.name)
        //     if(event.target.value === initiative.name) {
        //         console.log("matched the name")
        //         setCurrentInitiative({name: event.target.value, id: initiative.id});
        //         setData(initialData)
        //         console.log("redirecting..")
        //         return navigate(`/dashboard/${event.target.value}?documentId=${initiative.documentId}`);
        //     }
        // })
        
    }

    return (
        <>
        {fullHistory.data?.length < 1 ? "No history":
            <MobileStepper
          variant="dots"
          steps={fullHistory.data?.length}
          position="static"
          activeStep={activeStep}
          sx={{ minWidth: 300, maxWidth: 1000, flexGrow: 50 }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep >= fullHistory.data?.length-1}>
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
    />}


        <ChakraProvider>
            <div className="Row">
                <div className="Column">
                    <select onChange={handleOnChange}>
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
                
                <CoreFlow2 initiativeData={data} initiativeName={currentInitiative.name} documentId={currentInitiative.id}
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