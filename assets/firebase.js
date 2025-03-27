
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, child } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyA-74t6LJUfi1tOP2NU2VUuWoBqm0w1-Vc",
    authDomain: "sithuwiliwa-v3.firebaseapp.com",
    projectId: "sithuwiliwa-v3",
    storageBucket: "sithuwiliwa-v3.firebasestorage.app",
    messagingSenderId: "135813062413",
    appId: "1:135813062413:web:ae53f01dd09dec923a5a44",
    measurementId: "G-13LJRM10ME"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


export async function totalNumbers() {
    try {
        const numbersRef = ref(database, 'numbers_20288');
        const snapshot = await get(numbersRef);
        const numbers = snapshot.val();
        const numberOfNumbers = numbers ? Object.keys(numbers).length : 0;
        return numberOfNumbers;
    } catch (error) {
        throw error;
    }
}
// Function to append a number to the Firebase Realtime Database
export const appendNumberToFirebase = async (newNumber) => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'numbers_20288'));

        let numbers = [];
        if (snapshot.exists()) {
            numbers = snapshot.val();
        }

        // Add the new number to the array
        numbers.push(newNumber);

        // Write the updated data back to Firebase
        await set(ref(database, 'numbers_20288'), numbers);

        console.log(`Number ${newNumber} added successfully.`);
    } catch (error) {
        console.error('Error appending number to Firebase:', error);
    }
};

// Function to check if a number exists in the Firebase Realtime Database
export const checkIfNumberExistsInFirebase = async (numberToCheck) => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'numbers_20288'));

        if (snapshot.exists()) {
            const numbers = snapshot.val();
            const numberExists = numbers.includes(numberToCheck);

            /* if (numberExists) {
                console.log(`Number ${numberToCheck} exists in the database.`);
            } else {
                console.log(`Number ${numberToCheck} does not exist in the database.`);
            } */

            return numberExists;
        } else {
            console.log('Number does not exist in the database.');
            return false;
        }
    } catch (error) {
        console.error('Error checking number in Firebase:', error);
    }
};


