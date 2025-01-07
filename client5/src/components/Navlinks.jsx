import React from 'react'

import {useDashboardContext} from "../pages/DashboardLayout.jsx";
import links from "../utils/links.jsx"

import {NavLink} from "react-router-dom";

export default function Navlinks(isBigSidebar) {
    const {toggleSidebar, user} = useDashboardContext()

    return (
        <div className="nav-links">
            {
                links.map((link, index) => {
                        const {text, path, icon} = link
                        return (
                            <NavLink to={path} key={text} className="nav-link"
                                     onClick={isBigSidebar?null:toggleSidebar} end>

                                        <span className="icon">
                                            {icon}
                                        </span>
                                {text}
                            </NavLink>
                        )
                    }
                )}
        </div>
    )
}
