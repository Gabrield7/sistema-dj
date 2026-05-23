const API_URL = "https://sistema-dj.onrender.com"; 

document
.getElementById("registerForm")
.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (response.ok) {
    alert("User registered successfully!");
  } else {
    alert("Error registering user");
  }
});

document
.getElementById("loginForm")
.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("token", data.token);
    alert("Login successful!");
  } else {
    alert("Login failed: " + data.message);
  }
});

document
.getElementById("getMusicasBtn")
.addEventListener("click", async () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    alert("Please login first!");
    return;
  }

  const response = await fetch(`${API_URL}/musicas`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const musicas = await response.json();

  if (response.ok) {
    const musicasList = document.getElementById("musicasList");
    musicasList.innerHTML = "";

    musicas.forEach((musica) => {
      const li = document.createElement("li");
      li.textContent = `${musica.titulo} - ${musica.artista}`;
      musicasList.appendChild(li);
    });
  } else {
    alert("Error fetching musicas: " + musicas.message);
  }
});