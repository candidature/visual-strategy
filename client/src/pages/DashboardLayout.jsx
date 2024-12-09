import {Navigate, Outlet, redirect, useLoaderData, useNavigate} from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import {BigSidebar, Navbar, SmallSidebar} from "../components";
import {createContext, useContext, useEffect, useState} from "react";
import customFetch from "../utils/customFetch.js";
import {toast} from "react-toastify";
import {DEFAULT_SETTINGS} from "../utils/contants.js";


const loader = async ()=> {
    try {
        const {data} = await customFetch.get("/users/current-user")
        return data;
    } catch(error){
        console.log(error);
        return redirect("/login")
    }
}

//Create gloabl context, this means variables in this context are globally visible.
export const DashboardContext = createContext();

const DashboardLayout = () => {
    const navigate = useNavigate()
    const {user} = useLoaderData()
    console.log(user)
    //temp TBD
    //const user = {name: 'john'}
    const [showSidebar, setShowSidebar] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(false)

    const toggleDarkTheme = () => {
        console.log("Toggle Dark Theme")
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }

    const logoutUser = async ()=>{
        try {
            await customFetch.get("/auth/logout")
            toast.success("Logged out!")
        } catch(error){
            toast.error(error?.response?.data?.message)
        }
        navigate("/")
        console.log("Logout user")
    }



    return (
        <DashboardContext.Provider value={{user,
        showSidebar,isDarkTheme,toggleDarkTheme,toggleSidebar,logoutUser}}>
        <Wrapper>

            <main className="dashboard">
                <SmallSidebar/>
                <BigSidebar/>
                <div>
                    <Navbar/>
                    <div className="dashboard-page">
                        <Outlet context={{user}}/>
                    </div>
                </div>
            </main>
        </Wrapper>
        </DashboardContext.Provider>
    )
}

//This is a custom hook, must start with use
export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;

//I changed it slightly from video as per recommendation from this page
//https://github.com/remix-run/react-router/discussions/10856
// with this i need not export loader and in App.jsx i need not import loader

DashboardLayout.loader = loader;