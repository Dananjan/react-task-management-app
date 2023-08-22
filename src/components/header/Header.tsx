import React, { useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import userImage from '../../resources/images.png';
import { fetchUserData } from '../../services/userService';
import { fetchUserImgUrl } from '../../services/userService';
import { DocumentData } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/types'; 
import  './Header.css'; 


interface User {
  firstName: string;
  lastName: string;
}


const Header:  React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userImg, setUserImg] = useState<string | undefined>(userImage);; 
  let displayName = useSelector((state: RootState) => state.user.displayName);
  let displayImage:string | undefined = useSelector((state: RootState) => state.userImg.displayImageUrl);

  useEffect(() => {
    const fetchUser = async () => {
      const userData: DocumentData = await fetchUserData();
      const userImgUrl = await fetchUserImgUrl();
      setUser(userData[0].data || null);
      setUserImg(userImgUrl);
    };
  
    fetchUser();
  }, []);
  
  if(displayName===""){
    displayName=user?.firstName+ " "+user?.lastName;
  }

  if(displayImage===""){
    displayImage=userImg;
  }
  
  return (
    <div className='main-header-container'>
      <header className="header">
        <div className="menuIcon">
          <AiOutlineMenu />
        </div>
        <div className="userInfo">
          <img src={displayImage} alt="User" className="userImage" />
          {user && (
          <span className="userName">
            {displayName}
          </span>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
