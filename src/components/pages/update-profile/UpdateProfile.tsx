import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { DocumentData } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setDisplayName } from '../../../redux/userNameSlice';
import { setDisplayImageUrl } from '../../../redux/userImageSlice';
import { startLoading, stopLoading } from '../../../redux/loadingSlice';
import userImage from '../../../resources/images.png';
import { fetchUserData, fetchUserImgUrl, updateUserName, updateUserImage } from '../../../services/userService';
import 'bootstrap/dist/css/bootstrap.css';
import './UpdateProfile.css'; 



const ProfileUpdate: React.FC = () => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email,setEmail] =useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string>('');
  const [userImg, setUserImg] = useState<string | undefined>(userImage);; 


  useEffect(() => {
    const getUserData = async () => {
      const userData: DocumentData = await fetchUserData();
      const user = userData[0].data;
      setDocumentId(userData[0].docId);
      setFirstName(user?.firstName || '');
      setLastName(user?.lastName || '');
      setEmail(user?.email || '');
    }

    const getUserImg = async () => {
      const userImgUrl = await fetchUserImgUrl();
      setUserImg(userImgUrl);
    }

    getUserData();
    getUserImg();   
}, [documentId]);

  
  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(startLoading());
    await updateUserName(firstName , lastName, documentId);
    dispatch(setDisplayName(`${firstName} ${lastName}`));
    dispatch(stopLoading());
  };

  const updateImg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(startLoading());
    const imageURL:string = await updateUserImage(image, documentId, ) || '';
    setUserImg(imageURL);
    dispatch(setDisplayImageUrl(imageURL));
    dispatch(stopLoading());
    console.log('User Image updated successfully');   
  }
  
  

  return (
    <div className="my-component-container">
      <div className="position">
        <div className="container align bootstrap" >
          <h2>Update Profile</h2>
          <hr/>
          <br/>
          <div className="row">
            <div className="col-md-3">
              <div className="text-center">
                <img src={userImg} alt="User" className="avatar" />
                <h6>Upload a different photo...</h6>
                <form onSubmit={updateImg}>
                  <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} required/>
                  <br />
                  <button type="submit" className="btn btn-primary">Update Image</button>
                </form>
              </div>
            </div>
         
            <div className="col-md-7 personal-info">
              <h5 className="title">Update User Details</h5>

              <br />

              <form onSubmit={handleSubmit} className="form-horizontal profileForm">
                <div className="form-group">
                  <label className="col-lg-3 control-label">First name:</label>
                  <div className="col-lg-8">
                    <input type='text' value={firstName} onChange={handleFirstNameChange} className="form-control" required />
                  </div> 
                </div>
                <div className="form-group">
                  <label  className="col-lg-3 control-label">Last name:</label>
                  <div className="col-lg-8">
                    <input type="text" value={lastName} onChange={handleLastNameChange} className="form-control" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-lg-3 control-label">Email:</label>
                  <div className="col-lg-8">
                    <input value={email} className="form-control" disabled />
                  </div>
                </div>      
                <br />
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="text-right">
                      <button type="submit" className="btn btn-primary">Update Info</button>
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
};

export default ProfileUpdate;

// const fetchUserData = async () => {
  //   const user: User | null = auth.currentUser;
  //   if (user) {
  //     const querySnapshot = await getDocs(collection(firestore, 'users'));
  //     querySnapshot.forEach((doc) => {
  //       if (doc.data().uid === user.uid) {
  //         setDocumentId(doc.id);
  //         setFirstName(doc.data().firstName);
  //         setLastName(doc.data().lastName);
  //         setEmail(doc.data().email);
  //       }
  //     });
  //   } 
  // };