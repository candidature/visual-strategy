import React from 'react'

import {LABEL_STATUS, INITIATIVE_VISIBILITY, INITIATIVE_ARCHIVED} from "../../../vizue/utils/contants.js"
import {Form, redirect, useActionData, useNavigation, useOutletContext} from "react-router-dom";

import Wrapper from "../assets/wrappers/DashboardFormPage.js";
import {FormRow} from "../components/index.js";
import FormRowTextArea from "../components/FormRowTextArea.jsx";
import customFetch from "../utils/customFetch.js";
import {toast} from "react-toastify";
import {getNodeName} from "../utils/nodeUtils.js";




export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    //Below is to have client side error. We already have server side error but
    // that works only after form is submitted.
    // it may be a better experience for user to have errors before form is submitted.
    const errors = {"message": ""}

    if (data.name.length < 5) {
        errors.message = "initiative name must be at least 4 characters long";
        return errors;
    }

    try {
        const post2Data = await customFetch.post('/initiative2', data);
        console.log(post2Data.data.data._id);
        //let nodeName = getNodeName(postData.data,"INITIATIVE_NODE")
        //console.log(nodeName)
        toast.success('Initiative Created successfully!', post2Data);
        //return redirect('/dashboard/');
        //return "";
        return redirect('/dashboard/' + data.name+"?originDocumentId="+post2Data.data.data._id+"&historyDocumentId=NONE");
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return errors;
    }
};


export default function AddLabels() {

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

                    <FormRow type="text" name="name" labelText="Label name" required={true}/>

                    <FormRowTextArea labelText="Label short desc" name="description" defaultValue=""/>

                    <div className="form-row">
                        <label htmlFor="state" className="form-label">
                            Label Status
                        </label>
                        <select name="state" id="status" className="form-select"
                                >
                            {Object.keys(LABEL_STATUS).map((item) => {

                                return (
                                    <option key={item} defaultValue={item} selected={item==="ACTIVE"}>{item}</option>
                                )
                            }

                            )}
                        </select>

                    </div>

                    


                    <FormRowTextArea name="label_owner" labelText="Label Owners" defaultValue=""/>

                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'submitting' : 'submit'}
                </button>
            </Form>
        </Wrapper>
    )
}
