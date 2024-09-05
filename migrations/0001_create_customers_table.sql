-- CreateTable
DROP TABLE IF EXISTS Customers;

CREATE TABLE "Customers" (
    "CustomerId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "CompanyName" TEXT NOT NULL,
    "ContactName" TEXT NOT NULL
);

