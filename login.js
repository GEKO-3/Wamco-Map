const users = {
    'user1': 'password1',
    'user2': 'password2'
    // Add more usernames and passwords as needed
};

// document.getElementById('login-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     console.log('Attempting login with username:', username); // Debug log

//     if (users[username] && users[username] === password) {
//         console.log('Login successful'); // Debug log
//         const loginTime = new Date().getTime();
//         sessionStorage.setItem('loggedIn', 'true');
//         sessionStorage.setItem('loginTime', loginTime);
//         window.location.href = 'index.html';
//     } else {
//         console.log('Login failed'); // Debug log
//         document.getElementById('error-message').classList.remove('hidden');
//     }
// });
