import {Link, useRouteError} from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";

const Error = () => {
    const error = useRouteError()
    console.log(error)

    if (error.status === 404) {
        return (
            <Wrapper>
            <div>
                <img src={img} alt="not found"/>
                <h3>Can't find the page you are looking for!</h3>
                <Link to="/dashboard">Back to homepage</Link>
            </div>
            </Wrapper>
        )
    } else {
        return (
            <Wrapper>
                <div>
                    <h3>Something went wrong</h3>
                </div>
                <Link to="/">Back to homepage</Link>
            </Wrapper>
        )
    }

}

export default Error;