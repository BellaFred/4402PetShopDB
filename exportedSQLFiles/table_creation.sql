-- commands to create tables

-- employee table
CREATE TABLE Employee (
  employeeID CHAR(8),
  name VARCHAR(50),
  mobile CHAR(9),
  email VARCHAR(50),
  password VARCHAR(50),
  address VARCHAR(250),
  salary INTEGER,
  role VARCHAR(8),
  routingNumber CHAR(9),
  PRIMARY KEY (employeeID)
);

-- customer table
CREATE TABLE Customer (
  customerID CHAR(8),
  name VARCHAR(50),
  mobile CHAR(9),
  email VARCHAR(50),
  password VARCHAR(50),
  address VARCHAR(250),
  PRIMARY KEY (customerID)
);

-- pet table
CREATE TABLE Pet (
  petID CHAR(8),
  species VARCHAR(10),
  breed VARCHAR(50),
  name VARCHAR(50),
  age INTEGER,
  gender VARCHAR(6),
  isFixed VARCHAR(3),
  generalDescription VARCHAR(100),
  healthInfo VARCHAR(9),
  adoptionFee NUMERIC(5,2),
  adoptionStatus VARCHAR(9),
  PRIMARY KEY (petID)
);

-- paymentInfo table
CREATE TABLE PaymentInfo (
  paymentID CHAR(8),
  customerID CHAR(8),
  cardNumber CHAR(16),
  cardExpiration CHAR(5),
  cvv CHAR(3),
  cardholder VARCHAR(50),
  billingAddress VARCHAR(250),
  PRIMARY KEY (paymentID),
  FOREIGN KEY (customerID) REFERENCES Customer (customerID)
);

-- orderInfo table
CREATE TABLE OrderInfo (
  orderID CHAR(8),
  customerID CHAR(8),
  employeeID CHAR(8),
  paymentID CHAR(8),
  petID CHAR(8),
  orderDate DATE,
  totalAmount NUMERIC(10,2),
  PRIMARY KEY (orderID),
  FOREIGN KEY (customerID) REFERENCES Customer (customerID),
  FOREIGN KEY (employeeID) REFERENCES Employee (employeeID),
  FOREIGN KEY (paymentID) REFERENCES PaymentInfo (paymentID),
  FOREIGN KEY (petID) REFERENCES Pet (petID)
);