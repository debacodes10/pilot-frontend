import React, { useState } from 'react';
import "./../../Styles/CompanyForm/CompanyForm.css";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig.js';
import { useNavigate } from 'react-router-dom';

const CompanyForm = () => {

    const navigate = useNavigate()

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [logo, setLogo] = useState(null);
    const [manager, setManager] = useState("");
    const [manSign, setManSign] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [signPreview, setSignPreview] = useState("");

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setLogoPreview("");
        }
    };

    const handleSignChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setManSign(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSignPreview("");
        }
    };

    const uploadFile = async (file, path) => {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async () => {
        try {
            let logoUrl = "";
            let signUrl = "";

            if (logo) {
                logoUrl = await uploadFile(logo, `company-logos/${id}`);
            }

            if (manSign) {
                signUrl = await uploadFile(manSign, `manager-sign/${id}`);
            }

            const data = {
                companyId: id,
                desc: desc,
                companyName: name,
                companyLogo: logoUrl,
                manager: manager,
                managerSign: signUrl
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
                navigate("/")
                // console.log('Success:', result);
            } else {
                alert(result.message); // Display error message
            }
        } catch (error) {
            // console.error('Error:', error);
            alert('An error occurred while creating the company profile');
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
                    required
                />
            </div>
            <div className='comp-form-lower-section'>
                <div className='comp-form-title-container'>
                    <h4 className='comp-form-input-title'>
                        2. Company Name
                    </h4>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name'
                        className='comp-form-input-container'
                        required
                    />
                </div>
                <div className='comp-form-title-container'>
                    <h4 className='comp-form-input-title'>
                        3. Company Manager
                    </h4>
                    <input 
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                        placeholder='Manager'
                        className='comp-form-input-container'
                        required
                    />
                </div>
                <div className='comp-form-logo-container'>
                    <h4 className='comp-form-input-title'>
                        4. Company Logo
                    </h4>
                    <div className="comp-form-file-container">
                        <input 
                            className="comp-form-file-input" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleLogoChange}
                            required
                        />
                    </div>
                    {logoPreview && (
                        <div className='comp-form-file-preview'>
                            <img src={logoPreview} alt="Image Preview" className="comp-form-preview-img" />
                        </div>
                    )}
                </div>
                <div className='comp-form-title-container'>
                    <h4 className='comp-form-input-title'>
                        5. Manager Signature
                    </h4>
                    <input 
                        className="comp-form-file-input" 
                        type="file" 
                        accept="image/*"
                        onChange={handleSignChange}
                        required
                    />
                    {signPreview && (
                        <div className='comp-form-file-preview'>
                            <img src={signPreview} alt="Image Preview" className="comp-form-preview-img" />
                        </div>
                    )}
                </div>
            </div>
            <div className='comp-form-desc-container'>
                <h4 className='comp-form-input-title'>
                    6. Company Description
                </h4>
                <textarea 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder='Description'
                    className='comp-form-textarea'
                    required
                />
            </div>
            <div className='comp-form-submit-btn-container'>
                <button className='comp-form-submit-btn' onClick={handleSubmit}>
                    <span>Submit</span>
                </button>
            </div>
        </div>
    );
};

export default CompanyForm;
