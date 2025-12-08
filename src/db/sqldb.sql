

CREATE DATABASE CakeManagementDB;
GO

USE CakeManagementDB;
GO


DROP TABLE IF EXISTS Cake_Orders;
DROP TABLE IF EXISTS Cake_Designs;


CREATE TABLE Cake_Designs (
    DesignID INT IDENTITY(1,1) PRIMARY KEY,
    DesignName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    BaseFlavor NVARCHAR(100),
    Size NVARCHAR(50) NOT NULL DEFAULT 'Small',
    BasePrice AS 
        CASE 
            WHEN Size = 'Small' THEN 1000
            WHEN Size = 'Medium' THEN 2000
            WHEN Size = 'Large' THEN 3000
            ELSE 0
        END PERSISTED,
    ImageUrl NVARCHAR(255),
    Category NVARCHAR(100),
    Availability BIT DEFAULT 1, 
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO

INSERT INTO Cake_Designs (DesignName, Description, BaseFlavor, Size, ImageUrl, Category)
VALUES
('Birthday Bliss', 'Colorful birthday cake with sprinkles.', 'Vanilla', 'Small', 'birthday.jpg', 'Birthday'),
('Wedding Elegance', 'Three-tier fondant wedding cake.', 'Chocolate', 'Large', 'wedding.jpg', 'Wedding'),
('Classic Mocha', 'Elegant mocha cake with smooth frosting.', 'Mocha', 'Medium', 'mocha.jpg', 'Classic');
GO


SELECT * FROM Cake_Designs;
GO
TRUNCATE TABLE Cake_Designs;


ALTER TABLE Cake_Designs
ADD AvailableSizes NVARCHAR(100) NULL;  


DROP TABLE IF EXISTS Cake_Designs;
GO
DROP TABLE IF EXISTS Users;




CREATE TABLE Cake_Orders(
    Id INT PRIMARY KEY IDENTITY(1,1),
    userid INT NOT NULL,
    DesignID INT NULL, 
    Size NVARCHAR(10) NOT NULL CHECK (Size IN ('Small', 'Medium', 'Large')),
    Flavor NVARCHAR(50) NOT NULL,
    Message NVARCHAR(MAX) NULL,
    Status NVARCHAR(30) NOT NULL DEFAULT 'Pending',
    DeliveryDate DATE NOT NULL,
    Price AS 
        CASE 
            WHEN Size = 'Small' THEN 1000
            WHEN Size = 'Medium' THEN 2000
            WHEN Size = 'Large' THEN 3000
            ELSE 0
        END PERSISTED,
    Notes NVARCHAR(MAX) NULL,
    ExtendedDescription NVARCHAR(MAX) NULL,
    SampleImages NVARCHAR(MAX) NULL,     
    ColorPreferences NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2 DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME()
);
GO


INSERT INTO Cake_Orders (
    
        userid
, DesignID, Size, Flavor, Message, Status, DeliveryDate, Notes,
    ExtendedDescription, SampleImages, ColorPreferences
)
VALUES

(1, 2, 'Medium', 'Chocolate', 'Happy Birthday, Tanui!', 'Pending', '2025-10-25', 
 'Include gold sprinkles and floral piping.', 
 'Elegant piping with gold trim', 
 'birthday1.jpg', 'Gold,White'),

(2, NULL, 'Large', 'Vanilla', 'Congratulations!', 'Pending', '2025-11-02', 
 'Pastel roses and initials on top.', 
 'Elegant white base with pastel roses', 
 'wedding1.jpg', 'White,Pink,Pastel Blue'),

(3, 5, 'Small', 'Red Velvet', 'Love You!', 'Pending', '2025-10-30', 
 'Heart-shaped top with red glaze.', 
 'Heart-shaped red velvet with rose accents', 
 'valentine1.jpg', 'Red'),

(4, NULL, 'Medium', 'Lemon', 'Happy 5th Birthday!', 'Pending', '2025-11-05', 
 'Rainbow colors and cartoon stars.', 
 'Cartoon theme with rainbow colors and stars', 
 'kids1.jpg', 'Yellow,Blue,Green'),

(5, 3, 'Large', 'Mocha', 'Happy Anniversary!', 'Pending', '2025-11-10', 
 'Chocolate lace with gold accents.', 
 'Elegant chocolate lace design with gold trim', 
 'anniversary1.jpg', 'Brown,Gold');
GO

SELECT * FROM Cake_Orders;
GO
    
CREATE TABLE Users(
  userid INT PRIMARY KEY IDENTITY(1,1),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  Created_At DATETIME2 DEFAULT SYSDATETIME(),
  Updated_At DATETIME2 DEFAULT SYSDATETIME()
);
ALTER TABLE Users
ADD verification_code VARCHAR(10),
    is_verified BIT DEFAULT 0;


INSERT INTO Users (name, email, password, phone, address, role)
VALUES
('Elizabeth Njoki', 'liz@gmail.com', 'hashedpassword123', '0712345678', 'Nyeri', 'admin'),
('James Mwangi', 'jamesbaker@gmail.com', 'hashedpassword456', '0722987456', 'Nakuru', 'baker'),
('Ann Wanjiku', 'annwanjiku@gmail.com', 'hashedpassword789', '0723456789', 'Nairobi', 'customer'),
('Peter Otieno', 'peter.otieno@gmail.com', 'hashedpassword321', '0711456321', 'Kisumu', 'customer'),
('Grace Njeri', 'grace.njeri@gmail.com', 'hashedpassword654', '0709345678', 'Mombasa', 'baker');

UPDATE Users SET role = 'admin' WHERE name = 'defla';

SELECT * FROM users;
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Users';


DROP TABLE IF EXISTS ReadyMade_Cakes ;

 CREATE TABLE ReadyMade_Cakes (
    cakeId INT IDENTITY(1,1) PRIMARY KEY,
    cakeName VARCHAR(100) NOT NULL,
    flavorsUsed VARCHAR(150) NOT NULL,
    size VARCHAR(20) CHECK (size IN ('Small', 'Medium', 'Large')),
    price AS 
        CASE 
            WHEN size = 'Small' THEN 1000
            WHEN size = 'Medium' THEN 2000
            WHEN size = 'Large' THEN 3000
            ELSE 0
        END PERSISTED,
    imageURL VARCHAR(255),
    quantityAvailable INT DEFAULT 1,
    isactive BIT DEFAULT 1, 
    createdAt DATETIME2 DEFAULT SYSDATETIME(),
    updatedAt DATETIME2 DEFAULT SYSDATETIME()
);

INSERT INTO ReadyMade_Cakes (
    cakeName, flavorsUsed, size, imageURL, 
    quantityAvailable, isactive, createdAt, updatedAt
)
VALUES 
    ('Decadent Chocolate Cake', 'Chocolate, Ganache', 'Small',
    'chocolate.jpg', 15, 1, SYSDATETIME(), SYSDATETIME()),

    ('Classic Vanilla Bean', 'Vanilla, Buttercream', 'Medium', 
    'vanilla.jpg', 8, 1, SYSDATETIME(), SYSDATETIME()),

    ('Red Velvet Delight', 'Red Velvet, Cream Cheese', 'Large',
    'redvelvet.jpg', 3, 1, SYSDATETIME(), SYSDATETIME()),

    ('Black Forest Treat', 'Chocolate, Cherry Cream', 'Medium', 
    'blackforest.jpg', 12, 1, SYSDATETIME(), SYSDATETIME()),

    ('Strawberry Bliss Cupcakes', 'Strawberry, Vanilla Cream', 'Small', 
    'strawberry_cupcakes.jpg', 10, 1, SYSDATETIME(), SYSDATETIME()),

    ('Choco Lava Cupcakes', 'Chocolate, Molten Ganache', 'Medium',
    'choco_lava_cupcakes.jpg', 12, 1, SYSDATETIME(), SYSDATETIME()),

    ('Vanilla Swirl Cupcakes', 'Vanilla, Butter Frosting', 'Large', 
    'vanilla_swirl_cupcakes.jpg', 6, 1, SYSDATETIME(), SYSDATETIME());


SELECT * FROM ReadyMade_Cakes;

USE CakeManagementDB;   
ALTER TABLE Users
ADD verification_code VARCHAR(10),
    is_verified BIT DEFAULT 0;

    USE CakeManagementDB;  
DELETE FROM Users WHERE email = 'njokimunywa@gmail.com';


DROP TABLE IF EXISTS Cake_Stages ;

CREATE TABLE Cake_Stages(
    ID INT PRIMARY KEY IDENTITY(1,1),
    OrderId INT NOT NULL,
    StageName NVARCHAR(50) NOT NULL,        
    Status NVARCHAR(30) DEFAULT 'Pending',   
    StartedAt DATETIME2 NULL,
    CompletedAt DATETIME2 NULL,
    Notes NVARCHAR(MAX) NULL,
    UpdatedAt DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (OrderId) REFERENCES Cake_Orders(Id) ON DELETE CASCADE
);

INSERT INTO Cake_Stages (OrderId, StageName, Status, StartedAt, CompletedAt, Notes)
VALUES
(1, 'Baking', 'Completed', '2025-10-20 09:00', '2025-10-20 12:00', 'Baked successfully.'),
(2, 'Decorating', 'In Progress', '2025-10-21 10:00', NULL, 'Working on floral piping.'),
(3, 'Baking', 'Completed', '2025-10-22 08:30', '2025-10-22 11:30', 'Baked without issues.'),
(3, 'Decorating', 'Pending', NULL, NULL, 'Scheduled for tomorrow.'),
(2, 'Baking', 'Completed', '2025-10-23 07:45', '2025-10-23 10:15', 'Red velvet baked perfectly.');

SELECT * FROM Cake_Stages;

DROP TABLE IF EXISTS Deliveries ;
CREATE TABLE Deliveries (
    DeliveryID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    DeliveryAddress VARCHAR(255) NOT NULL,
    DeliveryDate DATETIME NOT NULL,
    CourierName VARCHAR(100),
    CourierContact VARCHAR(50),
    Status VARCHAR(50) DEFAULT 'Scheduled',
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
    );
     
     INSERT INTO Deliveries (OrderID, DeliveryAddress, DeliveryDate, CourierName, CourierContact, Status)
VALUES 
(101, 'Karatina, Nyeri, Kenya', '2025-10-30 10:00:00', 'SwiftRider', '+254712345678', 'Scheduled'),

(102, 'Nakuru Town, Kenya', '2025-10-29 14:30:00', 'FastCourier', '+254700998877', 'In Transit'),

(103, 'Kisumu CBD, Kenya', '2025-10-28 09:00:00', 'CakeExpress', '+254713223344', 'Delivered'),

(104, 'Thika Road, Nairobi, Kenya', '2025-10-31 16:00:00', 'SweetDrop', '+254798112233', 'Scheduled');

SELECT * FROM Deliveries;



