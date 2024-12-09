import React from 'react'

import {INITIATIVE_STATUS, INITIATIVE_VISIBILITY, INITIATIVE_ARCHIVED} from "../../../vizue/utils/contants.js"
import {Form, redirect, useActionData, useNavigation, useOutletContext} from "react-router-dom";

import Wrapper from "../assets/wrappers/DashboardFormPage";
import {FormRow} from "../components/index.js";
import FormRowTextArea from "../components/FormRowTextArea.jsx";
import customFetch from "../utils/customFetch.js";
import {toast} from "react-toastify";
import {getNodeName} from "../utils/nodeUtils.js";




export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data)
    //Below is to have client side error. We already have server side error but
    // that works only after form is submitted.
    // it may be a better experience for user to have errors before form is submitted.
    const errors = {"message": ""}

    if (data.initiativeName.length < 5) {
        errors.message = "initiative name must be at least 4 characters long";
        return errors;
    }

    try {
        const postData = await customFetch.post('flow-test', data);
        //console.log(postData.data);
        let nodeName = getNodeName(postData.data,"INITIATIVE_NODE")
        console.log(nodeName)
        toast.success('Initiative Created successfully!');
        //return redirect('/dashboard/');
        return redirect('/dashboard/' + nodeName);
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return errors;
    }
};


export default function AddInitiative() {

    const {user} = useOutletContext()
    const navigation = useNavigation()

    //useAction data get us whatever is returned by action const above.
    //So you must always return from action
    const errors = useActionData();

    const isSubmitting = navigation.state === "submitting"

    return (
        <Wrapper>

            <Form method="post" className='form'>

                <h4 className='form-title'>
                    Add Initiative
                </h4>
                {errors && <p style={{ color: 'red' }}>{errors.message}</p>}

                <div className="form-center">

                    <FormRow type="text" name="initiativeName" labelText="initiative name" required={true}/>

                    <FormRowTextArea labelText="Initiative short desc" name="initiativeDescription" defaultValue=""/>

                    <div className="form-row">
                        <label htmlFor="initiativeStatus" className="form-label">
                            Initiative Status
                        </label>
                        <select name="initiativeStatus" id="initiativeStatus" className="form-select"
                                >
                            {Object.keys(INITIATIVE_STATUS).map((item) => {
                                if(item==="NEW") {
                                    return (
                                        <option key={item} value={item} selected>{item}</option>
                                    )
                                } else {
                                        return (
                                            <option key={item} value={item}>{item}</option>
                                        )
                                    }
                                }
                            )}
                        </select>

                    </div>

                    <div className="form-row">
                        <label htmlFor="initiativeVisibility" className="form-label">
                            Initiative Visibility
                        </label>
                        <select name="initiativeVisibility" id="initiativeVisibility" className="form-select"
                                >
                            {Object.keys(INITIATIVE_VISIBILITY).map((item) => {
                                    if(item==="COMPANY") {
                                        return (
                                            <option key={item} value={item} selected>{item}</option>
                                        )
                                    } else {
                                        return (
                                            <option key={item} value={item}>{item}</option>
                                        )
                                    }
                                }
                            )}
                        </select>

                    </div>


                    <FormRowTextArea name="initiativeAccountable" labelText="Initiative Owners" defaultValue=""/>

                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'submitting' : 'submit'}
                </button>
            </Form>
        </Wrapper>
    )
}
