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

/** Dummy data**/
INSERT INTO city (country_id, name, postal_code) 
VALUES 
(681, 'Lovch1', 55001),
(681, 'Plodiv1', 20001),
(681, 'Stra Zagora1', 300),
(681, 'Vana1', 4020),
(681, 'Buras1', 5020),
(681, 'Basko1', 6020),
(681, 'Troyn1', 7020),
(681, 'Plen1', 8020),
(681, 'Monana1', 9200),
(681, 'Vidn1', 10020),
(681, 'Vrca1', 110200),
(681, 'Loech1', 525001),
(681, 'Plvdiv1', 200201),
(681, 'Stra Zagor2a1', 3200),
(681, 'Vaa1', 402),
(681, 'Bugas1', 520),
(681, 'Bnsko1', 620),
(681, 'Tryan1', 720),
(681, 'Plven1', 820),
(681, 'Mntana1', 933300),
(681, 'Vdin1', 10200),
(681, 'Vaca1', 10);
/** **/

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

/** Dummy data **/
INSERT INTO composition (code, type_id, location_id, status_id) 
VALUES 
('REVOLVING_DOOR1', 1, 50, 3),
('REVOLVING_DOOR2', 1, 50, 3),
('REVOLVING_DOOR3', 1, 50, 3),
('REVOLVING_DOOR4', 1, 50, 3),
('REVOLVING_DOOR5', 1, 50, 3),
('REVOLVING_DOOR6', 1, 50, 3),
('REVOLVING_DOOR7', 1, 50, 3),
('REVOLVING_DOOR8', 1, 50, 3),
('REVOLVING_DOOR9', 1, 50, 3),
('REVOLVING_DOORa', 1, 50, 3),
('REVOLVING_DOORb', 1, 50, 3),
('REVOLVING_DOORc', 1, 50, 3),
('REVOLVING_DOORd', 1, 50, 3),
('REVOLVING_DOORq', 1, 50, 3),
('REVOLVING_DOORw', 1, 50, 3),
('REVOLVING_DOORe', 1, 50, 3),
('REVOLVING_DOORr', 1, 50, 3),
('REVOLVING_DOORt', 1, 50, 3),
('REVOLVING_DOORy', 1, 50, 3),
('REVOLVING_DOORu', 1, 50, 3),
('REVOLVING_DOORi', 1, 50, 3),
('REVOLVING_DOORo', 1, 50, 3),
('EVOLVING_DOOR1', 1, 50, 3),
('EVOLVING_DOOR2', 1, 50, 3),
('EVOLVING_DOOR3', 1, 50, 3),
('EVOLVING_DOOR4', 1, 50, 3),
('EVOLVING_DOOR5', 1, 50, 3),
('EVOLVING_DOOR6', 1, 50, 3),
('EVOLVING_DOOR7', 1, 50, 3),
('EVOLVING_DOOR8', 1, 50, 3),
('EVOLVING_DOOR9', 1, 50, 3),
('EVOLVING_DOORa', 1, 50, 3),
('EVOLVING_DOORb', 1, 50, 3),
('EVOLVING_DOORc', 1, 50, 3),
('EVOLVING_DOORd', 1, 50, 3),
('EVOLVING_DOORq', 1, 50, 3),
('EVOLVING_DOORw', 1, 50, 3),
('EVOLVING_DOORe', 1, 50, 3),
('EVOLVING_DOORr', 1, 50, 3),
('EVOLVING_DOORt', 1, 50, 3),
('EVOLVING_DOORy', 1, 50, 3),
('EVOLVING_DOORu', 1, 50, 3),
('EVOLVING_DOORi', 1, 50, 3),
('EVOLVING_DOORo', 1, 50, 3),
('EVOLVING_DOORp', 1, 50, 3);
/** **/

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

/** Dummy data **/
INSERT INTO device (code, name, composition_id, status_id) 
VALUES 
('CAMERA1', 'Camera1', 3, 3),
('CAMERA2', 'Camera2', 3, 3),
('CAMERA3', 'Camera3', 3, 3),
('CAMERA4', 'Camera4', 3, 3),
('CAMERA5', 'Camera5', 3, 3),
('CAMERA6', 'Camera6', 3, 3),
('CAMERA7', 'Camera7', 3, 3),
('CAMERA8', 'Camera8', 3, 3),
('CAMERA9', 'Camera9', 3, 3),
('CAMERA11', 'Cameraq', 3, 3),
('CAMERA21', 'Cameraw', 3, 3),
('CAMERA31', 'Camerae', 3, 3),
('CAMERA41', 'Camerar', 3, 3),
('CAMERA51', 'Camerat', 3, 3),
('CAMERA61', 'Cameray', 3, 3),
('CAMERA71', 'Camerau', 3, 3),
('CAMERA81', 'Camerai', 3, 3),
('CAMERA91', 'Camerao', 3, 3),
('CAMERA12', 'Camerap', 3, 3),
('CAMERA22', 'Cameraa', 3, 3),
('CAMERA32', 'Cameras', 3, 3),
('CAMERA42', 'Camerad', 3, 3),
('CAMERA52', 'Cameraf', 3, 3),
('CAMERA62', 'Camerag', 3, 3),
('CAMERA72', 'Camerah', 3, 3),
('CAMERA82', 'Cameraj', 3, 3),
('CAMERA92', 'Camerak', 3, 3),
('CAMERA13', 'Cameral', 3, 3),
('CAMERA23', 'Cameraz', 3, 3),
('CAMERA33', 'Camerax', 3, 3),
('CAMERA43', 'Camerac', 3, 3),
('CAMERA53', 'Camerav', 3, 3),
('CAMERA63', 'Camerab', 3, 3),
('CAMERA73', 'Cameran', 3, 3),
('CAMERA83', 'Cameram', 3, 3),
('CAMERA93', 'Camerall', 3, 3);
/** **/

INSERT INTO device_status_record(device_id, status_id) 
VALUES 
(1, 1),
(1, 2);

INSERT INTO device_status_record(device_id, status_id, creation_at) 
VALUES 
(4, 3, '2022-02-01 15:09:23.378352+03'),
(4, 3, '2024-03-01 15:09:23.378352+03'),
(4, 2, '2024-03-02 15:09:23.378352+03'),
(4, 1, '2024-03-03 15:09:27.378352+03'),
(4, 1, '2024-03-03 15:09:23.378352+03'),
(4, 3, '2024-03-04 15:09:23.378352+03'),
(4, 2, '2024-03-05 15:09:23.378352+03');

INSERT INTO linked_composition(first_composition_id, second_composition_id) 
VALUES 
(1, 2);

INSERT INTO event_type(id, name)
VALUES
(1, 'Start device'),
(2, 'Stop device');

INSERT INTO signal(id, device_id, value)
VALUES
(1, 3, 1),
(2, 3, 0);
ALTER SEQUENCE signal_id_seq RESTART WITH 1000;

INSERT INTO event(id, type_id, signal_id)
VALUES
(1, 1, 1),
(2, 2, 2);
ALTER SEQUENCE event_id_seq RESTART WITH 1000;

/* Dummy data to test scrolling with events list */
INSERT INTO event(type_id, signal_id)
VALUES
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(2, 2),
(1, 1),
(1, 1),
(2, 2),
(2, 2);
/* */

INSERT INTO event_device(event_id, device_id)
VALUES
(1, 3),
(2, 3);










