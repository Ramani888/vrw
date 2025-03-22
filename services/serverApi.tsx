import axios, { AxiosError, Method } from "axios";
import { StatusCodes } from "http-status-codes";

// const serverUrl = "http://localhost:3010/api";
export const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjYwZjMwNDcxMDEzYmM1MThkMDRmMjkiLCJ1c2VybmFtZSI6IlJhbWFuaSBEaXZ5ZXNoIiwiaWF0IjoxNzE5NjcxMDI1LCJleHAiOjE3MjIyNjMwMjV9.82QOtRboFn1WCIGroahsaFixyG3QNWq5Jr1_v5ra6aA'
const serverUrl = 'https://vr-fashion-backend.vercel.app/api';
// const serverUrl = 'https://vrfashion.site/api';

const errorCodes = [
  StatusCodes.INTERNAL_SERVER_ERROR,
  StatusCodes.BAD_REQUEST,
  StatusCodes.UNAUTHORIZED,
  StatusCodes.CONFLICT,
];

const serverRequest = async (
  url: string,
  command: Method,
  data: any,
  token?: boolean,
  isForm?: boolean
) => {
  const headers: HeadersInit = {
    Accept: "application/json, text/plain, */*",
  };

  if (token) {
    headers.authorization = TOKEN;
  }

  const params: RequestInit = {
    method: command,
    mode: "cors",
    cache: "no-cache",
    headers: headers,
  };

  if (data && !isForm) {
    (params.headers as any)["Content-Type"] = "application/json";
    params.body = JSON.stringify(data);
  } else if (isForm) {
    params.body = data;
  }

  try {
    const config = {
      url: serverUrl + url,
      headers: headers,
      method: command,
      timeout: 60000,
      data: data,
    };
    const response = await axios(config);

    let res = await response.data;

    if (errorCodes.includes(response.status)) {
      throw res;
    }

    return res;
  } catch (e) {
    throw e;
  }
};

////////// Admin Login ///////////
export const serverAdminLogin = async (data: {email: string, password: string}) => {
  const res = await serverRequest('/admin/login', 'POST', data, true);
  return res
}

export const serverLogin = async (data: {mobileNumber: number, password: string}) => {
  const res = await serverRequest("/login", "POST", data, true);
  return res;
};

export const serverRegister = async (data: any) => {
  const res = await serverRequest("/registerUser", "POST", data, true);
  return res;
};

export const serverRegisterLogin = async (data: any) => {
  const res = await serverRequest("/register/login", "POST", data, true);
  return res;
};

//////////  Banner Api //////////
export const serverGetBanners = async () => {
  const res = await serverRequest("/banner", "GET", null, true);
  return res;
};

export const serverInsertBanner = async (formData: FormData) => {
  const res = await serverRequest("/banner", "POST", formData, true, true);
  return res;
};

export const serverDeleteBanner = async (bannerId: string) => {
  const res = await serverRequest(
    `/banner?bannerId=${bannerId}`,
    "DELETE",
    null,
    true
  );
  return res;
};

export const serverUpdateBanner = async (forData: FormData) => {
  const res = await serverRequest(`/banner`, 'PUT', forData, true, true);
  return res
}

////////// Users Api //////////
export const serverGetUsers = async () => {
  const res = await serverRequest(`/user/all`, "GET", null, true);
  return res;
};

export const serverDeleteUsers = async (userId: string) => {
  const res = await serverRequest(
    `/user?userId=${userId}`,
    "DELETE",
    null,
    true
  );
  return res;
};

export const serverUpdateUserStatus = async (data: any) => {
  const res = await serverRequest(`/user/status`, "PUT", data, true);
  return res;
};

export const serverGetUserDetailsByUserId = async (userId: string) => {
  const res = await serverRequest(`/user?userId=${userId}`, "GET", null, true);
  return res;
}

// =========================== product Api ============================ //

export const serverGetProducts = async () => {
  const res = await serverRequest(`/product`, "GET", null, true);
  return res;
};

export const serverGetAllProduct = async (userId?: string) => {
  let url = `/product`;
  if (userId) {
    url += `?userId=${userId}`;
  }
  const res = await serverRequest(url, "GET", null, true);
  return res;
};

export const serverGetPramotionProduct = async (userId?: string) => {
  let url = "/product/pramotion";
  if (userId) {
    url += `?userId=${userId}`;
  }
  const res = await serverRequest(url, "GET", null, true);
  return res;
};

export const serverGetProductByCategoryId = async (categoryId: string, userId?: string) => {
  let url = `/category/product?categoryId=${categoryId}`;
  if (userId) {
    url += `&userId=${userId}`;
  }
  const res = await serverRequest(url, "GET", null, true);
  return res;
};

export const serverGetProductById = async (productId: string, userId?: string) => {
  let url = `/product/alone?productId=${productId}`;
  if (userId) {
    url += `&userId=${userId}`;
  }
  const res = await serverRequest(url, "GET", null, true);
  return res;
};

export const serverInsertProduct = async (data: any) => {
  const res = await serverRequest("/product", "POST", data, true);
  return res;
};

export const serverUpdateProduct = async (data: any) => {
  const res = await serverRequest("/product", "PUT", data, true);
  return res;
};

export const serverDeleteProduct = async (productId: string) => {
  const res = await serverRequest(
    `/product?productId=${productId}`,
    "DELETE",
    null,
    true
  );
  return res;
};

export const serverUpdateProductPramotion = async (data: any) => {
  const res = await serverRequest("/product/pramotion/flag", "PUT", data, true);
  return res;
}

