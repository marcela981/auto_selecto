import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const [staffMembers, setStaffMembers] = useState([]);

  let [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:8000/api/token/",
      {
        email: e.target.email.value,
        password: e.target.password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.data;
    console.log("data: ", data);
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
      toast.success("Has iniciado sesión");
    } else {
      alert("Something went wrong!");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");

    toast.warning("Se ha cerrado la sesión");
  };

  let createUser = async (e) => {
    e.preventDefault();
    let response = await axios.post(
      "http://localhost:8000/api/client/create/",
      {
        email: e.target.email.value,
        name: e.target.name.value,
        last_name: e.target.last_name.value,
        cedula: e.target.cedula.value,
        telephone: e.target.telephone.value,
        password: e.target.password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.data;
    console.log("data: ", data);
    if (response.status === 201) {
      let response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: e.target.email.value,
          password: e.target.password.value,
        }),
      });
      let data = await response.json();
      console.log("data: ", data);
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
      toast.success("¡Bienvenido! La creación fue un éxito");
    } else {
      alert("Something went wrong!");
    }
  };

  let createStaffMember = async (e) => {
    e.preventDefault();
    let response = await axios.post(
      "http://localhost:8000/api/staff_member/create/",
      {
        email: e.target.email.value,
        name: e.target.name.value,
        last_name: e.target.last_name.value,
        cedula: e.target.cedula.value,
        telephone: e.target.telephone.value,
        password: e.target.password.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/staff_members/"
        );
        setStaffMembers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStaffMembers();
  }, []);

  let updateToken = async () => {
    let response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: authTokens.refresh,
      }),
    });
    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }
  };

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    createUser: createUser,
    staffMembers: staffMembers,
  };

  useEffect(() => {
    let fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
