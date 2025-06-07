-- gestión_de_stock.sql

-- 0) Crear la base de datos y seleccionarla
CREATE DATABASE IF NOT EXISTS gestion_de_stock
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;
USE gestion_de_stock;


START TRANSACTION;

-- 1) Tabla productos (padre de movimientos)
CREATE TABLE productos (
  product_id      VARCHAR(10)   NOT NULL PRIMARY KEY,
  product_name    VARCHAR(100)  NOT NULL,
  sku             VARCHAR(50),
  unit_of_measure VARCHAR(20),
  cost            DECIMAL(10,2),
  sale_price      DECIMAL(10,2),
  category        VARCHAR(50),
  location        VARCHAR(50),
  active          VARCHAR(5)    DEFAULT 'Yes',
  foto            VARCHAR(255)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 2) Tabla movimientos (hija de productos)
CREATE TABLE movimientos (
  movement_id   VARCHAR(10)   NOT NULL PRIMARY KEY,
  date          DATETIME      NOT NULL,
  product_id    VARCHAR(10),
  movement_type VARCHAR(30),
  quantity      INT,
  order_id      VARCHAR(20),
  notes         TEXT,
  INDEX (product_id),
  CONSTRAINT fk_mov_product
    FOREIGN KEY (product_id) REFERENCES productos(product_id)
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 3) Tabla usuarios (independiente)
CREATE TABLE usuarios (
  id              INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  email           VARCHAR(100) NOT NULL UNIQUE,
  password        VARCHAR(255) NOT NULL,
  rol             ENUM('administrador','operador','analista') DEFAULT 'operador',
  foto            VARCHAR(255),
  fecha_registro  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARSET=utf8mb4;

-- 4) Datos iniciales en productos
INSERT INTO productos
  (product_id, product_name, sku, unit_of_measure, cost, sale_price, category, location, active, foto)
VALUES
  ('P001','Notebook HP 240 G7','HP-240G7','unidad',560.00,790.00,'Electrónica','Depósito 1','Yes','media/P001_foto.jpg'),
  ('P002','Mouse Logitech M170','LOG-M170','unidad',9.50,14.99,'Accesorios','Depósito 1','Yes',NULL),
  ('P003','Silla ergonómica Black','SILLA-BLK','unidad',75.00,120.00,'Mobiliario','Depósito 2','Yes',NULL),
  ('P004','Monitor Samsung 24”','SAM-24F','unidad',110.00,169.99,'Electrónica','Depósito 2','Yes',NULL),
  ('P005','Tóner HP 107A','TON-HP107A','unidad',18.00,32.50,'Insumos','Depósito 1','Yes',NULL),
  ('P006','Resma Papel A4 500h','PAP-A4500','paquete',5.00,7.80,'Papelería','Depósito 3','Yes',NULL),
  ('P007','Cámara de seguridad Dahua','DAHUA-CAM','unidad',45.00,79.00,'Seguridad','Depósito 2','Yes',NULL),
  ('P008','Cable UTP Cat6 20m','UTP-CAT6-20','unidad',4.50,8.50,'Redes','Depósito 1','Yes',NULL),
  ('P009','Teclado Logitech K120','LOG-K120','unidad',12.00,19.50,'Accesorios','Depósito 1','Yes',NULL),
  ('P010','Impresora HP Laser 107a','HP-L107A','unidad',120.00,210.00,'Electrónica','Depósito 2','Yes',NULL),
  ('P011','Vasos','HP-240G7','unidad',34.00,79.00,'Hogar','Depósito 3','Yes','media/P011_foto.jpeg');

-- 5) Datos iniciales en movimientos
INSERT INTO movimientos
  (movement_id, date, product_id, movement_type, quantity, order_id, notes)
VALUES
  ('M001','2025-05-30 19:51:11','P001','Ingreso',23,NULL,'Compra'),
  ('M002','2025-05-30 19:51:30','P002','Ingreso',40,NULL,'Compra'),
  ('M003','2025-05-30 19:58:36','P002','Egreso',5,NULL,'Venta'),
  ('M004','2025-05-30 20:00:50','P003','Ingreso',100,NULL,'Compra'),
  ('M005','2025-05-30 20:11:44','P004','Ingreso',7,NULL,'Compra'),
  ('M006','2025-05-30 20:25:04','P001','Egreso',4,NULL,'Venta'),
  ('M007','2025-05-30 20:28:41','P001','Ingreso',9,NULL,'Compra'),
  ('M008','2025-05-30 20:35:22','P005','Egreso',5,NULL,'Compra'),
  ('M009','2025-05-30 20:35:40','P005','Ingreso',20,NULL,'Compra');

-- 6) Datos iniciales en usuarios
INSERT INTO usuarios
  (id, nombre, email, password, rol, foto, fecha_registro)
VALUES
  (1,'Joel Ochoa','admin@admin.com',
   '$2y$10$Rm70eNYaoji4g71plUUzC.mN8I7VQLoin844wDCKURuX.hx25q3jK',
   'administrador','media/admin_admin.com_foto.jpg','2025-05-29 18:55:16'),
  (2,'Jose','jose@admin.com',
   '$2b$12$RcYfyGcD.ABI9SStWT0EHe2BJNurGV3FijC8sKazRQVjx4U5tu3NO',
   'operador','media/jose_admin.com_foto.jpg','2025-05-29 21:07:19'),
 (3,'Usuario Test','usuario@test.com',
   '$2b$12$WGjJP.9tOeJq/XO2QA6GAekjP1HVzsTekuVk9tCXhrKKNizZKcJty',
   'administrador','media/usuario_test.com_foto.avif','2025-06-07 14:33:54'),
  (4,'Federico Vicente','analista@test.com',
   '$2b$12$pbQAzKNAtwakTbQG77bLGug7dtOm3I5cJJH1ShbQCskuDxfaJsNKq',
   'analista','media/analista_test.com_foto.avif','2025-06-07 14:36:42');

COMMIT;