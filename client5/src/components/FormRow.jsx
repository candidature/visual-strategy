import React from 'react'

export default function FormRow({ type, name, labelText, defaultValue, required}) {
    return (
            <div className="form-row">
                <label htmlFor={name} className="form-label">
                    {labelText|| name}
                </label>
                <input type={type} id={name} name={name} className="form-input" placeholder={name}
                       defaultValue={defaultValue||''} required={required || false}/>
            </div>
    )
}
