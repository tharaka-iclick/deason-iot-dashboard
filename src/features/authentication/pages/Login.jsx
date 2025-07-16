import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { loginUser, registerUser, clearError } from "../store/authSlice";
import { Button, Input } from "../../../shared/components/ui";
import "./Login.css";

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    dispatch(clearError());

    try {
      if (isLogin) {
        const result = await dispatch(loginUser(data));
        if (result.type === "auth/login/fulfilled") {
          toast.success("Login successful!");
        } else {
          toast.error(result.payload);
        }
      } else {
        const result = await dispatch(registerUser(data));
        if (result.type === "auth/register/fulfilled") {
          toast.success("Registration successful!");
        } else {
          toast.error(result.payload);
        }
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
    dispatch(clearError());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>IoT Dashboard</h1>
          <p>{isLogin ? "Sign in to your account" : "Create your account"}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {!isLogin && (
            <Input
              label="Display Name"
              {...register("displayName", {
                required: "Display name is required",
              })}
              error={errors.displayName?.message}
            />
          )}

          <Input
            label="Email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={errors.password?.message}
          />

          {error && <div className="error-message">{error}</div>}

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={loading}
            fullWidth
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="toggle-button"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
