import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const user = { email: email.trim(), password: password.trim() };
    console.log(user);
  }

  return (
    <div className="page login">
      <h2>Login</h2>

      <form action="POST" className="form" onSubmit={handleSubmit}>
        <div className="form__field">
          <label>Email:</label>
          <input
            name="email"
            type="text"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form__field">
          <label>Password:</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <span>
          Don't have an account? <Link to="/register">Create one</Link>.
        </span>
      </form>
    </div>
  );
}
