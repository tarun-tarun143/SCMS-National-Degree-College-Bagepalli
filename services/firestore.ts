import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc, where, type DocumentData } from "firebase/firestore";
import { firestoreDb } from "@/lib/firebase/client";

function dbOrThrow(){if(!firestoreDb) throw new Error("Firestore is not configured. Add Firebase environment variables first."); return firestoreDb;}
export async function getRecord<T extends DocumentData>(collectionName:string,id:string){const snap=await getDoc(doc(dbOrThrow(),collectionName,id));return snap.exists()?({id:snap.id,...snap.data()} as T & {id:string}):null;}
export async function listRecords<T extends DocumentData>(collectionName:string,field?:string,value?:string){const ref=collection(dbOrThrow(),collectionName);const q=field?query(ref,where(field,"==",value),limit(100)):query(ref,orderBy("createdAt","desc"),limit(100));const snap=await getDocs(q);return snap.docs.map(d=>({id:d.id,...d.data()} as T & {id:string}));}
export async function createRecord(collectionName:string,data:DocumentData){const ref=await addDoc(collection(dbOrThrow(),collectionName),{...data,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});return ref.id;}
export async function setRecord(collectionName:string,id:string,data:DocumentData){await setDoc(doc(dbOrThrow(),collectionName,id),{...data,updatedAt:new Date().toISOString()},{merge:true});}
export async function updateRecord(collectionName:string,id:string,data:DocumentData){await updateDoc(doc(dbOrThrow(),collectionName,id),{...data,updatedAt:new Date().toISOString()});}
