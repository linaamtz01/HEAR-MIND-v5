async function logout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // para enviar cookies si usas sesiones
      });

      // Limpia token si usas JWT
      localStorage.removeItem("token");

      // Redirige al login
      window.location.href = "/login";
    } catch (err) {
      console.error("Error cerrando sesión", err);
    }
  }

  app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // si usas cookies
      res.sendStatus(200);
    });
  });