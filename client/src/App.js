import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";

import "./App.css";

import Users from "./users/Users";
import Signin from "./auth/Signin";
import Register from "./register/registerForm";

class App extends Component {
  render() {
    return (
      <>
        <header>
          <nav>
            <NavLink to="/signin">Signin</NavLink>
            &nbsp;|&nbsp;
            <NavLink to="/users">Users</NavLink>
            &nbsp;|&nbsp;
            <NavLink to="/register">Register</NavLink>
            <button onClick={this.signout}>Signout</button>
          </nav>
        </header>
        <main>
          <Route path="/signin" component={Signin} />
          <Route path="/users" component={Users} />
          <Route path="/register" component={Register} />
        </main>
      </>
    );
  }

  signout = () => {
    localStorage.removeItem("jwt");
    window.location.replace("/signin");
  };
}

export default App;
