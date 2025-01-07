import { Link, Form, redirect, useNavigation, useActionData } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    //Below is to have client side error. We already have server side error but
    // that works only after form is submitted.
    // it may be a better experience for user to have errors before form is submitted.
    const errors = {"message": ""}

    if (data.password.length < 5) {
        errors.message = "Password must be at least 4 characters long";
        return errors;
    }

    try {
        await customFetch.post('/auth/login', data)
            .then(response=>{
                toast.success('Login successful');
                return redirect('/dashboard');
            })
            .catch((error)=> {
                if(error.response.status === 401) {
                    console.log(error.message)
                    toast.error(error?.message + " Did you enter write credentials!");
                    return redirect('/login');    
                }
                console.log(error.message)
                toast.error(error?.message + " check internet connection or backend service is running and database is up");
                return redirect('/login');
            });
        
    } catch (error) {
        return toast.error(error?.response?.data?.message);
        //return errors;
    }
    return redirect('/dashboard/initiatives');
};



const Login = () => {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting';

    //useAction data get us whatever is returned by action const above.
    //So you must always return from action
    const errors = useActionData();


    return (
        <Wrapper>
            <Form method="post" className="form">
                <Logo/>
                <h4>Login</h4>
                {errors && <p style={{ color: 'red' }}>{errors.message}</p>}

                <FormRow type='email' name='email'/>
                <FormRow type='password' name='password'/>


                <button type='submit' className='btn btn-block' disabled={isSubmitting}>
                    {isSubmitting ? 'logging...' : 'login'}
                </button>

                <p>New here?</p>
                <Link to="/register" className="member-btn">Register</Link>
            </Form>
        </Wrapper>
    )
}

export default Login;