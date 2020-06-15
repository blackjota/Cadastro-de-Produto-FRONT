import api from "../../services/api";

export const getAllProdutos = (page, lenght) => {
  const url = `/Produto/Page/${page}/Lenght/${lenght}`;
  return new Promise((resolve, reject) => {
    api
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};

export const deleteProduto = (id) => {
  const url = `/Produto/Id/${id}`;
  return new Promise((resolve, reject) => {
    api
      .put(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};

export const getAllFornecedores = () => {
  const url = "/Fornecedor";
  return new Promise((resolve, reject) => {
    api
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};
