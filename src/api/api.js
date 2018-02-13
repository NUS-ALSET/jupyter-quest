// Validate Password function from Firebase
export const passwordValidation = (payload) => {
   const endpoint =  `http://localhost:5000/react-firebase-19d1f/us-central1/checkPassword`;
   return fetch(endpoint, {
        body: JSON.stringify(payload),
        method: 'POST', 
    })
   .then( res => res.json())
   .catch( err => err )
}   