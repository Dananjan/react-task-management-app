import React, {useState } from 'react'
import {Link} from 'react-router-dom';
import { signUpWithEmailAndPassword } from '../../../services/userService';
import { useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../../../redux/loadingSlice';
import styles from './Auth.module.css';

const Register: React.FC = () => {

    const dispatch = useDispatch()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword,setRePassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstNameError, setFirstNameError] = useState('');    
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [rePasswordError,setRePasswordError] = useState('');
    const [samePwdError, setSamePwdError ] = useState('');

    const validateFirstName = (fName:string) => {
        if (fName.length === 0){
            setFirstNameError('First Name is required');
        } else {
            setFirstNameError('');
        }
    }
 
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.length === 0){
            setEmailError('Email is required');
        } else {
            if (!emailRegex.test(email)) {
                setEmailError('Please enter a valid email');
            } else {
                setEmailError('');
            }
        }
    };
    
    const validatePassword = (password: string) => {
        if(password.length === 0){
            setPasswordError('Password is required');
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
        } else {
            setPasswordError('');
        }
    };

    const validateRePassword = (rePwd: String) => {
        if(rePwd.length === 0){
            setRePasswordError('Password is required');
        } else if (rePwd.length < 6) {
            setRePasswordError('Password must be at least 6 characters');
        } else {
            setRePasswordError('');
        }

        if (password!==rePassword){
            setSamePwdError('Passwords are not same');
        } else {
            setSamePwdError('');
        }
    }

    const handleRegister = async (e : React.FormEvent) =>{
        e.preventDefault();

        validateFirstName(firstName);
        validateEmail(email);
        validatePassword(password);
        validateRePassword(rePassword);

        if (firstName.length===0 || email.length===0 || password.length===0 || rePassword.length===0){
            alert("Please fill all the fields.");
            return;
        }

        if (firstNameError || emailError || passwordError || rePasswordError ) {
            alert("Please Enter valid credientials.")
            return;
        }

        if (samePwdError){
            alert("Password and RePassword field should be same.")
            return;
        }

        try {
            dispatch(startLoading());
            await signUpWithEmailAndPassword(firstName, lastName, email, password);
            dispatch(stopLoading());
        } catch (error) {
            //console.log(error);
            //alert('Failed to register. Please try again.');
        }

    };
    
    return (
        <div className={styles.mainContent}>
            <div className={styles.welcomeMessage}>
                <h1>Welcome</h1>
                <h2>React Task Management App</h2>
            </div>
            <div className={styles.mainLR}>
                <div className={styles.subMainReg}>
                    <div>
                        <form>
                            <h1 className={styles.title}>REGISTER</h1>
                            <div>
                                <input type="text" placeholder='Enter first Name' className={styles.fill} value={firstName} onChange={(e) => {setFirstName(e.target.value); setFirstNameError('');}} onBlur={(event) => validateFirstName(event.target.value)} required />
                                {firstNameError && <p className={styles.error}>{firstNameError}</p>}                                
                            </div>
                            <div className={styles.inputsReg}>
                                <input type="text" placeholder='Enter Last Name' className={styles.fill} value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                            </div>
                            <div className={styles.inputsReg}>
                                <input type="email" placeholder='Enter Email' className={styles.fill} value={email} onChange= {(event) =>{setEmail(event.target.value); setEmailError('');}} onBlur={(event) => validateEmail(event.target.value)} required />
                                {emailError && <p className={styles.error}>{emailError}</p>}
                            </div>
                            <div className={styles.inputsReg}>             
                                <input type="password" placeholder='Enter New Password' className={styles.fill} value={password} onChange={(event) => {setPassword(event.target.value); setPasswordError('');}} onBlur={(event) => validatePassword(event.target.value)} required />
                                {passwordError && <p className={styles.error}>{passwordError}</p>}
                            </div>
                            <div className={styles.inputsReg}>
                                <input type="password" placeholder='Retype New Password' className={styles.fill} value={rePassword} onChange={(event) => {setRePassword(event.target.value); setRePasswordError(''); setSamePwdError('');}} onBlur={(event) => validateRePassword(event.target.value)} required />
                                {rePasswordError && <p className={styles.error}>{rePasswordError}</p>}
                                {samePwdError && <p className={styles.error}>{samePwdError}</p>}
                            </div>
                            <div className={styles.inputsReg}>
                                <button type="submit" onClick={handleRegister} className={styles.authBtn}>Register</button>
                            </div>
                        </form>
                        <div className={styles.regLink}>
                            <p>Already have an account?</p><Link to='/login'>Go to Login</Link>
                        </div>            
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
