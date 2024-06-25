
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, child } from 'firebase/database';


const firebaseConfig = {
    apiKey: "AIzaSyCgk8iSm8nPKPSMTER_cuBOSirVOLdx61w",
    authDomain: "nila-17f46.firebaseapp.com",
    databaseURL: "https://nila-17f46-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nila-17f46",
    storageBucket: "nila-17f46.appspot.com",
    messagingSenderId: "335267605526",
    appId: "1:335267605526:web:931484835a9dfffefad937",
    measurementId: "G-4ZFP9GDQ7T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


export async function totalNumbers() {
    try {
        const numbersRef = ref(database, 'numbers_organic');
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
        const snapshot = await get(child(dbRef, 'numbers_organic'));

        let numbers = [];
        if (snapshot.exists()) {
            numbers = snapshot.val();
        }

        // Add the new number to the array
        numbers.push(newNumber);

        // Write the updated data back to Firebase
        await set(ref(database, 'numbers_organic'), numbers);

        console.log(`Number ${newNumber} added successfully.`);
    } catch (error) {
        console.error('Error appending number to Firebase:', error);
    }
};

// Function to check if a number exists in the Firebase Realtime Database
export const checkIfNumberExistsInFirebase = async (numberToCheck) => {
    try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'numbers_organic'));

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


