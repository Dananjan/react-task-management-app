import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { loginWithEmailAndPassword } from '../../../services/userService';
import { useDispatch } from 'react-redux'
import { startLoading, stopLoading } from '../../../redux/loadingSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import styles from './Auth.module.css';

const Login: React.FC = () => {

    const dispatch = useDispatch()
    const [emailLog, setEmailLog] = useState("");
    const [passwordLog, setPasswordLog] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
 
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

    const handleLogin = async (e : React.FormEvent) => {
        e.preventDefault();

        validateEmail(emailLog);
        validatePassword(passwordLog);

        if (emailLog.length===0 || passwordLog.length===0){
            alert("Please fill all the fields.");
            return;
        }

        if (emailError || passwordError) {
            alert("Please Enter valid credientials.");
            return;
        }

        try {
            dispatch(startLoading());
            await loginWithEmailAndPassword(emailLog, passwordLog); 
            dispatch(stopLoading());         
        } catch (error) {
            //console.log(error);
            //alert('Failed to login. Please check your credentials.');
        }

    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.mainContent}>
            <div className={styles.welcomeMessage}>
                <h1>Welcome</h1>
                <h2>React Task Management App</h2>
            </div>
            <div className={styles.mainLR}>
                <div className={styles.subMainLogin}>
                    <div>
                        <form >
                            <h1 className={styles.title}>LOGIN</h1>
                            <div>
                                <input type="email" value={emailLog} placeholder='Enter Email' className={styles.fill} onChange= {(event) =>{setEmailLog(event.target.value); setEmailError('');}} onBlur={(event) => validateEmail(event.target.value)} required />
                                {emailError && <p className={styles.error}>{emailError}</p>}
                            </div>
                            <div className={styles.inputs}>
                                <input type={showPassword ? 'text' : 'password'} value={passwordLog} placeholder='Enter Password' className={styles.fill+' '+styles.pwd}  onChange={(event) => {setPasswordLog(event.target.value); setPasswordError('');}} onBlur={(event) => validatePassword(event.target.value)} required/>                              
                                <span className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                                        {showPassword ? (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEye} />
                                        )}
                                </span>
                                {passwordError && <p className={styles.error}>{passwordError}</p>}
                            </div>
                            <div className={styles.inputs}>
                                <button type="button" className={styles.authBtn} onClick={handleLogin} >Login</button>                             
                            </div>
                        </form>
                        <div className={styles.regLink}>
                            <p>Don't have an account?</p>
                            <Link to='/register'> Register Now</Link>
                        </div>    
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login