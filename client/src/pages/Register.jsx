import {Form,Link, redirect, useNavigation} from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import {FormRow, Logo} from "../components";
import customFetch from "../utils/customFetch.js";
import { toast } from 'react-toastify';

export const action = async ({request}) => {
    const formData = await request.formData()
    console.log(formData)
    const data = Object.fromEntries(formData)
    console.log(data)

    try {
        await customFetch.post('auth/register', data)
        toast.success('Successfully registered!')
        return redirect("/login")
    } catch(err) {
        toast.error(err?.response?.data?.message)
        console.error(err);
        return err
    }

}

const RegisterUser = () => {
    const navigation = useNavigation();
    console.log(navigation);
    const isSubmitting = navigation.state === 'submitting'
    return (
        <Wrapper>
        <Form method="post" className="form">
            <Logo/>
            <h4>Register</h4>
            <FormRow type='text' name='name' />
            <FormRow type='email' name='email' />
            <FormRow type='password' name='password'/>

            <button type="submit" className="btn btn-block" disabled={isSubmitting}>
                {isSubmitting? 'Submitting...': 'Submit'}
            </button>
            <p>Already a member?</p>
            <Link to="/login" className="member-btn">Login</Link>
        </Form>
        </Wrapper>
    )
}

export default RegisterUser;