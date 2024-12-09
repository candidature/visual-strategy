// import styled from "styled-components";
import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";
import {Link} from "react-router-dom";
import {Logo} from "../components/index.js";
// const StyledBtn = styled.button`
//     font-size: 1.5rem;
//     background: red;
//     color: white;
// `




const Landing = () => {


    return (
        <Wrapper>
            <nav>
                <Logo/>
            </nav>
            <div className="container page">
                <div className="info">
                    <h1>
                        <h2>Enterprise Level <span>initiative and goals tracking </span>app</h2>
                    </h1>
                    <p>
                        Made with Intuition Heart and Taste!

                    </p>
                    <Link to={"/register"} className={"btn register-link"}>Register</Link>
                    <Link to={"/login"} className={"btn"}>Login</Link>
                </div>
                <img src={main} alt="Capabilities and Initatives" className={"img main-img"}/>

            </div>
        </Wrapper>
    )
}


export default Landing;