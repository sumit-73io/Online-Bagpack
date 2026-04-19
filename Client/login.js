const API = "http://localhost:5000/api/auth";

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  document.getElementById("msg").innerText = data.message;
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.message === "Login successful") {
    // store user locally
    localStorage.setItem("user", JSON.stringify(data.user));

    // redirect to homepage
    window.location.href = "index.html";
  } else {
    document.getElementById("msg").innerText = data.message;
  }
}