import React from "react";
import "./styles.css";
import { Table, Form, Button } from "react-bootstrap";
import {
  getAllFornecedores,
  deleteFornecedor,
  InserirUsuario,
} from "./fornecedorService.js";
import { FiTrash2, FiArrowLeft, FiArrowRight, FiEdit3 } from "react-icons/fi";
import api from "../../services/api";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fornecedores: [],
      page: 1,
      length: 2,
      totalRegistros: 0,
      editMode: false,
      record: {
        id: 0,
        nome: "",
      },
    };
  }

  handleChange = (e) => {
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
        this.getFornecedores();
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
        this.getFornecedores();
      }
    );
  };

  getFornecedores() {
    const { page, length } = this.state;
    getAllFornecedores(page, length)
      .then((response) => {
        console.log("PRODUTOS", response);
        this.setState({
          ...this.state,
          fornecedores: response.registros,
          totalRegistros: response.totalRegistros,
        });
      })
      .catch((error) => {
        console.log("ERRO GET USUARIO", error);
      })
      .finally(() => this.setState({ ...this.state }));
  }

  delFornecedor(idFornecedor) {
    deleteFornecedor(idFornecedor)
      .then((response) => {})
      .catch((error) => {
        console.log("ERRO EXCLUIR USUARIO", error);
      })
      .finally(() => {
        this.getFornecedores();
      });
  }

  postFornecedor() {
    const { record } = this.state;
    const params = {
      id: 0,
      nome: record.nome,
    };

    console.log("PARAMS", params);

    api
      .post("/Fornecedor", params)
      .then((response) => {
        console.log("suce: ", response);
        this.getFornecedores();
      })
      .catch((err) => {
        console.log("ERRO INCLUIR FORNECEDOR", err);
      })
      .finally(() => this.getFornecedores(), this.cleanState());
  }

  async findFornecedor(idFornecedor) {
    const { fornecedores } = this.state;
    await this.setState({ editMode: true }, () => {
      console.log(this.state.editMode);
    });

    let editingFornecedor = fornecedores.find((fornecedor) => {
      return fornecedor.id == idFornecedor;
    });
    console.log("USUARIOEDIT", editingFornecedor);

    await this.setState({
      record: {
        ...this.state.record,
        id: editingFornecedor.id,
        nome: editingFornecedor.nome,
      },
    });
  }

  editaFornecedor() {
    const { record } = this.state;
    const params = {
      id: record.id,
      nome: record.nome,
    };

    api
      .put(`/Fornecedor/Forn/${params}`, params)
      .then((response) => {
        console.log("suce: ", response);
        this.setState({ editMode: false });
        this.getFornecedores();
      })
      .catch((err) => {
        console.log("ERRO INCLUIR CHAMADO", err);
      })
      .finally(() => this.getFornecedores(), this.cleanState());
  }

  async cancelEdit() {
    await this.setState({ editMode: false });
    this.cleanState();
  }

  componentDidMount() {
    this.getFornecedores();
  }

  render() {
    const {
      fornecedores,
      record,
      page,
      length,
      totalRegistros,
      editMode,
    } = this.state;
    return (
      <>
        <div className="Page">
          {!editMode ? (
            <div className="FormUsuario">
              <Form>
                <Form.Label
                  className={"Title"}
                  title="Cadastro de fornecedores"
                >
                  Cadastro de fornecedor
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

                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => this.postFornecedor()}
                >
                  Enviar
                </Button>
              </Form>
            </div>
          ) : (
            <div className="FormUsuario">
              <Form>
                <Form.Label className={"Title"} title="Editar fornecedores">
                  Editar fornecedor
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

                <div className={"Buttons"}>
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.editaFornecedor()}
                  >
                    Enviar
                  </Button>

                  <Button variant={"danger"} onClick={() => this.cancelEdit()}>
                    Cancelar
                  </Button>
                </div>
              </Form>
            </div>
          )}

          <div className="Usuario">
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Excluir</th>
                  <th>Editar</th>
                </tr>
              </thead>
              {fornecedores.map((item) => {
                return (
                  <tbody key={item.id}>
                    <tr>
                      <td>{item.id}</td>
                      <td>{item.nome}</td>
                      <td>
                        <Button onClick={() => this.delFornecedor(item.id)}>
                          <FiTrash2 />
                        </Button>
                      </td>
                      <td>
                        <Button onClick={() => this.findFornecedor(item.id)}>
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
                {`${page} de ${Math.ceil(totalRegistros / length)}`}
              </div>
              <Button
                disabled={
                  page >= Math.ceil(totalRegistros / length) ? true : false
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
