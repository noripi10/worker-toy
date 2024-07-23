-- Migration number: 0001 	 2024-07-23T01:49:03.455Z
DROP TABLE IF EXISTS Customers;

CREATE TABLE IF NOT EXISTS Customers (CustomerId INTEGER PRIMARY KEY, CompanyName TEXT, ContactName TEXT);