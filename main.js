function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("https://6732d6602a1b1a4ae111108b.mockapi.io/movie/users")
    .then(response => response.json())
    .then(users => {

      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        localStorage.setItem("full_name", user.full_name);  
        
        window.location.href = "movie.html";  
      } else {
        alert("Пользователь не найден. Проверьте email и пароль.");
      }
    })
    .catch(error => {
      console.error("Ошибка при проверке пользователя на mockapi.io:", error);
      alert("Ошибка при проверке пользователя на mockapi.io");
    });
}

window.onload = function() {
  const fullName = localStorage.getItem("full_name");

  if (fullName) {
    document.getElementById("full_name").textContent = fullName;
  } else {
    document.getElementById("full_name").textContent = "Гость";
  }
};
console.log(localStorage.getItem("full_name"));


var swiper = new Swiper(".home", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});
var swiper = new Swiper(".coming-container", {
  spaceBetween: 20,
  loop: true,
  centeredSlides: true,
  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },
  breakpoints: {
      0: {
          slidesPerView: 2,
      },
      568: {
          slidesPerView: 3,
      },
      768: {
          slidesPerView: 4,
      },
      968: {
          slidesPerView: 5,
      },
  }
});


document.querySelectorAll('.rating-select').forEach(select => {
  select.addEventListener('change', (event) => {
      const movieId = event.target.id.split('-')[1];
      const rating = event.target.value; 
      
      console.log(`Movie ID: ${movieId}, Rating: ${rating}`); 
  });
});

