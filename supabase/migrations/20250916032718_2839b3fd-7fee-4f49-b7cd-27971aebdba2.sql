-- Fix class-stream allocation with proper stream IDs
-- Delete existing streams to rebuild them correctly
DELETE FROM streams;

-- Insert streams with proper IDs and correct class assignments
-- P1: pearls, stars, diamonds
INSERT INTO streams (id, name, class_id, created_at, updated_at) VALUES
('P1-PEARLS', 'PEARLS', 'P1', now(), now()),
('P1-STARS', 'STARS', 'P1', now(), now()),
('P1-DIAMONDS', 'DIAMONDS', 'P1', now(), now());

-- P2: golden, kites, marigold  
INSERT INTO streams (id, name, class_id, created_at, updated_at) VALUES
('P2-GOLDEN', 'GOLDEN', 'P2', now(), now()),
('P2-KITES', 'KITES', 'P2', now(), now()),
('P2-MARIGOLD', 'MARIGOLD', 'P2', now(), now());

-- P3: cranes, parrots, sparrows
INSERT INTO streams (id, name, class_id, created_at, updated_at) VALUES
('P3-CRANES', 'CRANES', 'P3', now(), now()),
('P3-PARROTS', 'PARROTS', 'P3', now(), now()),
('P3-SPARROWS', 'SPARROWS', 'P3', now(), now());

-- P4: eaglets, cranes, bunnies, sparkles
INSERT INTO streams (id, name, class_id, created_at, updated_at) VALUES
('P4-EAGLETS', 'EAGLETS', 'P4', now(), now()),
('P4-CRANES', 'CRANES', 'P4', now(), now()),
('P4-BUNNIES', 'BUNNIES', 'P4', now(), now()),
('P4-SPARKLES', 'SPARKLES', 'P4', now(), now());

-- P5: sky-high, sunset, sunrise
INSERT INTO streams (id, name, class_id, created_at, updated_at) VALUES
('P5-SKYHIGH', 'SKY-HIGH', 'P5', now(), now()),
('P5-SUNSET', 'SUNSET', 'P5', now(), now()),
('P5-SUNRISE', 'SUNRISE', 'P5', now(), now());

-- P6: radiant, vibrant, victors
INSERT INTO streams (id, name, class_id, created_at, updated_at) VALUES
('P6-RADIANT', 'RADIANT', 'P6', now(), now()),
('P6-VIBRANT', 'VIBRANT', 'P6', now(), now()),
('P6-VICTORS', 'VICTORS', 'P6', now(), now());

-- P7: winners, achievers, success
INSERT INTO streams (id, name, class_id, created_at, updated_at) VALUES
('P7-WINNERS', 'WINNERS', 'P7', now(), now()),
('P7-ACHIEVERS', 'ACHIEVERS', 'P7', now(), now()),
('P7-SUCCESS', 'SUCCESS', 'P7', now(), now());

-- Update students' stream_ids to match new format based on their current assignments
-- Map old UUIDs to new readable IDs
UPDATE students SET stream_id = 'P1-PEARLS' WHERE stream_id = 'aad4f0b1-2428-482d-8a5a-8a6c3f457ce2';
UPDATE students SET stream_id = 'P1-STARS' WHERE stream_id = 'c9c03218-3dfc-4f15-8d16-0a1ad386fb14';
UPDATE students SET stream_id = 'P1-DIAMONDS' WHERE stream_id = '27790983-2beb-4147-a0a2-ad3143f1c705';

UPDATE students SET stream_id = 'P2-GOLDEN' WHERE stream_id = '7c5190dc-bf6c-4e73-9e76-91c231a5226e';
UPDATE students SET stream_id = 'P2-KITES' WHERE stream_id = '0f9ebf9c-95c5-45fe-947f-d0cab4207169';
UPDATE students SET stream_id = 'P2-MARIGOLD' WHERE stream_id = '35592611-2d76-4218-9d2a-bacf705d0d2d';

UPDATE students SET stream_id = 'P3-CRANES' WHERE stream_id = '776a0ef1-f9dc-463d-a304-6dac3868c68f';
UPDATE students SET stream_id = 'P3-PARROTS' WHERE stream_id = '3ceba0ca-0262-47e1-bf56-55c0e214cca7';
UPDATE students SET stream_id = 'P3-SPARROWS' WHERE stream_id = '6a08db3a-5ce6-4559-9e20-b12963a3d842';

UPDATE students SET stream_id = 'P4-EAGLETS' WHERE stream_id = 'deb1acc8-2fd9-4cc6-b478-0d72cd74cc2c';
UPDATE students SET stream_id = 'P4-BUNNIES' WHERE stream_id = '5c54ac4a-a5e2-4547-85e0-a8936a0632bb';

UPDATE students SET stream_id = 'P5-SKYHIGH' WHERE stream_id = '2e06d206-e29b-4ec7-b516-9f4faa7a5434';
UPDATE students SET stream_id = 'P5-SUNSET' WHERE stream_id = 'a2619f15-6667-4821-876d-1b2ee2a8adab';
UPDATE students SET stream_id = 'P5-SUNRISE' WHERE stream_id = 'abf557d2-5b1f-4760-8cd1-f14429f1dec9';

UPDATE students SET stream_id = 'P6-VIBRANT' WHERE stream_id = 'afb1842f-40fa-4b93-ae39-bdef73279936';
UPDATE students SET stream_id = 'P6-VICTORS' WHERE stream_id = 'c7d8fcca-1f3f-4d71-85e6-866db027a369';

UPDATE students SET stream_id = 'P7-ACHIEVERS' WHERE stream_id = '3eaa13a5-294f-42d9-a2b5-7086fa43efd5';
UPDATE students SET stream_id = 'P7-SUCCESS' WHERE stream_id = '04a121c9-f087-4bfd-ba54-38cad17804f0';

-- Fix misplaced RADIANT stream (was in P7, should be in P6)
UPDATE students SET stream_id = 'P6-RADIANT' WHERE stream_id = '082284eb-08f0-41d2-8b3d-7cf2801332d3';