import React, { useState, FormEvent } from 'react';
import { auth } from '../../../firebase';
import { User } from 'firebase/auth';
import {  DocumentData } from 'firebase/firestore';
import { fetchUserData } from '../../../services/userService';
import { resetUserPassword } from '../../../services/userService';
import { useDispatch } from 'react-redux';
import { startLoading, stopLoading } from '../../../redux/loadingSlice';
import lockImage from '../../../resources/lock_image.jpg';
import 'bootstrap/dist/css/bootstrap.css';
import './PasswordReset.css';



const PasswordReset: React.FC=() => {

    const dispatch = useDispatch();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPwdError, setOldPwdError] = useState('');
    const [newPwdError, setNewPwdError] = useState('');
    const [rePwdError,setRePwdError] = useState('');
    const [samePwdError, setSamePwdError ] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    

    const handleOldPasswordChange = (e: FormEvent<HTMLInputElement>) => {
        setOldPassword(e.currentTarget.value);
    };

    const handleNewPasswordChange = (e: FormEvent<HTMLInputElement>) => {
        setNewPassword(e.currentTarget.value);
    };

    const handleConfirmPasswordChange = (e: FormEvent<HTMLInputElement>) => {
        setConfirmPassword(e.currentTarget.value);
    };

    const validateOldPassword = (oldPwd: string) => {
        if(oldPwd.length === 0){
            setOldPwdError('Password is required');
        } else {
            setOldPwdError('');
        }
    };

    const validateNewPassword = (newPwd: string) => {
        if(newPwd.length === 0){
            setNewPwdError('Password is required');
        } else if (newPwd.length < 6) {
            setNewPwdError('Password must be at least 6 characters');
        } else {
            setNewPwdError('');
        }
    };

    const validateRePassword = (confirmPwd: String) => {
        if(confirmPwd.length === 0){
            setRePwdError('Password is required');
        } else if (confirmPwd.length < 6) {
            setRePwdError('Password must be at least 6 characters');
        } else {
            setRePwdError('');
        }

        if (newPassword !== confirmPassword){
            setSamePwdError('Passwords are not same');
        } else {
            setSamePwdError('');
        }
    }

    const handleClear = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setOldPwdError('');
        setNewPwdError('');
        setRePwdError('');
        setSamePwdError('');
        setSuccessMessage('');
        setErrorMessage('');
    }

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();

        validateOldPassword(oldPassword);
        validateNewPassword(newPassword);
        validateRePassword(confirmPassword);

        if ( oldPassword.length===0 || newPassword.length===0 || confirmPassword.length===0 ){
            setErrorMessage("Please fill all the fields.");
            return;
        }

        if (oldPwdError || newPwdError || rePwdError ) {
            setErrorMessage("Please Enter valid credientials.")
            return;
        }

        if (samePwdError){
            setErrorMessage("New Password and Re New Password field should be same.")
            return;
        }

        const userData: DocumentData = await fetchUserData();
        const userEmail = userData[0].data.email;

        dispatch(startLoading());
        
        try {
            const user: User | null = auth.currentUser;
            if (user !== null) { 

                await resetUserPassword(user, userEmail, oldPassword, newPassword);

                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setSuccessMessage('Password successfully reset.');
                setErrorMessage('');
                setSamePwdError('');
                dispatch(stopLoading());
            }
        } catch (error) {
            setErrorMessage('Failed to reset password. Please check your old password.');
            setSuccessMessage('');
            dispatch(stopLoading());
        }
    };


    return(
        <div className='my-component-container'>
            <div className="position">
                <div className="container align bootstrap" >
                    <h2>Password Reset</h2>
                    <hr />
                    <br />
                    <div className="row">
                    
                        <div className="col-md-3">
                            <div className="text-center">
                                <img src={ lockImage } className="avatar " alt="Lock" />
                            </div>
                        </div>
                                                
                        <div className="col-md-7 personal-info">
                            {successMessage && <p className='success-msg'>{successMessage}</p>}
                            {errorMessage && <p className='error-msg'>{errorMessage}</p>}
                            <form className="form-horizontal profile-Form" >                  
                                <div className="form-group">
                                <label  className="col-lg-4 control-label">Old Password:</label>
                                    <div className="col-lg-8">
                                        <input type="password" className="form-control" value={ oldPassword } onChange={ handleOldPasswordChange } onBlur={(e) => validateOldPassword(e.target.value)} required />
                                        {oldPwdError && <p className='error'>{oldPwdError}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-lg-4 control-label">New Password:</label>
                                    <div className="col-lg-8">
                                        <input type="password" className="form-control" value={ newPassword } onChange={ handleNewPasswordChange } onBlur={(e) => validateNewPassword(e.target.value)} required />
                                        {newPwdError && <p className='error'>{newPwdError}</p>}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label  className="col-lg-4 control-label"> Re New Password:</label>
                                    <div className="col-lg-8">
                                        <input type="password" className="form-control" value={ confirmPassword } onChange={ handleConfirmPasswordChange } onBlur={(e) => validateRePassword(e.target.value)} required />
                                        {rePwdError && <p className='error'>{rePwdError}</p>}
                                        {samePwdError && <p className='error'>{samePwdError}</p>}
                                    </div>
                                </div>
                                <br /><br />
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <div className="text-right">
                                            <button type="button" className="btn btn-primary" onClick= { handleResetPassword }>Update</button>
                                            <button type="button" className="btn btn-primary" onClick= { handleClear }>Cancel</button>	
                                        </div>
                                    </div>
                                </div>
                            </form>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default PasswordReset;


