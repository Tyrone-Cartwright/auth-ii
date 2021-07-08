import React from "react";
import axios from "axios";

class Register extends React.Component {
  state = {
    username: "",
    name: "",
    password: "",
    department: ""
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="">Username</label>
          <input
            name="username"
            value={this.state.username}
            onChange={this.handleInputChange}
            type="text"
          />
        </div>
        <div>
          <label htmlFor="">Name</label>
          <input
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
            type="text"
          />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
            type="password"
          />
        </div>
        <div>
          <label htmlFor="">Department</label>
          <input
            name="department"
            value={this.state.department}
            onChange={this.handleInputChange}
            type="text"
          />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    );
  }

  handleInputChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const endpoint = `${process.env.REACT_APP_API_URL}/register`;
    const logPoint = `${process.env.REACT_APP_API_URL}/login`;

    axios
      .post(endpoint, this.state)
      .then(res => {
        axios
          .post(logPoint, this.state)
          .then(res => {
            localStorage.setItem("jwt", res.data.token);
            window.location.replace("/users");
          })
          .catch(err => console.log(err));
        // console.log(res.data);
      })
      .catch(err => console.error(err));
  };
}

export default Register;
