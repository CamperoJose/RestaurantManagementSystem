create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    numero varchar(20),
    correo varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (correo)
);

insert into user values (default, 'admin', '7766', 'campero@gmail.com', 'admin', 'true', 'admin');

create table category(
     id int NOT NULL AUTO_INCREMENT,
    name varchar (255) NOT NULL,
    primary key(id)
 );


create table product(
     id int NOT NULL AUTO_INCREMENT,
    name varchar (255) NOT NULL,
    categoryID integer NOT NULL, 
    description varchar(255),
    price integer,
    status varchar(255),
    primary key(id)
 );

create table bill(
    id int NOT NULL AUTO_INCREMENT,
    uuid  varchar (255) NOT NULL,
    name  varchar (255) NOT NULL,
    correo  varchar (255) NOT NULL,
    numero  varchar (255) NOT NULL,
    paymentMethod  varchar (255) NOT NULL,
    total int NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy  varchar (255) NOT NULL,
    primary key(id)
);