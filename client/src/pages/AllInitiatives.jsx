import React, {createContext, useContext} from 'react'
import {InitiativeSearchComponent, InitiativeSearchResultComponent} from "../components/index.js";
import customFetch from "../utils/customFetch.js";
import * as toastr from "react-dom/test-utils";
import {toast} from "react-toastify";
import {useLoaderData} from "react-router-dom";
import InitiativesComponent from "../components/InitiativesComponent.jsx";

export const loader = async ({request})=> {
    try {
        const {data} = await customFetch.get("/flow-test")
        console.log(data)
        return data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return error;
    }
}



export default function AllInitiatives() {
    const data  = useLoaderData()
    console.log(data)

    return (
        <AllInitiativeContext.Provider value={data}>
            <div className="container">
               <div>All Initiatives</div>
                 <InitiativeSearchComponent/>
                <InitiativesComponent/>
               {/*  <InitiativeSearchComponent/>*/}
               {/*<InitiativeSearchResultComponent/>*/}
            </div>
        </AllInitiativeContext.Provider>
    )
}

//Create global context, this means variables in this context are globally visible.
const AllInitiativeContext = createContext();


//This is a custom hook, must start with use
export const useAllInitiativesContext = () => useContext(AllInitiativeContext);


//I changed it slightly from video as per recommendation from this page
//https://github.com/remix-run/react-router/discussions/10856
// with this i need not export loader and in App.jsx i need not import loader

AllInitiatives.loader = loader;