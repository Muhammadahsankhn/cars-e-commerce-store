const signupForm = document.getElementById('signupform');
const loginForm = document.getElementById('loginform');
const showLogin = document.getElementById('showLogin');
const showSignup = document.getElementById('showSignup');

// Hide All forms initially
loginForm.style.display = 'none';
signupForm.style.display = 'block';



showLogin.addEventListener('click', function (event) {
    event.preventDefault();
    loginForm.style.display = 'block';
    signupForm.style.display = 'none'; 
});


showSignup.addEventListener('click', function (event) {
    event.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

