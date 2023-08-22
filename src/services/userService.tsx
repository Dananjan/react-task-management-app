import { collection, query, where, getDocs, DocumentData, addDoc, doc,  updateDoc } from 'firebase/firestore';
import { firestore, auth, signInWithEmailAndPassword, storage } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, User, updateProfile } from 'firebase/auth';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import userImage from '../resources/images.png';



export const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
    } catch (error) {
      console.log(error);
      alert('Failed to login. Please check your credentials.');
    }
}

export const signUpWithEmailAndPassword = async (firstName:string, lastName:string, email: string, password: string) => {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        if (user) {
            await sendEmailVerification(user);  
            
            alert('Verification email sent. Please check your inbox.');

            await addDoc(collection(firestore, 'users'), {
                firstName,
                lastName,
                uid: user.uid,
                email,
            });
        }    
    } catch (error) {
        console.log(error);
        alert('Failed to register. Please try again.');
    }
}

export const reSendVerificationMail = async () => {
  try {
    await sendEmailVerification(auth.currentUser as User);
    alert('Verification email sent. Please check your inbox.');
  } catch (error) {
    console.log(error);
    alert('Failed to send verification email. Please try again.');
  }
}

export const fetchUserData = async () => {
  const q = query(collection(firestore, 'users'), where('uid', '==', auth.currentUser?.uid));
  const querySnapshot = await getDocs(q);
  
  const userData: { docId: string; data: DocumentData }[] = [];

  querySnapshot.forEach((doc) => {
    userData.push({ docId: doc.id, data: doc.data() });
  });

  return userData;
}

export const fetchUserImgUrl = async () => {
  const user: User | null = auth.currentUser;
  if (user) {
    const storageRef = ref(storage, `${user.uid}/profileImage.jpg`);
    try {
      const imageURL = await getDownloadURL(storageRef);
      return imageURL;
    } catch (error) {
      console.log('Error fetching user image:', error); 
      return userImage;
    }
  }
}

export const updateUserName = async (firstName:string, lastName:string, documentId:string ) => {
    const user: User | null = auth.currentUser;
    if (user && documentId) {
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      const userDocRef = doc(firestore, 'users', documentId);
      await updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName
      });
      console.log('User Name updated successfully');
    }
}

export const updateUserImage = async (image:File|null, documentId:string) => {
  const user: User | null = auth.currentUser;
  if (user && documentId) {
     if (image) {
         const storageRef = ref(storage, `${user.uid}/profileImage.jpg`);
         await uploadBytes(storageRef, image);
         const imageURL = await getDownloadURL(storageRef);
         return imageURL;
     }
  }
}

export  const resetUserPassword = async (user: User, userEmail: string, oldPassword:string, newPassword:string) => {
  const credential = EmailAuthProvider.credential(userEmail,oldPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
  const auth = getAuth();
  await sendPasswordResetEmail(auth, userEmail);
}

