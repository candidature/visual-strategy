import logo from '../assets/images/vs3.png';
import {Link} from "react-router-dom";

const Logo = () => {
    return (
        <Link to={"/"}><img src={logo} alt="Logo" className="logo" /></Link>
    )
}

export default Logo;