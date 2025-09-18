-- Create P4 streams if they don't exist
INSERT INTO streams (id, name, class_id, created_at, updated_at) 
SELECT 'P4-CUBS', 'CUBS', 'P4', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM streams WHERE id = 'P4-CUBS');

INSERT INTO streams (id, name, class_id, created_at, updated_at) 
SELECT 'P4-EAGLETS', 'EAGLETS', 'P4', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM streams WHERE id = 'P4-EAGLETS');

INSERT INTO streams (id, name, class_id, created_at, updated_at) 
SELECT 'P4-SPARKLES', 'SPARKLES', 'P4', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM streams WHERE id = 'P4-SPARKLES');

INSERT INTO streams (id, name, class_id, created_at, updated_at) 
SELECT 'P4-BUNNIES', 'BUNNIES', 'P4', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM streams WHERE id = 'P4-BUNNIES');

-- Update existing streams names if they exist
UPDATE streams SET name = 'CUBS' WHERE id = 'P4-CUBS';
UPDATE streams SET name = 'EAGLETS' WHERE id = 'P4-EAGLETS';
UPDATE streams SET name = 'SPARKLES' WHERE id = 'P4-SPARKLES';
UPDATE streams SET name = 'BUNNIES' WHERE id = 'P4-BUNNIES';

-- Assign students to CUBS stream exactly as provided
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'NDUMWAMI SOLOMON';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'NANYONJO PATIENCE';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'MUNEZERO BLESSEN';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'AMPUMUZA ELIANAH';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'KIBUDDE MICHEAL';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'HANNAH KIZITO FRIEND';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'NALUGO CHLOE PRECIOUS';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'ASIIMWE RUJOKI DERRICK';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'NAMUYANJA NAKAWUNGU CARLTON';
UPDATE students SET stream_id = 'P4-CUBS' WHERE class_id = 'P4' AND name = 'LUMU FAVOUR ANGEL';

-- Assign students to EAGLETS stream exactly as provided  
UPDATE students SET stream_id = 'P4-EAGLETS' WHERE class_id = 'P4' AND name = 'NAKIBONEKA PRUDENCE';
UPDATE students SET stream_id = 'P4-EAGLETS' WHERE class_id = 'P4' AND name = 'SINGOMA EDGAR';
UPDATE students SET stream_id = 'P4-EAGLETS' WHERE class_id = 'P4' AND name = 'MUKISA FAVOR';
UPDATE students SET stream_id = 'P4-EAGLETS' WHERE class_id = 'P4' AND name = 'KEEYA MALCOM';
UPDATE students SET stream_id = 'P4-EAGLETS' WHERE class_id = 'P4' AND name = 'KAWEESI EVANS';