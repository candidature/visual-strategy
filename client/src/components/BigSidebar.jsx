import Wrapper from "../assets/wrappers/BigSidebar";
import {useDashboardContext} from "../pages/DashboardLayout.jsx";
import Logo from "./Logo.jsx";
import Navlinks from "./Navlinks";

const BigSidebar = () => {
    const {showSidebar} = useDashboardContext()

    return (
        <Wrapper>
            <div className={showSidebar? 'sidebar-container': 'sidebar-container show-sidebar'}>
                <div className="content">
                    <header>
                        <Logo/>
                    </header>
                    <Navlinks isBigSidebar/>
                </div>

            </div>

        </Wrapper>
    )
}

export default BigSidebar;