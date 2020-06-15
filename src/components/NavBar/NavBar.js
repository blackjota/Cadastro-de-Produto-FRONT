import React, { Component } from "react";
import { NavLink } from "react-router-dom";
class Navbar extends Component {
  render() {
    return (
      <nav className="navBar">
        <ul>
          <li>
            <NavLink to="/usuario/">Usuario</NavLink>
          </li>
          <li>
            <NavLink to="/produto/">Produtos</NavLink>
          </li>
          <li>
            <NavLink to="/fornecedor/">Fornecedores</NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}
export default Navbar;
