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

    const originDocumentId = new URL(request.url).searchParams.get('originDocumentId');
    
    try {
        const [initialData, fullHistoryData] = await Promise.all([
            await customFetch.get("initiative2/"+params.initiative),
            await customFetch.get("/history/"+originDocumentId)
        ]);

        //console.log(fullHistory)
        fullHistoryData.data.push(initialData.data)
        let initialData2 = initialData.data
        fullHistoryData.data.map((d)=>{
          //console.log(d)
        })

        //console.log(fullHistory)

        return json({ fullHistoryData});
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return error;
    }
}


export default function SelectObjective() {

  const [query, setQuery] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const historyDocumentId = searchParams.get('historyDocumentId');


    const { initiative, objectiveId } = useParams();

    const theme = useTheme();

    const {fullHistoryData} = useLoaderData()
    const [fullHistory, setFullHistory]  = useState(fullHistoryData)

  
    // useEffect(() => {

    //   console.log("fullHistory"+JSON.stringify(fullHistory.data[fullHistory.data.length-1]._id))
    //   //console.log("fullHistory"+JSON.stringify(fullHistory.fullHistory.data[0].nodes))
    //   console.log("fullHistory"+JSON.stringify(fullHistory.data[fullHistory.data.length-1].nodes))

    //   console.log("fullHistory"+fullHistory.data[fullHistory.data.length-1].nodes[0].data.name)


    // })


    return (
        <>
        
       <HistoryPoints fullHistory={fullHistory.data}
       initiativeName={fullHistory.data[fullHistory.data.length-1].nodes[0].data.name} 
       originDocumentId={fullHistory.data[fullHistory.data.length-1]._id} historyDocumentId={historyDocumentId}/>

        <ChakraProvider>
            
                <ReactFlowProvider>
                
                <CoreFlow5 key={Date.now()} initiativeName={fullHistory.data[fullHistory.data.length-1].nodes[0].data.name} 
                                originDocumentId={fullHistory.data[fullHistory.data.length-1]._id}
                                objectiveId={objectiveId}
                                historyDocumentId={historyDocumentId}
                />

                
                </ReactFlowProvider>
        </ChakraProvider>
        </>
    )
}
SelectObjective.loader = loader;