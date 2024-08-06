'use client';
import React, { useState, useEffect }  from 'react';
import { collection, addDoc, getDoc, querySnapshot, query, onSnapshot, deleteDoc, doc } from "firebase/firestore"; 
import { db } from './firebase';
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseConfig } from './firebase';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Analytics if supported
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      // You can add any analytics setup code here
    }
  }).catch((error) => {
    console.error("Firebase Analytics is not supported in this environment:", error);
  });
}



export default function Home() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0 });
  // Add Items to Database
  const addItem = async(e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity != 0) {
      // setItems([...items, newItem]);
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        quantity: newItem.quantity
      });
      setNewItem({ name: '', quantity: 0 });
      
    }
  }
  
  // Read Items from Database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(),id: doc.id})
      });
      setItems(itemsArr);

      // Calculate Total
      const calculateTotal = () => { 
        const totalItems = itemsArr.reduce((sum, item) => 
        sum + parseFloat(item.quantity)
      , 0);
      setTotal(totalItems);
      }
    
    calculateTotal();
    return () => unsubscribe();
  });

  }, []);

  // Delete Items from Database
  const deleteItem = async(id) => {
    await deleteDoc(doc(db, 'items', id));
  }


  // Delete Items from Database
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 font-bold text-center">Pantry Tracker</h1>
        <div className="bg-slate-800 p-5 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input 
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="col-span-3 p-3 border" 
            type="text" 
            placeholder="Entern Item" />

            <input 
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            className="col-span-2 p-3 border mx-3 " 
            type="number" 
            placeholder="Entern Quantity" />

            <button
            onClick={addItem} 
            className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" 
            type="submit">Add Item</button>
          </form>
          <ul>
            {items.map((item, index) => (
              <li key={index} className="my-4 w-full flex justify-between bg-slate-950 text-white">
                <div className='p-4 w-full flex justify-between'>
                <span className='capitalize'>{item.name}</span>
                <span>{item.quantity}</span>
                </div>
                <button onClick= {() => deleteItem(item.id)} className='ml-8 p-4 border-l-2 border-s-slate-900 hover:bg-slate-900 w-16'>X</button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? ('') : (
            <div className='flex justify-between p-3 text-white'>
              <span>total</span>
              <span>{total}</span>
              </div>
          )}
        </div>
      </div>
    </main>
  );
}
