DROP DATABASE IF EXISTS zaratan_dev;
CREATE DATABASE zaratan_dev;
USE zaratan_dev;

CREATE TABLE terrains_details(
	id INT NOT NULL AUTO_INCREMENT,
	`block` INT NOT NULL,
	`number` INT NOT NULL,
	`address` VARCHAR(255) NOT NULL,
	area DECIMAL(12,2) NOT NULL,
	shape VARCHAR(50) NOT NULL,
	dimensions VARCHAR(255) NOT NULL,
	deed VARCHAR(255) DEFAULT '',
	deed_date DATE DEFAULT '1900-01-01',
	registry VARCHAR(255) DEFAULT '',
	observations VARCHAR(500) DEFAULT '',

	PRIMARY KEY(id),
	UNIQUE(`block`, `number`)
) ENGINE=INNODB;

CREATE TABLE sales_details(
	id INT NOT NULL AUTO_INCREMENT,
	terrain_id INT NOT NULL,
	open_at DATE NOT NULL,
	close_at DATE NOT NULL,
	installment_count INT UNSIGNED NOT NULL,
	price DECIMAL(12,2) NOT NULL,
	down_payment DECIMAL(12,2) NOT NULL,
	payment_type VARCHAR(50) NOT NULL,
	progress VARCHAR(10) NOT NULL,

	PRIMARY KEY(id),
	UNIQUE(terrain_id),

	FOREIGN KEY(terrain_id)
	REFERENCES terrains_details(id)
	ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE installments(
	id INT NOT NULL AUTO_INCREMENT,
	sale_id INT NOT NULL,
	price DECIMAL(12,2) NOT NULL,
	payment_date DATE NOT NULL,
	progress VARCHAR(10) NOT NULL,

	PRIMARY KEY(id),
	UNIQUE(sale_id, payment_date),

	FOREIGN KEY(sale_id)
	REFERENCES sales_details(id)
	ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE buyers(
	id INT NOT NULL AUTO_INCREMENT,
	full_name VARCHAR(100) NOT NULL,
	cpf VARCHAR(14) UNIQUE DEFAULT NULL,
	cnpj VARCHAR(18) UNIQUE DEFAULT NULL,
	`address` VARCHAR(255) DEFAULT '',
	city VARCHAR(40) DEFAULT '',
	`state` VARCHAR(40) DEFAULT '',
	cep VARCHAR(9) DEFAULT '',
	landline_phone VARCHAR(15) DEFAULT '',
	mobile_phone VARCHAR(16) DEFAULT '',
	email VARCHAR(40) UNIQUE DEFAULT NULL,

	PRIMARY KEY(id)
) ENGINE=INNODB;

CREATE TABLE sales_buyers(
	sale_id INT NOT NULL,
	buyer_id INT NOT NULL,

	UNIQUE(sale_id, buyer_id),
	INDEX(sale_id, buyer_id),

	FOREIGN KEY(sale_id)
	REFERENCES sales_details(id)
	ON DELETE CASCADE,

	FOREIGN KEY(buyer_id)
	REFERENCES buyers(id)
	ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE users(
	id INT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	`password` VARCHAR(100) NOT NULL,

	PRIMARY KEY(id)
) ENGINE=INNODB;

INSERT INTO terrains_details(`block`, `number`, `address`, area, shape, dimensions, deed, deed_date, registry, observations)
VALUES
(1, 1,
"rua da quadra 1 lote 1. rua da quadra 1 lote 1. rua da quadra 1 lote 1. rua da quadra 1 lote 1.",
9653.87,
"Retângulo",
"Base: 100m. Altura: 50m.",
"ESCRITURA QUADRA 1 LOTE 1",
"1994-06-21",
"REGISTRO QUADRA 1 LOTE 1. REGISTRO QUADRA 1 LOTE 1. REGISTRO QUADRA 1 LOTE 1.",
"QUADRA 1 LOTE 1 observervação. QUADRA 1 LOTE 1 observervação. QUADRA 1 LOTE 1 observervação.
QUADRA 1 LOTE 1 observervação. QUADRA 1 LOTE 1 observervação. QUADRA 1 LOTE 1 observervação."),
(1, 2,
"rua da quadra 1 lote 2. rua da quadra 1 lote 2. rua da quadra 1 lote 2. rua da quadra 1 lote 2.",
8660.60,
"Retângulo",
"Base: 100m. Altura: 50m.",
"ESCRITURA QUADRA 1 LOTE 2",
"1995-07-22",
"REGISTRO QUADRA 1 LOTE 2. REGISTRO QUADRA 1 LOTE 2. REGISTRO QUADRA 1 LOTE 2.",
"QUADRA 1 LOTE 2 observervação. QUADRA 1 LOTE 2 observervação. QUADRA 1 LOTE 2 observervação.
QUADRA 1 LOTE 2 observervação. QUADRA 1 LOTE 2 observervação. QUADRA 1 LOTE 2 observervação."),
(1, 3,
"rua da quadra 1 lote 3. rua da quadra 1 lote 3. rua da quadra 1 lote 3. rua da quadra 1 lote 3.",
6770.70,
"Irregular",
"Direita: 100m. Esquerda: 100m. Frente-lateral-esquerda: 50m.",
"ESCRITURA QUADRA 1 LOTE 3",
"1996-08-23",
"REGISTRO QUADRA 1 LOTE 3. REGISTRO QUADRA 1 LOTE 3. REGISTRO QUADRA 1 LOTE 3.",
"QUADRA 1 LOTE 3 observervação. QUADRA 1 LOTE 3 observervação. QUADRA 1 LOTE 3 observervação.
QUADRA 1 LOTE 3 observervação. QUADRA 1 LOTE 3 observervação. QUADRA 1 LOTE 3 observervação."),
(2, 1,
"rua da quadra 2 lote 1. rua da quadra 2 lote 1. rua da quadra 2 lote 1. rua da quadra 2 lote 1.",
5660.60,
"Irregular",
"Direita: 100m. Esquerda: 100m. Frente-lateral-esquerda: 50m.",
"ESCRITURA QUADRA 2 LOTE 1",
"1997-09-24",
"REGISTRO QUADRA 2 LOTE 1. REGISTRO QUADRA 2 LOTE 1. REGISTRO QUADRA 2 LOTE 1.",
"QUADRA 2 LOTE 1 observervação. QUADRA 2 LOTE 1 observervação. QUADRA 2 LOTE 1 observervação.
QUADRA 2 LOTE 1 observervação. QUADRA 2 LOTE 1 observervação. QUADRA 2 LOTE 1 observervação."),
(2, 2,
"rua da quadra 2 lote 2. rua da quadra 2 lote 2. rua da quadra 2 lote 2. rua da quadra 2 lote 2.",
31400,
"Circular",
"Raio: 100m.",
"ESCRITURA QUADRA 2 LOTE 2",
"1998-10-25",
"REGISTRO QUADRA 2 LOTE 2. REGISTRO QUADRA 2 LOTE 2. REGISTRO QUADRA 2 LOTE 2.",
"QUADRA 2 LOTE 2 observervação. QUADRA 2 LOTE 2 observervação. QUADRA 2 LOTE 2 observervação.
QUADRA 2 LOTE 2 observervação. QUADRA 2 LOTE 2 observervação. QUADRA 2 LOTE 2 observervação."),
(3, 1,
"rua da quadra 3 lote 1. rua da quadra 3 lote 1. rua da quadra 3 lote 1. rua da quadra 3 lote 1.",
31400,
"Retângulo",
"Base: 100m. Altura: 50m.",
"ESCRITURA QUADRA 3 LOTE 1",
"1999-11-26",
"REGISTRO QUADRA 3 LOTE 1. REGISTRO QUADRA 3 LOTE 1. REGISTRO QUADRA 3 LOTE 1.",
"QUADRA 3 LOTE 1 observervação. QUADRA 3 LOTE 1 observervação. QUADRA 3 LOTE 1 observervação.
QUADRA 3 LOTE 1 observervação. QUADRA 3 LOTE 1 observervação. QUADRA 3 LOTE 1 observervação."),
(4, 1,
"rua da quadra 4 lote 1. rua da quadra 4 lote 1. rua da quadra 4 lote 1. rua da quadra 4 lote 1.",
41600.60,
"Retângulo",
"Base: 100m. Altura: 50m.",
"ESCRITURA QUADRA 4 LOTE 1",
"2999-12-27",
"REGISTRO QUADRA 4 LOTE 1. REGISTRO QUADRA 4 LOTE 1. REGISTRO QUADRA 4 LOTE 1.",
"QUADRA 4 LOTE 1 observervação. QUADRA 4 LOTE 1 observervação. QUADRA 4 LOTE 1 observervação.
QUADRA 4 LOTE 1 observervação. QUADRA 4 LOTE 1 observervação. QUADRA 4 LOTE 1 observervação."),
(4, 2,
"rua da quadra 4 lote 2. rua da quadra 4 lote 2. rua da quadra 4 lote 2. rua da quadra 4 lote 2.",
42200.20,
"Retângulo",
"Base: 100m. Altura: 50m.",
"ESCRITURA QUADRA 4 LOTE 2",
"2001-01-28",
"REGISTRO QUADRA 4 LOTE 2. REGISTRO QUADRA 4 LOTE 2. REGISTRO QUADRA 4 LOTE 2.",
"QUADRA 4 LOTE 2 observervação. QUADRA 4 LOTE 2 observervação. QUADRA 4 LOTE 2 observervação.
QUADRA 4 LOTE 2 observervação. QUADRA 4 LOTE 2 observervação. QUADRA 4 LOTE 2 observervação."),
(5, 1,
"rua da quadra 5 lote 1. rua da quadra 5 lote 1. rua da quadra 5 lote 1. rua da quadra 5 lote 1.",
55100.10,
"Retângulo",
"Base: 100m. Altura: 50m.",
"ESCRITURA QUADRA 5 LOTE 1",
"2002-02-28",
"REGISTRO QUADRA 5 LOTE 1. REGISTRO QUADRA 5 LOTE 1. REGISTRO QUADRA 5 LOTE 1.",
"QUADRA 5 LOTE 1 observervação. QUADRA 5 LOTE 1 observervação. QUADRA 5 LOTE 1 observervação.
QUADRA 5 LOTE 1 observervação. QUADRA 5 LOTE 1 observervação. QUADRA 5 LOTE 1 observervação."),
(6, 1,
"rua da quadra 6 lote 1. rua da quadra 6 lote 1. rua da quadra 6 lote 1. rua da quadra 6 lote 1.",
66100.10,
"Retângulo",
"Base: 100m. Altura: 60m.",
"escritura quadra 6 lote 1",
"1979-12-20",
"REGISTRO QUADRA 6 LOTE 1. REGISTRO QUADRA 6 LOTE 1. REGISTRO QUADRA 6 LOTE 1.",
"QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação.
QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação. QUADRA 6 LOTE 1 observervação."),
(6, 2,
"rua da quadra 6 lote 2. rua da quadra 6 lote 2. rua da quadra 6 lote 2. rua da quadra 6 lote 2.",
66222.22,
"Retângulo",
"Base: 222m. Altura: 222m.",
"",
null,
"REGISTRO QUADRA 6 LOTE 2. REGISTRO QUADRA 6 LOTE 2. REGISTRO QUADRA 6 LOTE 2.",
"QUADRA 6 LOTE 2 observervação. QUADRA 6 LOTE 2 observervação. QUADRA 6 LOTE 2 observervação.
QUADRA 6 LOTE 2 observervação. QUADRA 6 LOTE 2 observervação. QUADRA 6 LOTE 2 observervação.");

INSERT INTO sales_details(terrain_id, open_at, close_at, installment_count, price, down_payment, payment_type, progress)
VALUES
(1, "1990-06-21", "1990-09-21", 3, 3000.90, 3000.90,
"Parcelado",
"Aberto"),
(2, "2015-05-22", "2015-05-22", 0, 670523.14, 670523.14,
"Vista",
"Fechado"),
(3, "1980-09-02", "1980-11-02", 2, 2000.66, 2000.66,
"Parcelado",
"Fechado"),
(4, "1993-02-01", "1993-02-01", 0, 285606.54, 285606.54,
"Vista",
"Aberto"),
(7, "2010-05-15", "2010-05-15", 0, 777.87, 777.87,
"Vista",
"Fechado"),
(8, "2003-03-13", "2003-03-16", 0, 880.80, 808.80,
"Vista",
"Fechado"),
(9, "2000-02-16", "2000-02-16", 0, 900.60, 900.60,
"Vista",
"Fechado"),
(10, "1980-09-02", "1980-11-02", 2, 2000.66, 2000.66,
"Parcelado",
"Fechado"),
(11, "1980-01-15", "1980-01-15", 0, 1111.60, 1111.60,
"Vista",
"Fechado");

INSERT INTO installments(sale_id, price, payment_date, progress)
VALUES
(1, 1000.30, "1990-07-21",
"Pendente"),
(1, 1000.30, "1990-08-21",
"Pendente"),
(1, 1000.30, "1990-09-21",
"Pendente"),
(3, 1000.33, "1980-10-02",
"Quitado"),
(3, 1000.33, "1980-11-02",
"Quitado"),
(5, 100.10, "1985-02-15",
"Quitado"),
(5, 100.10, "1990-02-15",
"Quitado"),
(5, 100.10, "1995-02-15",
"Pendente"),
(5, 100.10, "2000-02-15",
"Pendente"),
(5, 100.10, "2005-02-15",
"Pendente"),
(5, 100.10, "2010-02-15",
"Pendente"),
(8, 1000.33, "1980-10-02",
"Quitado"),
(8, 1000.33, "1980-11-02",
"Quitado");

INSERT INTO buyers(
  full_name,
  cpf,
  cnpj,
  `address`,
  city,
  `state`,
  cep,
  landline_phone,
  mobile_phone,
  email)
VALUES(
  "Vitória Teixeira Sampaio Da Silva",
  "134.889.266-36",
  null,
  "Rua Paracatu, Bairro Parque Imperial, 598",
  "São Paulo",
  "São Paulo",
  "03962-040",
  "(031) 3330-4333",
  "",
  "vitoriateixeira@gmail.com"
),
(
  "Julia Fogaça Teixeira",
  "135.889.288-86",
  null,
  "Rua Maria Luísa do Val Penteado, Bairro São Matheus, 64",
  "São Paulo",
  "São Paulo",
  "06662-040",
  "",
  "(033) 91031-4294",
  "juliafogaca@uol.com.br"
),
(
  "Emanuelly Araújo Denk",
  "132.877.262-33",
  null,
  "Rua Rua Domingos Olímpio, Bairro Centro, 304",
  "Sobral",
  "Ceará",
  "62011-140",
  "(077) 3555-0983",
  "",
  "emanudenk@gmail.com"
),
(
  "Gabriel Martins Lula Da Silva",
  "024.567.936-44",
  null,
  "Avenida Rio Branco, Centro, 87",
  "Rio de Janeiro",
  "Rio de Janeiro",
  "20040-002",
  "",
  "(071) 99856-9668",
  "gabrielmatinslula@bol.com"
),
(
  "Miguel Mendes Barbosa",
  "754.527.676-12",
  null,
  "Avenida Esbertalina Barbosa Damiani, Guriri Norte, 157",
  "São Mateus",
  "Espirito Santo",
  "29946-490",
  "",
  "(030) 93273-6260",
  "miguelbarbosa@gmail.com"
),
(
  "Americanas SA",
  null,
  "44.444.444/0001-41",
  "Avenida Contorno, Patio Savassi, 59",
  "Belo Horizonte",
  "Minas Gerais",
  "30946-490",
  "(031) 3273-6260",
  "",
  "sac@americanas.com"
),
(
  "Lotedor Company",
  null,
  "77.474.774/0001-71",
  "Avenida Savassi, Bairro Contorno, 942",
  "Salvador",
  "Bahia",
  "40444-490",
  "(031) 3333-3333",
  "",
  "sac@lotedorcompany.com"
);

INSERT INTO sales_buyers(sale_id, buyer_id)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 5),
(7, 5),
(8, 7),
(8, 1),
(9, 6),
(9, 7);

INSERT INTO users(name, email, password)
VALUES
("Aluisio", "aluisioordones1@gmail.com", "123456789"),
("Patricia", "patriciaordones1@gmail.com", "123456789");
