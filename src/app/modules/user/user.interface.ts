export type IAdmin = {
  password: string;
  admin: {
    email: string;
    name: string;
    phone: string;
  };
};

export type ICustomer = {
  password: string;
  customer: {
    email: string;
    name: string;
    phone: string;
  };
};
