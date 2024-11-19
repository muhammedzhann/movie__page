const firebaseConfig = {
  apiKey: "AIzaSyCNQ7FcqoOEHi6xH3L83U02hPa6cnFF1o4",
  authDomain: "loginregister-ec3dc.firebaseapp.com",
  projectId: "loginregister-ec3dc",
  storageBucket: "loginregister-ec3dc.firebasestorage.app",
  messagingSenderId: "840174215579",
  appId: "1:840174215579:web:a5c3aa2d1d74e47afa013e"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const mockApiUrl = "https://6732d6602a1b1a4ae111108b.mockapi.io/movie/users";

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const full_name = document.getElementById('full_name').value;

  if (!validate_email(email) || !validate_password(password)) {
    alert('Email или пароль некорректны');
    return;
  }
  if (!validate_field(full_name)) {
    alert('Некорректное имя');
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      const userData = {
        userId: user.uid,
        email: email,
        full_name: full_name,
        password: password,
        last_login: Date.now()
      };

      fetch(mockApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        alert('Пользователь создан и данные сохранены!');
        window.location.href = "LOGIN.html";
      })
      .catch(error => {
        console.error('Ошибка при отправке данных на mockapi.io:', error);
        alert('Ошибка при сохранении данных на mockapi.io');
      });
    })
    .catch((error) => {
      alert(error.message);
    });
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!validate_email(email) || !validate_password(password)) {
    alert('Email или пароль некорректны');
    return;
  }

  fetch(mockApiUrl)
    .then(response => response.json())
    .then(users => {
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        alert('Добро пожаловать, ' + user.full_name + '!');
        window.location.href = "movie.html";
      } else {
        alert('');
      }
    })
    .catch(error => {
      console.error('Ошибка при проверке пользователя на mockapi.io:', error);
      alert('Ошибка при проверке пользователя на mockapi.io');
    });
}

function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  return password.length >= 6;
}

function validate_field(field) {
  return field != null && field.length > 0;
}
