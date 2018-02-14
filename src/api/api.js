// Validate Password function from Firebase
export const passwordValidation = (payload) => {
   const endpoint =  `http://localhost:5000/react-firebase-19d1f/us-central1/checkPassword`;
   return fetch(endpoint, {
        body: JSON.stringify(payload), // must match 'Content-Type' header
        method: 'POST', // *GET, PUT, DELETE, etc.
    })
   .then( res => res.json())
   .catch( err => err )
}   