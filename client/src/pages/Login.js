// src/pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await login(email, password);
            if (!result.success) {
                setError(result.message);
            }
        } catch (err) {
            setError("Error en el login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div style={{ color: "red" }}>{error}</div>}
                <button type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
            </form>
        </div>
    );
};

export default Login;
