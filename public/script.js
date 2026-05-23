const API_URL = "https://sistema-musica-dj.onrender.com"; 

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

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      alert("Login successful!");
    } else {
      const errorData = await response.json().catch(() => ({ message: "Erro desconhecido" }));
      alert("Login failed: " + errorData.message);
    }
  } catch (error) {
    console.error("Erro de conexão:", error);
    alert("Não foi possível conectar ao servidor backend.");
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

  try {
    const response = await fetch(`${API_URL}/musicas`, {
      method: "GET", // É boa prática deixar explícito, embora o GET seja o padrão
      headers: { "Authorization": `Bearer ${token}` },
    });

    // 1. Checa se o status da resposta foi sucesso (200 OK)
    if (response.ok) {
      const musicas = await response.json(); // Só decodifica o JSON se a requisição deu certo
      
      const musicasList = document.getElementById("musicasList");
      musicasList.innerHTML = "";

      musicas.forEach((musica) => {
        const li = document.createElement("li");
        li.textContent = `${musica.titulo} - ${musica.artista}`;
        musicasList.appendChild(li);
      });
      
    } else {
      // 2. Se o status for de erro (ex: 403 Token Inválido), trata aqui de forma segura
      const errorData = await response.json().catch(() => ({ message: "Erro ao processar lista de músicas." }));
      alert("Error fetching musicas: " + errorData.message);
    }

  } catch (error) {
    // 3. Captura erros drásticos (como o CORS bloqueando o Preflight ou a Render offline)
    console.error("Erro na requisição de músicas:", error);
    alert("Falha de conexão com o servidor ao tentar buscar as músicas.");
  }
});