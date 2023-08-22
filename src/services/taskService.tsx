import { DocumentData, QuerySnapshot, addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, runTransaction, serverTimestamp, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";

export const addTask = async (docId:string,createTodo: string) => { 
    const collectionRef =  collection(firestore, `users/${docId}/todos`);
    try {
        await addDoc(collectionRef, {
        todo: createTodo,
        isChecked: false,
        timestamp: serverTimestamp()
        })
    } catch (err) {
        console.log(err);
    }
}

export const readTask = async (docId:string) => {
    const collectionRef = collection(firestore, `users/${docId}/todos`);
    const q = query(collectionRef, orderBy('timestamp'));
    try{
        const todoSnapshot:QuerySnapshot<DocumentData> | null = await getDocs(q); 
        return todoSnapshot;              
    }catch(err){
        console.log(err);
    }
}

export const updateTask = async (id: string, docId:string, todos:string[] ) => {
    const todoDocument = doc(firestore, `users/${docId}/todos`, id);
      await updateDoc(todoDocument, {
        todo: todos
      });

}

export const deleteTask = async (id: string,docId: string) => {
    try {
        if (window.confirm("Are you sure you want to delete this Task!")) {
          const documentRef = doc(firestore, `users/${docId}/todos`, id);
          await deleteDoc(documentRef)
        }
    } catch (err) {
        console.log(err);
    }
}

export const updateCheck = async (docId:string, event:any) => {
    try {
        const docRef = doc(firestore, `users/${docId}/todos`, event.target.name);
        await runTransaction(firestore, async (transaction) => {
          const todoDoc = await transaction.get(docRef);
          if (!todoDoc.exists()) {
            alert('Document does not exist!') ;
          }
          const newValue = !todoDoc.data()?.isChecked;
          transaction.update(docRef, { isChecked: newValue });
        });
        console.log('Transaction successfully committed!');
    } catch (error) {
        console.log('Transaction failed: ', error);
    }
}

