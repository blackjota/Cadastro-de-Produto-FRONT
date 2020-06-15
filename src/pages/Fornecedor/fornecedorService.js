import api from "../../services/api";

export const getAllFornecedores = (page, length) => {
  const url = `/Fornecedor/Page/${page}/Length/${length}`;
  return new Promise((resolve, reject) => {
    api
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};

export const deleteFornecedor = (id) => {
  const url = `/Fornecedor/Id/${id}`;
  return new Promise((resolve, reject) => {
    api
      .put(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};
