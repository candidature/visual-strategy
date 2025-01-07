
import React, {useContext, useEffect, useState} from 'react'

import {toast} from "react-toastify";


import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import customFetch from "../utils/customFetch.js";
import {useLoaderData, useNavigate, useParams, useSearchParams} from "react-router-dom";


////http://localhost:5174/dashboard/init102?originDocumentId=675df7eb3cef1e7fdb0235df&historyDocumentId=NONE

export default function HistoryPoints({initiativeName, originDocumentId, fullHistory, historyDocumentId}) {

  const navigate = useNavigate();

    const theme = useTheme();

    const [history, setFullHistory] = useState(fullHistory)
    const [activeStep, setActiveStep] = useState(fullHistory.length-1);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
          
          console.log("Now exploring.. On next click"+(prevActiveStep+1))
          if(prevActiveStep<fullHistory.length) {
            //console.log(prevActiveStep);
            //console.log(fullHistory[prevActiveStep+1]._id)
            navigate(`/dashboard/${initiativeName}?originDocumentId=${originDocumentId}&historyDocumentId=${fullHistory[prevActiveStep+1]._id}`, { replace: true });

            return (prevActiveStep+1)
          } else {
            toast.error("Reached at history "+prevActiveStep);
          }
        
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
          if(prevActiveStep =>0 && prevActiveStep && fullHistory.data.length-1){
            let stepNo = fullHistory.length-1-prevActiveStep;

            navigate(`/dashboard/${initiativeName}?originDocumentId=${originDocumentId}&historyDocumentId=${fullHistory[prevActiveStep-1]._id}`, { replace: true });
        
            return (prevActiveStep - 1)
          } else {
            toast.error("Reached at history "+prevActiveStep);
          }
        });
    };


    useEffect(()=>{

      //Below code is to go to right index in the history when page refreshes!!
      //For example, you have gone back in history
      //history pointer takes you to last element by default.
      //This isn't ideal when you have gone back and feel you are on latest.

      if(historyDocumentId!=="NONE") {
          fullHistory.map((data,index)=>{
            
            if(data._id === historyDocumentId) {
              setActiveStep(index)
            }
          })
          
        }
    })
    
    return (
        <>
        {history?.length < 1 ? "No history":
            <MobileStepper
          variant="dots"
          steps={fullHistory?.length}
          position="static"
          activeStep={activeStep}
          
          sx={{ minWidth: 300, maxWidth: 1000, flexGrow: 50 }}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep >= history?.length-1}>
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
        </>
    )
}
