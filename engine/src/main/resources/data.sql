INSERT INTO country (name) 
VALUES 
('India'),
('Brazil'),
('USA'),
('Italy'),
('Belarus'),
('Belgium'),
('Germany'),
('China'),
('Canada'),
('Columbia'),
('Republic of the Congo'),
('Denmark'),
('Fiji'),
('Georgia'),
('Cuba'),
('Cyprus'),
('Croatia'),
('Romania'),
('Sweden'),
('Norway'),
('Hungary'),
('Ireland'),
('Japan'),
('Venezuela'),
('Luxembourg'),
('Samoa'),
('San Marino'),
('Sao Tome and Principe'),
('Saudi Arabia'),
('Schaumburg-Lippe'),
('Senegal'),
('Seychelles'),
('Sierra Leone'),
('Singapore'),
('Slovakia'),
('Slovenia'),
('South Africa'),
('South Sudan'),
('Spain');
INSERT INTO country (id, name) VALUES (681, 'Bulgaria');

INSERT INTO city (country_id, name, postal_code) 
VALUES 
(681, 'Lovech', 5500),
(681, 'Plovdiv', 2000),
(681, 'Stara Zagora', 3000),
(681, 'Varna', 4000),
(681, 'Burgas', 5000),
(681, 'Bansko', 6000),
(681, 'Troyan', 7000),
(681, 'Pleven', 8000),
(681, 'Montana', 9000),
(681, 'Vidin', 10000),
(681, 'Vraca', 11000);
INSERT INTO city (id, country_id, name, postal_code) VALUES (1700, 681, 'Sofia', 1000);

INSERT INTO location (city_id, code, name, address, coordinates, description, is_operational) 
VALUES
(1700, 'BLOK_59_A', 'Blok 59 A', 'ul. "Professor Kiril Popov"', '42.64292808523189, 23.338815289344673', 'A place so majestic, you''d be lucky to live there', true),
(1700, 'BULGARIA_MALL', 'Bulgaria Mall', '"Some ulitsa"', '65.64292808523189, 12.338815289344673', 'Random', true),
(1700, 'FAKULTETA', 'Fakulteta', '"Ulitsa Suhodolska"', '65.64292808523189, 12.338815289344673', 'Random', false);
INSERT INTO location (city_id, id, code, name, address, coordinates, description) 
VALUES
(1700, 50, 'MALL_OF_SOFIA', 'Mall of Sofia', '"Some ulitsa"', '49.64292808523189, 32.338815289344673', 'Random');


INSERT INTO composition_type (id, name) 
VALUES 
(1, 'Revolving door'),
(2, 'Escalator'),
(3, 'Fire alarm');

INSERT INTO composition_status (id, name, is_operational, is_broken, in_maintenance) 
VALUES 
(1, 'Composition not working', false, true, false),
(2, 'Composition in maintenance', false, false, true),
(3, 'Composition in order', true, false, false);

INSERT INTO composition (id, code, type_id, location_id, status_id) 
VALUES 
(1, 'REVOLVING_DOOR', 1, 50, 3),
(2, 'ESCALATOR', 2, 50, 1),
(3, 'FIRE_ALARM', 3, 50, 3);
ALTER SEQUENCE composition_id_seq RESTART WITH 1000;

INSERT INTO composition_status_record (composition_id, status_id) 
VALUES 
(1, 1),
(1, 2);

INSERT INTO device_status(id, name, is_operational, is_broken, in_maintenance) 
VALUES 
(1, 'Device not working', false, true, false),
(2, 'Device in maintenance', false, false, true),
(3, 'Device in order', true, false, false);
ALTER SEQUENCE device_status_id_seq RESTART WITH 1000;

INSERT INTO device (id, code, name, composition_id, status_id) 
VALUES 
(1, 'MOVEMENT_SENSOR', 'Movement sensor', 1, 3),
(2, 'CAMERA', 'Camera', 1, 3),
(3, 'MOTOR', 'Motor', 1, 3),
(4, 'STAIRS_MOTOR', 'Stairs motor', 2, 1);
ALTER SEQUENCE device_id_seq RESTART WITH 1000;

INSERT INTO device_status_record(device_id, status_id) 
VALUES 
(1, 1),
(1, 2);

INSERT INTO device_status_record(device_id, status_id, creation_at) 
VALUES 
(4, 3, '2022-02-01 15:09:23.378352+03'),
(4, 3, '2024-02-01 15:09:23.378352+03'),
(4, 2, '2024-02-02 15:09:23.378352+03'),
(4, 1, '2024-02-03 15:09:23.378352+03'),
(4, 1, '2024-02-03 15:09:23.378352+03'),
(4, 3, '2024-02-04 15:09:23.378352+03'),
(4, 2, '2024-02-05 15:09:23.378352+03');

INSERT INTO linked_composition(first_composition_id, second_composition_id) 
VALUES 
(1, 2);

INSERT INTO event_type(id, name)
VALUES
(1, 'Start motor'),
(2, 'Stop motor');

INSERT INTO signal(id, device_id, value)
VALUES
(1, 3, 1),
(2, 3, 0);

INSERT INTO event(id, type_id, signal_id)
VALUES
(1, 1, 1),
(2, 2, 2);

INSERT INTO event_device(event_id, device_id)
VALUES
(1, 3),
(2, 3);










