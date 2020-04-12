const baseURL = "https://90ae7eb7.ngrok.io";

export const fetchLosers = async (time) => {
  try {
    let response = await fetch(`${baseURL}/api/losers/?time=${time}`);
    let data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
    return data.losers;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchGainers = async (time) => {
  try {
    let response = await fetch(`${baseURL}/api/gainers/?time=${time}`);
    let data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
    return data.gainers;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const register = async (email, password, firstName, lastName) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(email)) {
    return Promise.reject("INVALID_EMAIL");
  }
  let requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
    }),
  };
  try {
    let response = await fetch(`${baseURL}/api/users/register`, requestOptions);
    let data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const login = async (email, password) => {
  let requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "username=" + email + "&password=" + password,
    credentials: "include",
  };
  try {
    let response = await fetch(
      `${baseURL}/api/users/login/cookie`,
      requestOptions
    );
    let data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const logout = async () => {
  const requestOptions = {
    method: "POST",
    body: null,
    credentials: "include",
  };
  try {
    let response = await fetch(
      `${baseURL}/api/users/logout/cookie`,
      requestOptions
    );
    let data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateUser = async (updatedUser) => {
  const requestOptions = {
    method: "PATCH",
    body: JSON.stringify(updatedUser),
    credentials: "include",
  };
  try {
    let response = await fetch(`${baseURL}/api/users/me`, requestOptions);
    let data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCurrUser = async () => {
  const requestOptions = {
    method: "GET",
    body: null,
    credentials: "include",
  };
  try {
    let response = await fetch(`${baseURL}/api/users/me`, requestOptions);
    let data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchTickerFullName = async (ticker) => {
  try {
    const response = await fetch(`${baseURL}/api/crypto/tickerInfo/${ticker}`);
    const fullTickerName = await response.json();
    if (!response.ok) {
      const error =
        fullTickerName && fullTickerName.detail
          ? fullTickerName.detail
          : response.status;
      return Promise.reject(error);
    }
    return fullTickerName;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchTickerData = async (ticker, request) => {
  try {
    const response = await fetch(
      `${baseURL}/api/crypto/data/${ticker}?minDate=${request.minDate}&maxDate=${request.maxDate}&timeInterval=${request.timeInterval}`
    );
    const data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchBox = async (query) => {
  try {
    const response = await fetch(`${baseURL}/search?query=${query}&limit=4`);
    const data = await response.json();
    if (!response.ok) {
      const error = data && data.detail ? data.detail : response.status;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
};
