import Wrapper from "../assets/wrappers/SmallSidebar";
import {useDashboardContext} from "../pages/DashboardLayout.jsx";
import {FaTimes} from "react-icons/all.js";
import Logo from "./Logo.jsx";
import links from "../utils/links"
import {NavLink} from "react-router-dom";
import Navlinks from "./Navlinks.jsx";

const SmallSidebar = () => {
    const {showSidebar, toggleSidebar} = useDashboardContext()

    return (
        <Wrapper>
            <div className={showSidebar? "sidebar-container show-sidebar": 'sidebar-container'}>
                <div className="content">
                    <button type="button" className="close-btn" onClick={toggleSidebar}>
                        <FaTimes/>
                    </button>
                    <header>
                        <Logo/>
                    </header>
                    <Navlinks/>

                </div>
            </div>
        </Wrapper>
    )
}

export default SmallSidebar;