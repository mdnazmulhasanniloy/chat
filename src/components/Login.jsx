/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/Api/authSlice/AuthApi";

const Login = () => {
  const [loginUser, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ email, password })
        .then((data) => {
          if (data?.error) {
            alert(data?.error?.data?.message);
            return;
          }
          console.log("first", data);
          if (data.data.success) {
            localStorage.setItem("user", JSON.stringify(data.data?.data));
            navigate("/chat");
          }
        })
        .catch((error) => {
          console.log(error);
          alert(error?.message);
        });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form
        className="h-full gap-3 w-full flex items-center justify-center flex-col"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          value={email}
          className="p-3 border border-sky-400"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          className="p-3 border border-sky-400"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button
          className="px-5 py-3 border border-sky-400 bg-transparent hover:bg-sky-400 text-sky-400 hover:text-white"
          type="submit"
        >
          {isLoading ? (
            <>
              <div className="spinner-border text-white"></div> Loading...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
