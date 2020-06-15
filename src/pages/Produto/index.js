import React from "react";
import "./styles.css";
import { Table, Form, Button, Col } from "react-bootstrap";
import {
  getAllProdutos,
  deleteProduto,
  getAllFornecedores,
} from "./produtoService.js";
import { FiTrash2, FiArrowLeft, FiArrowRight, FiEdit3 } from "react-icons/fi";
import api from "../../services/api";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      produtos: [],
      fornecedores: [],
      idfornecedor: 1,
      page: 1,
      lenght: 2,
      totalRegistros: 0,
      editMode: false,
      record: {
        id: 0,
        nome: "",
        valor: 0,
        quantidade: 0,
        idfornecedor: 0,
      },
    };
  }

  async cleanState() {
    await this.setState({
      record: {
        ...this.state.record,
        id: 0,
        nome: "",
        valor: 0,
        quantidade: 0,
        idfornecedor: 0,
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
        this.getProdutos();
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
        this.getProdutos();
      }
    );
  };

  handleChange = (e) => {
    const name = e.target.name ? e.target.name : "";
    const value = e.target.value ? e.target.value : "";
    this.setState({ record: { ...this.state.record, [name]: value } });
  };

  updateFornecedor = (fornecedor) => {
    console.log("funcao updateCliente param", fornecedor.target.value);
    this.setState({ ...this.state, idfornecedor: fornecedor.target.value });
  };
  getProdutos() {
    const { page, lenght } = this.state;
    getAllProdutos(page, lenght)
      .then((response) => {
        console.log("PRODUTOS", response);
        this.setState({
          ...this.state,
          produtos: response.registros,
          totalRegistros: response.totalRegistros,
        });
      })
      .catch((error) => {
        console.log("ERRO GET PRODUTO", error);
      })
      .finally(() => this.setState({ ...this.state }));
  }

  getFornecedores() {
    getAllFornecedores()
      .then((response) => {
        console.log("FORNECEDORES", response);
        this.setState({ ...this.state, fornecedores: response });
      })
      .catch((error) => {
        console.log("ERRO GET USUARIO", error);
      })
      .finally(() => this.setState({ ...this.state }));
  }
  delProduto(idProduto) {
    deleteProduto(idProduto)
      .then((response) => {})
      .catch((error) => {
        console.log("ERRO EXCLUIR USUARIO", error);
      })
      .finally(() => {
        this.getUsuario();
      });
  }

  postProduto() {
    const { record, idfornecedor } = this.state;
    const params = {
      id: 0,
      nome: record.nome,
      quantidade: record.quantidade,
      valor: record.valor,
      idfornecedor: idfornecedor,
    };

    console.log("PARAMS", params);
    api
      .post("/Produto", params)
      .then((response) => {
        console.log("suce: ", response);
        this.getProdutos();
      })
      .catch((err) => {
        console.log("ERRO INCLUIR CHAMADO", err);
      });
  }

  async findProduto(idProduto) {
    const { produtos } = this.state;
    await this.setState({ editMode: true }, () => {
      console.log(this.state.editMode);
    });

    let editingProduto = produtos.find((produto) => {
      return produto.id == idProduto;
    });
    console.log("USUARIOEDIT", editingProduto);

    await this.setState({
      record: {
        ...this.state.record,
        id: editingProduto.id,
        nome: editingProduto.nome,
        valor: editingProduto.valor,
        quantidade: editingProduto.quantidade,
        idFornecedor: editingProduto.idFornecedor,
      },
    });
  }

  editaProduto() {
    const { record } = this.state;
    const params = {
      id: record.id,
      nome: record.nome,
      quantidade: record.quantidade,
      valor: record.valor,
      idFornecedor: record.idFornecedor,
    };

    api
      .put(`/Produto/Prod/${params}`, params)
      .then((response) => {
        console.log("suce: ", response);
        this.setState({ editMode: false });
        this.getProdutos();
      })
      .catch((err) => {
        console.log("ERRO INCLUIR CHAMADO", err);
      })
      .finally(() => this.getProdutos(), this.cleanState());
  }

  async cancelEdit() {
    await this.setState({ editMode: false });
    this.cleanState();
  }

  componentDidMount() {
    this.getProdutos();
    this.getFornecedores();
  }

  render() {
    const {
      produtos,
      record,
      fornecedores,
      page,
      lenght,
      totalRegistros,
      editMode,
    } = this.state;
    return (
      <>
        <div className="Page">
          {!editMode ? (
            <div className="FormUsuario">
              <Form>
                <Form.Label className={"Title"} title="Cadastro de usuario">
                  Cadastro de produto
                </Form.Label>
                <Form.Group className="mb-3" controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    placeholder="Nome do produto"
                    onChange={this.handleChange}
                    value={record.nome}
                    name="nome"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Insira o valor do produto"
                    onChange={this.handleChange}
                    value={record.valor}
                    name="valor"
                  />
                </Form.Group>
                <Form.Group controlId="quantidade">
                  <Form.Label>Quantidade</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Quantidade"
                    onChange={this.handleChange}
                    value={record.quantidade}
                    name="quantidade"
                  />
                </Form.Group>
                <Form.Group controlId="fornecedor">
                  <Form.Label>Fornecedor</Form.Label>
                  <Form.Control as="select" onChange={this.updateFornecedor}>
                    {fornecedores.map((item) => {
                      return (
                        <option key={item.id} value={item.id} label={item.nome}>
                          {item.nome}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={() => this.postProduto()}
                >
                  Enviar
                </Button>
              </Form>
            </div>
          ) : (
            <div className="FormUsuario">
              <Form>
                <Form.Label className={"Title"} title="Editar usuario">
                  Editar produto
                </Form.Label>
                <Form.Group className="mb-3" controlId="nome">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    placeholder="Nome do produto"
                    onChange={this.handleChange}
                    value={record.nome}
                    name="nome"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Insira o valor do produto"
                    onChange={this.handleChange}
                    value={record.valor}
                    name="valor"
                  />
                </Form.Group>
                <Form.Group controlId="quantidade">
                  <Form.Label>Quantidade</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Quantidade"
                    onChange={this.handleChange}
                    value={record.quantidade}
                    name="quantidade"
                  />
                </Form.Group>
                <Form.Group controlId="fornecedor">
                  <Form.Label>Fornecedor</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.updateFornecedor}
                    value={record.idfornecedor}
                  >
                    {fornecedores.map((item) => {
                      return (
                        <option key={item.id} value={item.id} label={item.nome}>
                          {item.nome}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
                <div className={"Buttons"}>
                  <Button
                    variant="success"
                    type="submit"
                    onClick={() => this.editaProduto()}
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
                  <th>Valor</th>
                  <th>Fornecedor</th>
                  <th>Quantidade</th>
                  <th>Excluir</th>
                  <th>Editar</th>
                </tr>
              </thead>
              {produtos.map((item) => {
                return (
                  <tbody key={item.id}>
                    <tr>
                      <td className={"TdCenter"}>{item.id}</td>
                      <td className={"TdCenter"}>{item.nome}</td>
                      <td className={"TdCenter"}>{item.valor}</td>
                      <td className={"TdCenter"}>{item.fornecedor.nome}</td>
                      <td className={"TdCenter"}>{item.quantidade}</td>
                      <td>
                        <Button onClick={() => this.delProduto(item.id)}>
                          <FiTrash2 />
                        </Button>
                      </td>
                      <td>
                        <Button onClick={() => this.findProduto(item.id)}>
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
