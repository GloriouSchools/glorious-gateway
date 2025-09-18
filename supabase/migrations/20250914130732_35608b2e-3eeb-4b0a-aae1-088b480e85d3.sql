-- Add eligible_classes column to electoral_positions table
ALTER TABLE public.electoral_positions 
ADD COLUMN eligible_classes text[];

-- Clear existing positions and insert new ones with class eligibility
DELETE FROM public.electoral_positions;

-- Insert new electoral positions with class eligibility requirements
INSERT INTO public.electoral_positions (id, title, description, eligible_classes, is_active, created_at, updated_at) VALUES
('head_prefect', 'HEAD PREFECT', 'Lead the entire student body and represent students to school administration', ARRAY['P5', 'P6'], true, now(), now()),
('academic_prefect', 'ACADEMIC PREFECT', 'Oversee academic activities and support student learning initiatives', ARRAY['P5', 'P6'], true, now(), now()),
('head_monitors', 'HEAD MONITOR(ES)', 'Coordinate monitor activities and maintain school discipline', ARRAY['P3', 'P4'], true, now(), now()),
('welfare_prefect', 'WELFARE PREFECT (MESS PREFECT)', 'Manage student welfare and dining hall operations', ARRAY['P4', 'P5'], true, now(), now()),
('entertainment_prefect', 'ENTERTAINMENT PREFECT', 'Organize school events and entertainment activities', ARRAY['P3', 'P4', 'P5'], true, now(), now()),
('games_sports_prefect', 'GAMES AND SPORTS PREFECT', 'Coordinate sports activities and represent the school in competitions', ARRAY['P4', 'P5'], true, now(), now()),
('health_sanitation', 'HEALTH & SANITATION', 'Maintain school hygiene and promote health awareness', ARRAY['P3', 'P4', 'P5'], true, now(), now()),
('uniform_uniformity', 'UNIFORM & UNIFORMITY', 'Ensure proper school uniform standards and dress code compliance', ARRAY['P2', 'P3', 'P4'], true, now(), now()),
('time_keeper', 'TIME KEEPER', 'Manage school schedules and ensure punctuality', ARRAY['P4', 'P5'], true, now(), now()),
('ict_prefect', 'ICT PREFECT', 'Support technology use and digital learning initiatives', ARRAY['P3', 'P4'], true, now(), now()),
('furniture_prefect', 'FURNITURE PREFECT(S)', 'Maintain and oversee school furniture and property', ARRAY['P3', 'P4', 'P5'], true, now(), now()),
('prefect_upper_section', 'PREFECT FOR UPPER SECTION', 'Oversee and coordinate activities for upper section students', ARRAY['P5'], true, now(), now()),
('prefect_lower_section', 'PREFECT FOR LOWER SECTION', 'Oversee and coordinate activities for lower section students', ARRAY['P2'], true, now(), now()),
('discipline_prefect', 'PREFECT IN CHARGE OF DISCIPLINE', 'Maintain school discipline and enforce school rules', ARRAY['P3', 'P4', 'P5'], true, now(), now());