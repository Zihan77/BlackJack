<template>
    <link href='https://fonts.googleapis.com/css?family=Style Script' rel='stylesheet'>
    <div class="login-page">
      <div class="content">
        <img class="cards-image" src="@/assets/cards.svg" alt="Cards Image" />
        <div class="text-content">
          <h1 class="title">Blackjack Buddy</h1>
          <div class="login-form-container">
            <form @submit.prevent="signup" class="login-form">
              <div class="input-container">
                <label for="email">Email</label>
                <input type="text" id="email" placeholder="Email" required />
              </div>
              <div class="input-container">
                <label for="username">Username</label>
                <input type="text" id="username" placeholder="Username" required />
              </div>
              <div class="input-container">
                <label for="password">Password</label>
                <input type="password" id="password" placeholder="Password" required />
              </div>
              <button type="submit" class="login-button">Sign Up</button>
              <p class="signup-text">Already have an account? <a href="/auth/login">Login</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SignupPage',
    methods: {
      signup() {
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        console.log(email)
        console.log(username)
        console.log(password)


        fetch('http://localhost:3000/api/auth/signup', { // Use your backend API URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            username,
            password,
          }),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          localStorage.setItem('isLoggedIn', 'true');
          this.$router.push('/'); 
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle errors - e.g., display error message to user
          alert(error);
        });
      },
    },
  };

  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: radial-gradient(circle, #078029, #09571F); /* Radial gradient fill */
    color: #FFF; /* White text color */
    font-family: 'Arial', sans-serif; /* Adjust as per your font */
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
  }
  
  .cards-image {
    width: 35%; /* Adjusts the size */
    height: auto; /* Maintain aspect ratio */
  }
  
  .login-form-container {
    background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Soft shadow for depth */
  }
  
  .title {
    font-family: 'Style Script';
    color: #FFD700; /* Gold-like color */
    font-size: 6rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px #000000;
    margin-bottom: 4rem; /* Adjusted margin */
    margin-top: 1rem; /* Added margin */
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
  }
  
  .input-container {
    margin-bottom: 1rem;
  }

  .input-container label {
    display: block; /* Display the label as block to ensure it takes up the full width */
    margin-bottom: 5px; /* Add margin bottom to create space between label and input */
  }
  
  .input-container input {
    padding: 0.5rem;
    border: 1px solid #DDD; /* Light gray border */
    border-radius: 4px;
    margin-top: 0.25rem;
    width: 95%; /* Ensure input takes up full width */
  }
  
  .login-button {
    padding: 1rem;
    background-color: #FFD700; /* Gold color for the button */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 1rem;
  }
  
  .login-button:hover {
    background-color: #E6C200; /* Slightly darker gold on hover */
  }
  
  .signup-text {
    color: #AAA; /* Light gray text */
    font-size: 0.75rem;
    text-align: center;
    margin-top: 1rem;
  }

  .signup-text a {
    color: white; /* Change the color of the link */
    text-decoration: underline; /* Add underline to indicate it's a link */
    cursor: pointer; /* Change cursor to pointer on hover to indicate it's clickable */
  }
  
  /* Add responsiveness to maintain the layout on different screen sizes */
  @media (max-width: 768px) {
    .cards-image {
      position: static;
      margin-bottom: 1rem;
      width: 100%; /* Full width on small screens */
    }
    
    .login-form-container {
      width: auto; /* Full width container on small screens */
      margin: 1rem;
    }
  }
  </style>
  