import React from "react";
import "./styles.css";
import { Table, Form, Button } from "react-bootstrap";
import {
  getAllUsuarios,
  deleteUsuario,
  InserirUsuario,
} from "./usuarioService";
import { FiTrash2, FiArrowLeft, FiArrowRight, FiEdit3 } from "react-icons/fi";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import api from "../../services/api";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      usuarios: [],
      page: 1,
      lenght: 2,
      editMode: false,
      totalRegistros: 0,
      record: {
        id: 0,
        nome: "",
        email: "",
        senha: "",
      },
    };
    this.showPassword = this.showPassword.bind(this);
  }

  handleChange = (e) => {
    console.log(e.target.value);
    const name = e.target.name ? e.target.name : "";
    const value = e.target.value ? e.target.value : "";
    this.setState({ record: { ...this.state.record, [name]: value } });
  };

  async cleanState() {
    await this.setState({
      record: {
        ...this.state.record,
        id: 0,
        nome: "",
        email: "",
        senha: "",
      },
    });
  }

  handleNext = () => {
    const { page } = this.state;
    this.setState(
      {
        page: page + 1,
      },
      () => {
        this.getUsuario();
      }
    );
  };

  handleBack = () => {
    const { page } = this.state;
    this.setState(
      {
        page: page - 1,
      },
      () => {
        this.getUsuario();
      }
    );
  };

  async findUsuario(idUsuario) {
    const { usuarios } = this.state;
    await this.setState({ editMode: true }, () => {
      console.log(this.state.editMode);
    });

    let editingUsuario = usuarios.find((usuario) => {
      return usuario.id == idUsuario;
    });
    console.log("USUARIOEDIT", editingUsuario);

    await this.setState({
      record: {
        ...this.state.record,
        id: editingUsuario.id,
        nome: editingUsuario.nome,
        email: editingUsuario.email,
        senha: editingUsuario.senha,
      },
    });
  }

  getUsuario() {
    const { lenght, page } = this.state;
    getAllUsuarios(page, lenght)
      .then((response) => {
        console.log("USUARIO", response);
        this.setState({
          ...this.state,
          usuarios: response.registros,
          totalRegistros: response.totalRegistros,
        });
      })
      .catch((error) => {
        console.log("ERRO GET USUARIO", error);
      })
      .finally(() => this.setState({ ...this.state }));
  }

  delUsuario(idUsuario) {
    deleteUsuario(idUsuario)
      .then((response) => {})
      .catch((error) => {
        console.log("ERRO EXCLUIR USUARIO", error);
      })
      .finally(() => {
        this.getUsuario();
      });
  }

  postUsuario() {
    const { record } = this.state;
    const params = {
      id: 0,
      nome: record.nome,
      senha: record.senha,
      email: record.email,
    };

    console.log("PARAMS", params);

    api
      .post("/Usuario", params)
      .then((response) => {
        console.log("suce: ", response);
        this.getUsuario();
        this.cleanState();
      })
      .catch((err) => {
        console.log("ERRO INCLUIR CHAMADO", err);
      });
  }

  async cancelEdit() {
    await this.setState({ editMode: false });
    this.cleanState();
  }
  editaUsuario() {
    const { record } = this.state;
    const params = {
      id: record.id,
      nome: record.nome,
      senha: record.senha,
      email: record.email,
    };

    api
      .put(`/Usuario/User/${params}`, params)
      .then((response) => {
        console.log("suce: ", response);
        this.setState({ editMode: false });
        this.getUsuario();
      })
      .catch((err) => {
        console.log("ERRO INCLUIR CHAMADO", err);
      })
      .finally(() => this.getUsuario(), this.cleanState());
  }

  componentDidMount() {
    this.getUsuario();
  }

  showPassword() {
    this.setState((previousState) => ({
      showPassword: !previousState.showPassword,
    }));
  }

  render() {
    const {
      usuarios,
      record,
      page,
      lenght,
      totalRegistros,
      editMode,
      showPassword,
    } = this.state;
    return (
      <>
        {!editMode ? (
          <div className="Page">
            <div className="FormUsuario">
              <Form>
                <Form.Label className={"Title"} title="Cadastro de usuario">
                  Cadastro de usuario
                </Form.Label>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    placeholder="Nome do usuario"
                    onChange={this.handleChange}
                    value={record.nome}
                    name="nome"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Insira um e-mail"
                    onChange={this.handleChange}
                    value={record.email}
                    name="email"
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Senha"
                    onChange={this.handleChange}
                    value={record.senha}
                    name="senha"
                  />
                  {/* <Button
                    color="info"
                    className="show-password"
                    onClick={() => this.showPassword()}
                  >
                    {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                  </Button> */}
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => this.postUsuario()}
                >
                  Enviar
                </Button>
              </Form>
            </div>
          </div>
        ) : (
          <div className="Page">
            <div className="FormUsuario">
              <Form>
                <Form.Label className={"Title"} title="Editar usuario">
                  Editar usuario
                </Form.Label>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    placeholder="Nome do usuario"
                    onChange={this.handleChange}
                    value={record.nome}
                    name="nome"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Insira um e-mail"
                    onChange={this.handleChange}
                    value={record.email}
                    name="email"
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Senha"
                    onChange={this.handleChange}
                    value={record.senha}
                    name="senha"
                  />
                  {/* <Button
                    color="info"
                    className="show-password"
                    onClick={() => this.showPassword()}
                  >
                    {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                  </Button> */}
                </Form.Group>
                <div className={"Buttons"}>
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.editaUsuario()}
                  >
                    Enviar
                  </Button>

                  <Button variant={"danger"} onClick={() => this.cancelEdit()}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        )}
        <div className="Page">
          <div className="Usuario">
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Excluir</th>
                  <th>Editar</th>
                </tr>
              </thead>
              {usuarios.map((item) => {
                return (
                  <tbody key={item.id}>
                    <tr>
                      <td>{item.id}</td>
                      <td>{item.nome}</td>
                      <td>{item.email}</td>
                      <td>
                        <Button onClick={() => this.delUsuario(item.id)}>
                          <FiTrash2 />
                        </Button>
                      </td>
                      <td>
                        <Button onClick={() => this.findUsuario(item.id)}>
                          <FiEdit3 />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </Table>
          </div>
        </div>
        {totalRegistros != 0 ? (
          <div className="PaginationDiv">
            <div className="paginationBtn">
              <Button
                disabled={page <= 1 ? true : false}
                type="button"
                className="icon"
                title="Editar"
                onClick={this.handleBack}
              >
                <FiArrowLeft />
              </Button>
              <div className="center-t" style={{ marginTop: "4px" }}>
                {`${page} de ${Math.ceil(totalRegistros / lenght)}`}
              </div>
              <Button
                disabled={
                  page >= Math.ceil(totalRegistros / lenght) ? true : false
                }
                type="button"
                className="icon"
                title="Editar"
                onClick={this.handleNext}
              >
                <FiArrowRight />
              </Button>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
