import { db } from "./FirebaseConfig";
import { collection, getDocs, getDoc, query, where, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

/**
 * Fetch all documents from a collection.
 * @param {string} collectionName - The name of the collection to fetch from.
 * @returns {Promise<Array>} - A promise that resolves to an array of documents.
 */
export const fetchAllDocuments = async (collectionName) => {
  try {
    const colRef = collection(db, collectionName);
    const querySnapshot = await getDocs(colRef);
    const documents = querySnapshot.docs.map((doc) => ({ docId: doc.id, ...doc.data(), w_pin: '***' }));
    return documents;
  } catch (error) {
    console.error('Error fetching documents: ', error);
    throw new Error(error.message);
  }
};

/**
 * Fetch a single document with a specific condition.
 * @param {string} collectionName - The name of the collection to fetch from.
 * @param {string} field - The field to apply the condition to.
 * @param {string} value - The value to match the field against.
 * @returns {Promise<Object>} - A promise that resolves to a single document.
 */
export const fetchDocumentWithCondition = async (collectionName, field, value) => {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const document = querySnapshot.docs[0];
    return { docId: document.id, ...document.data(), w_pin: '***' };
  } catch (error) {
    console.error('Error fetching document: ', error);
    throw new Error(error.message);
  }
};


/**
 * Fetch all documents with a specific condition.
 * @param {string} collectionName - The name of the collection to fetch from.
 * @param {string} field - The field to apply the condition to.
 * @param {string} value - The value to match the field against.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of matching documents.
 */
export const fetchDocumentsWithCondition = async (collectionName, field, value) => {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    // Map through all matching documents and create an array
    const documents = querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(),
    }));

    return documents;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    throw new Error(error.message);
  }
};

/**
 * Fetch a single document by its ID.
 * @param {string} collectionName - The name of the collection to fetch from.
 * @param {string} documentId - The ID of the document to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the document.
 */
export const fetchDocumentById = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const documentSnapshot = await getDoc(docRef);
    if (!documentSnapshot.exists()) {
      return null;
    }
    return { docId: documentSnapshot.id, ...documentSnapshot.data(), w_pin: '***' };
  } catch (error) {
    console.error('Error fetching document by ID: ', error);
    throw new Error(error.message);
  }
};

/**
 * Add a new document to a collection.
 * @param {string} collectionName - The name of the collection to add to.
 * @param {Object} data - The data to add to the collection.
 * @returns {Promise<string>} - A promise that resolves to the ID of the added document.
 */
export const addDocument = async (collectionName, data) => {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error(error.message);
  }
};

/**
 * Delete a document from a collection by its ID.
 * @param {string} collectionName - The name of the collection.
 * @param {string} documentId - The ID of the document to delete.
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document: ', error);
    throw new Error(error.message);
  }
};

/**
 * Update a document in a collection.
 * @param {string} collectionName - The name of the collection.
 * @param {string} documentId - The ID of the document to update.
 * @param {Object} data - The new data to update the document with.
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating document: ', error);
    throw new Error(error.message);
  }
};

/**
 * Delete all documents in a collection.
 * Note: Firestore doesn't support direct collection deletion. This function deletes documents one by one.
 * @param {string} collectionName - The name of the collection.
 * @returns {Promise<void>}
 */
export const deleteCollection = async (collectionName) => {
  try {
    const colRef = collection(db, collectionName);
    const querySnapshot = await getDocs(colRef);

    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting collection: ', error);
    throw new Error(error.message);
  }
};

/**
 * Set up a real-time listener for documents in a collection based on a specific condition.
 * @param {string} collectionName - The name of the collection to listen to.
 * @param {string} field - The field to apply the condition to.
 * @param {string} value - The value to match the field against.
 * @param {function} callback - The callback function to call with the updated documents.
 * @returns {function} - A function to unsubscribe from the listener.
 */
export const onSnapshotWithCondition = (collectionName, field, value, callback) => {
  const colRef = collection(db, collectionName);
  const q = query(colRef, where(field, "==", value));

  const save = onSnapshot(q, (querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(), 
      w_pin: '***'
    }));
    callback(documents);
  }, (error) => {
    console.error('Error listening to real-time updates: ', error);
  });

  return save;
};

/**
 * Set up a real-time listener for all documents in a collection.
 * @param {string} collectionName - The name of the collection to listen to.
 * @param {function} callback - The callback function to call with the updated documents.
 * @returns {function} - A function to unsubscribe from the listener.
 */
export const onSnapshotWithoutCondition = (collectionName, callback) => {
  const colRef = collection(db, collectionName);

  const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => ({
      docId: doc.id,
      ...doc.data(), 
      w_pin: '***'
    }));
    callback(documents);
  }, (error) => {
    console.error('Error listening to real-time updates: ', error);
  });

  return unsubscribe;
};
