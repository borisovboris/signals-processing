INSERT INTO country (name) VALUES ('India');
INSERT INTO country (name) VALUES ('Brazil');
INSERT INTO country (name) VALUES ('USA');
INSERT INTO country (name) VALUES ('Italy');
INSERT INTO country (name) VALUES ('Belarus');
INSERT INTO country (name) VALUES ('Belgium');
INSERT INTO country (name) VALUES ('Germany');
INSERT INTO country (id, name) VALUES (681, 'Bulgaria');
INSERT INTO country (name) VALUES ('China');
INSERT INTO country (name) VALUES ('Canada');
INSERT INTO country (name) VALUES ('Columbia');
INSERT INTO country (name) VALUES ('Republic of the Congo');
INSERT INTO country (name) VALUES ('Denmark');
INSERT INTO country (name) VALUES ('Fiji');
INSERT INTO country (name) VALUES ('Georgia');
INSERT INTO country (name) VALUES ('Serbia');
INSERT INTO country (name) VALUES ('Cuba');
INSERT INTO country (name) VALUES ('Cyprus');
INSERT INTO country (name) VALUES ('Croatia');
INSERT INTO country (name) VALUES ('Romania');
INSERT INTO country (name) VALUES ('Sweden');
INSERT INTO country (name) VALUES ('Norway');
INSERT INTO country (name) VALUES ('Hungary');
INSERT INTO country (name) VALUES ('Ireland');
INSERT INTO country (name) VALUES ('Japan');
INSERT INTO country (name) VALUES ('Venezuela');
INSERT INTO country (name) VALUES ('Luxembourg');
INSERT INTO country (name) VALUES ('Samoa');
INSERT INTO country (name) VALUES ('San Marino');
INSERT INTO country (name) VALUES ('Sao Tome and Principe');
INSERT INTO country (name) VALUES ('Saudi Arabia');
INSERT INTO country (name) VALUES ('Schaumburg-Lippe');
INSERT INTO country (name) VALUES ('Senegal');
INSERT INTO country (name) VALUES ('Seychelles');
INSERT INTO country (name) VALUES ('Sierra Leone');
INSERT INTO country (name) VALUES ('Singapore');
INSERT INTO country (name) VALUES ('Slovakia');
INSERT INTO country (name) VALUES ('Slovenia');
INSERT INTO country (name) VALUES ('South Africa');
INSERT INTO country (name) VALUES ('South Sudan');
INSERT INTO country (name) VALUES ('Spain');

INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Lovech', 5500);
INSERT INTO city (id, country_id, name, postal_code) VALUES (1700, 681, 'Sofia', 1000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Plovdiv', 2000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Stara Zagora', 3000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Varna', 4000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Burgas', 5000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Bansko', 6000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Troyan', 7000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Pleven', 8000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Montana', 9000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Vidin', 10000);
INSERT INTO city (country_id, name, postal_code) VALUES (681, 'Vraca', 11000);

INSERT INTO location (city_id, code, name, address, coordinates, description) 
VALUES (1700, 'BLOK_59_A', 'Blok 59 A', 'ul. "Professor Kiril Popov"', '42.64292808523189, 23.338815289344673', 'A place so majestic, you''d be lucky to live there');
INSERT INTO location (city_id, code, name, address, coordinates, description) 
VALUES (1700, 'MALL_OF_SOFIA', 'Mall of Sofia', 'Some ulitsa', '49.64292808523189, 32.338815289344673', 'Random');
INSERT INTO location (city_id, code, name, address, coordinates, description) 
VALUES (1700, 'BULGARIA_MALL', 'Bulgaria Mall', 'Some ulitsa', '65.64292808523189, 12.338815289344673', 'Random');



