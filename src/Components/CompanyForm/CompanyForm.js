'use server'
import React, { useState } from 'react'
import "./../../Styles/CompanyForm/CompanyForm.css"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig.js';

const CompanyForm = () => {

    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [logo, setLogo] = useState("")
    const [preview, setPreview] = useState("")

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setLogo(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            setPreview("")
        }
    }

    const handleSubmit = async () => {
        if (logo) {
            try {
                const storageRef = ref(storage, `company-logos/${id}`);
                await uploadBytes(storageRef, logo);
                const logoUrl = await getDownloadURL(storageRef);

                const data = {
                    companyId: id,
                    desc: desc,
                    companyName: name,
                    companyLogo: logoUrl
                };

                // Save data to MongoDB
                const response = await fetch('http://localhost:3005/api/company-profiles', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.status === 201) {
                    alert('Company profile created successfully');
                    console.log('Success:', result);
                } else {
                    alert(result.message); // Display error message
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the company profile');
            }
        }
    };

    return (
        <div className='comp-form-container'>
            <div className='comp-form-id-container'>
                <h4 className='comp-form-input-title'>
                    1. Company ID:
                </h4>
                <input 
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder='ID'
                    className='comp-form-input-container'
                />
            </div>
            <div className='comp-form-lower-section'>
                <div className='comp-form-logo-container'>
                    <h4 className='comp-form-input-title'>
                        2. Company Logo
                    </h4>
                    <div className="comp-form-file-container">
                        <input 
                            className="comp-form-file-input" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            required
                        />
                    </div>
                    {preview && (
                        <div className='comp-form-file-preview'>
                            <img src={preview} alt="Image Preview" className="comp-form-preview-img" />
                        </div>
                    )}
                </div>
                <div className='comp-form-title-container'>
                    <h4 className='comp-form-input-title'>
                        3. Company Name
                    </h4>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name'
                        className='comp-form-input-container'
                    />
                </div>
            </div>
            <div className='comp-form-desc-container'>
                    <h4 className='comp-form-input-title'>
                        4. Company Description
                    </h4>
                    <textarea 
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder='Description'
                        className='comp-form-textarea'
                    />
                </div>
                <div className='comp-form-submit-btn-container'>
                        <button className='comp-form-submit-btn'
                        onClick={()=>{handleSubmit()}}>
                            <span>Submit</span>
                        </button>
                    </div>
        </div>
    )
}

export default CompanyForm