export const serverUpdateProductDiscount = async (data: any) => {
  const res = await serverRequest("/product/discount", "PUT", data, true);
  return res;
}

export const serverUpdateProductReward = async (data: any) => {
  const res = await serverRequest("/product/reward", "PUT", data, true);
  return res;
}

export const serverUpdateProductAction = async (productId: string) => {
  const res = await serverRequest(`/product/action?productId=${productId}`, "PUT", null, true);
  return res;
}

////////// Category Api //////////
export const serverGetCategory = async () => {
  const res = await serverRequest('/category', 'GET', null, true);
  return res
}

export const serverDeleteCategory = async (categoryId: string) => {
  const res = await serverRequest(`/category?categoryId=${categoryId}`, 'DELETE', null, true);
  return res
}

export const serverInsertCategory = async (formData: FormData) => {
  const res = await serverRequest('/category', 'POST', formData, true, true);
  return res
}

export const serverUpdateCategory = async (formData: FormData) => {
  const res = await serverRequest(`/category`, 'PUT', formData, true, true);
  return res
}

export const serverGetCategoryById = async (categoryId: string) => {
  const res = await serverRequest(`/category?categoryId=${categoryId}`, 'GET', null, true);
  return res
}

////////// Orders Api //////////
export const serverGetOrders = async () => {
  const res = await serverRequest('/order', 'GET', null, true);
  return res
}

export const serverGetOrder = async (userId: string) => {
  let url = `/user/order`;
  if (userId) {
    url += `?userId=${userId}`;
  }
  const res = await serverRequest(url, "GET", null, true);
  return res;
};

export const serverUpdateOrderStatus = async (orderId: string, status: string) => {
  const res = await serverRequest(`/order/status?orderId=${orderId}&status=${status}`, 'PUT', null, true);
  return res
}

////////// Tracking Order Api //////////
export const serverInsertTrackingDetail = async (data: any) => {
  const res = await serverRequest("/tracking", "POST", data, true);
  return res;
}

export const serverUpdateTrackingDetail = async (data: any) => {
  const res = await serverRequest("/tracking", "PUT", data, true);
  return res;
}

////////// Dashboard Api //////////
export const serverGetDashboardData = async () => {
  const res = await serverRequest('/dashboard', 'GET', null, true);
  return res
}

////////// Ads Poster Api //////////
export const serverGetAdsPosterData = async () => {
  const res = await serverRequest('/ads/poster', 'GET', null, true);
  return res
}

export const serverDeleteAdsPoster = async (adsPosterId: string) => {
  const res = await serverRequest(
    `/ads/poster?adsPosterId=${adsPosterId}`,
    "DELETE",
    null,
    true
  );
  return res;
};

export const serverInsertAdsPoster = async (formData: FormData) => {
  const res = await serverRequest("/ads/poster", "POST", formData, true, true);
  return res;
};

export const serverUpdateAdsPoster = async (forData: FormData) => {
  const res = await serverRequest(`/ads/poster`, 'PUT', forData, true, true);
  return res
}

////////// Add Product Information Api //////////
export const serverGetProductBaseMetalData = async () => {
  const res = await serverRequest('/product/baseMetal', 'GET', null, true);
  return res
}

export const serverGetProductBrandData = async () => {
  const res = await serverRequest('/product/brand', 'GET', null, true);
  return res
}

export const serverGetProductColorData = async () => {
  const res = await serverRequest('/product/color', 'GET', null, true);
  return res
}

export const serverGetProductOccasionData = async () => {
  const res = await serverRequest('/product/occasion', 'GET', null, true);
  return res
}

export const serverGetProductPlatingData = async () => {
  const res = await serverRequest('/product/plating', 'GET', null, true);
  return res
}

export const serverGetProductStoneTypeData = async () => {
  const res = await serverRequest('/product/stoneType', 'GET', null, true);
  return res
}

export const serverGetProductTrendData = async () => {
  const res = await serverRequest('/product/trend', 'GET', null, true);
  return res
}

export const serverGetProductTypeData = async () => {
  const res = await serverRequest('/product/type', 'GET', null, true);
  return res
}

////////// Push Notification Api //////////
export const serverPushNotification = async (data: any) => {
  const res = await serverRequest('/push/notification', 'POST', data, true);
  return res
}


////////// Payments And Refund Api //////////
export const serverCapturePayment = async (paymentId: string, payment: number) => {
  const res = await serverRequest('/capture/payment', 'POST', {paymentId, payment}, true);
  return res
}

export const serverRefundPayment = async (paymentId: string, payment: number) => {
  const res = await serverRequest('/refund/payment', 'POST', {paymentId, payment}, true);
  return res
}

/********** Delivery Address Api **********/
export const serverGetDeliveryAddressData = async (userId: string) => {
  let url = `/delivery/address`;
  if (userId) {
    url += `?userId=${userId}`;
  }
  const res = await serverRequest(url, "GET", null, true);
  return res;
};

export const serverAddDeliveryAddressData = async (data: any) => {
  let url = `/delivery/address`;
  const res = await serverRequest(url, "POST", data, true);
  return res;
};

export const serverUpdateDeliveryAddressData = async (data: any) => {
  let url = `/delivery/address`;
  const res = await serverRequest(url, "PUT", data, true);
  return res;
};

/********** Reward Api **********/
export const serverGetRewardData = async (userId: string) => {
  let url = `/reward`;
  if (userId) {
    url += `?userId=${userId}`;
  }
  const res = await serverRequest(url, "GET", null, true);
  return res;
};