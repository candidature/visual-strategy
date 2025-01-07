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


export const loader = async ({params,request})=> {

    const zoomNodeName = new URL(request.url).searchParams.get('zoomNodeName');
    console.log(zoomNodeName)

    try {
        const [data, allInitiativeData] = await Promise.all([
            //await customFetch.get("/flow-test/"+params.initiative+"?zoomNodeName="+zoomNodeName),
            //localhost:5100/api/v1/initiative2/Migrate to cloud
            await customFetch.get("initiative2/"+params.initiative+"?zoomNodeName="+zoomNodeName),
            await customFetch.get("/initiative2/all-initiatives")
            //await customFetch.get("/flow-test")
        ]);
        return json({ data, allInitiativeData });
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return error;
    }
}


export default function SelectInitiative() {
    const { initiative } = useParams();

    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    //console.log(initiative);

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentInitiative, setCurrentInitiative] = useState(initiative);

    const zoomNodeName = searchParams.get("zoomNodeName");
    console.log("Matching...")
    console.log(zoomNodeName)


    const navigate = useNavigate()
    const [initiativesFromDB, setInitiativesFromDB] = useState([initiative]);
    const [toBeZoomedNode, setToBeZoomedNode] = useState()


    const {data,allInitiativeData}  = useLoaderData()

    console.log(data)
    let toBeZoomedNodeId = ""

    useEffect(() => {
        let initialInitiatives = []
        //console.log(allInitiativeData.data)
        console.log(allInitiativeData)
        allInitiativeData.data.map((document)=>{
            //console.log(document)
          document.nodes.map((node)=>{
            if(node.type==="INITIATIVE_NODE"){
                console.log(node.data.name)
                initialInitiatives.push({name: node.data.name, id: node.id});
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
    },[setCurrentInitiative])


    function handleOnChange(event){
        //console.log(event.target.value);
        setCurrentInitiative(event.target.value);
        navigate(`/dashboard/${event.target.value}`);
    }

    return (
        <>
        <MobileStepper
      variant="dots"
      steps={16}
      position="static"
      activeStep={activeStep}
      sx={{ minWidth: 700, maxWidth: 700, flexGrow: -1 }}
      nextButton={
        <Button size="small" onClick={handleNext} disabled={activeStep === 16}>
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
    />
        <ChakraProvider>
            <div className="Row">
                <div className="Column">
                    <select onChange={handleOnChange}>
                        {initiativesFromDB.map((d,key)=>
                        {   if(d.name === currentInitiative) {
                            return <option key={key} selected={true} value={d.name}>{d.name}</option>
                        }
                            return <option key={key} value={d.name}>{d.name}</option>
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
                    <CoreFlow2 initiativeData={data} initiativeName={currentInitiative}
                               toBeZoomedNodeId={toBeZoomedNode}
                               />
                </ReactFlowProvider>
        </ChakraProvider>
        </>
    )
}
SelectInitiative.loader = loader;