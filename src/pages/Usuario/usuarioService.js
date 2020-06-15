import api from "../../services/api";

export const getAllUsuarios = (page, lenght) => {
  const url = `/Usuario/Page/${page}/Lenght/${lenght}`;
  return new Promise((resolve, reject) => {
    api
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};
export const deleteUsuario = (id) => {
  const url = `/Usuario/Id/${id}`;
  return new Promise((resolve, reject) => {
    api
      .put(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};

export const InserirUsuario = (data) => {
  const url = `/Usuario`;
  return new Promise((resolve, reject) => {
    api
      .post(url, data)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.response));
  });
};
