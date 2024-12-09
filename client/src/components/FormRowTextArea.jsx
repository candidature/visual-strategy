import React from 'react'

export default function FormRowTextArea({ name, labelText, defaultValue , required}) {
    return (
            <div className="form-row">
                <label htmlFor={name} className="form-label">
                    {labelText|| name}
                </label>
                <textarea id={name} name={name} className="form-input" placeholder={name}
                       defaultValue={defaultValue||''} required={required || false}/>
            </div>
    )
}
