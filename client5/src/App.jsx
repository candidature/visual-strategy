import React from 'react'
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import {
    HomeLayout, Landing, Register, Login, Logout, DashboardLayout, Error,
    Profile, Admin, Stats, SelectInitiative5,SelectObjective
} from './pages/index.js'
import {action as registerAction } from "./pages/Register.jsx";
import {action as loginAction } from "./pages/Login.jsx";

import {action as addAction } from "./pages/AddInitiative.jsx";

import AllInitiatives, { loader } from "./pages/AllInitiatives.jsx";
import AddInitiative from "./pages/AddInitiative.jsx";
import CoreFlow5 from "./pages/CoreFlow5.jsx";
import AddLabels from './pages/AddLabels.jsx';
//import {loader as dashboardLoader} from "./pages/DashboardLayout.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout/>,
        errorElement: <Error/>,
        children: [
            {
                index: true,
                path: "/",
                element: <Landing/>
            },
            {
                path: "register",
                element: <Register/>,
                action: registerAction
            },
            {
                path: "login",
                element: <Login/>,
                action: loginAction
            },
            {
               path: "logout",
               element: <Logout/>
            },
            {
                path: "dashboard",
                element: <DashboardLayout/>,
                loader: DashboardLayout.loader,
                children:[

                    {
                        path: "/dashboard/:initiative",
                        index: true,
                        element: <SelectInitiative5/>,
                        loader: SelectInitiative5.loader,
                        
                    },
                    {
                        path: "/dashboard/:initiative/objective/:objectiveId",
                        index: true,
                        element: <SelectObjective/>,
                        loader: SelectObjective.loader,
                        
                    },
                    {
                        path: "initiatives",
                        element: <AllInitiatives/>,
                        loader: AllInitiatives.loader
                    },
                    {
                        element: <AddInitiative/>,
                        path: "addInitiative",
                        action: addAction

                    },
                    {
                        element: <AddLabels/>,
                        path: "addLabels",
                        action: addAction

                    },
                    {
                        path: "admin",
                        element: <Admin/>
                    },
                    {
                        path: "profile",
                        element: <Profile/>

                    },
                    {
                        path: "stats",
                        element: <Stats/>
                    }
                ]
            },
        ]
    },

]);

function App() {
    return (
        <RouterProvider router={router}/>
    )
}

export default App
