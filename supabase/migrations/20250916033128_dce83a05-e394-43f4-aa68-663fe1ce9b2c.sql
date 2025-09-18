-- Map orphan P7 stream UUID to readable ID
UPDATE students
SET stream_id = 'P7-WINNERS'
WHERE stream_id = '3c4ba0ca-8808-43de-b2a5-75a67b53f398';

-- Verify: leave a view to check remaining orphans (non-persistent check)
-- SELECT s.stream_id, COUNT(*) FROM students s LEFT JOIN streams st ON s.stream_id = st.id WHERE st.id IS NULL GROUP BY s.stream_id;