-- Create the teachers table with the specified schema
CREATE TABLE public.teachers (
  name text NULL,
  photo text NULL,
  sex text NULL,
  nationality text NULL,
  "subjectsTaught" text NULL,
  "classesTaught" text NULL,
  email text NULL,
  "contactNumber" bigint NULL,
  id text NULL,
  photo_url text NULL,
  personal_email text NULL,
  is_verified boolean NULL,
  password_hash text NULL,
  created_at timestamp with time zone NULL,
  updated_at timestamp with time zone NULL,
  default_password bigint NULL,
  CONSTRAINT teachers_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access
CREATE POLICY "Allow public read access to teachers"
ON public.teachers
FOR SELECT
USING (true);

-- Insert the 32 new teachers
INSERT INTO public.teachers (id, name, "contactNumber", default_password, password_hash, email, is_verified, created_at, updated_at)
VALUES
  (gen_random_uuid()::text, 'Namulindwa Sylvia', 701936463, 6463, crypt('6463', gen_salt('bf')), 'namulindwa.sylvia@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Nelvin Angella', 705026079, 6079, crypt('6079', gen_salt('bf')), 'nelvin.angella@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Agnes Nakiwala', 703310029, 0029, crypt('0029', gen_salt('bf')), 'agnes.nakiwala@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Ajuna Mathias', 757266687, 6687, crypt('6687', gen_salt('bf')), 'ajuna.mathias@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Ndawula Sam', 74341303, 1303, crypt('1303', gen_salt('bf')), 'ndawula.sam@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Nakanjako Teddy', 755317325, 7325, crypt('7325', gen_salt('bf')), 'nakanjako.teddy@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Atwiine Edmond', 755932741, 2741, crypt('2741', gen_salt('bf')), 'atwiine.edmond@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Mirumu Mansur', 740737275, 7275, crypt('7275', gen_salt('bf')), 'mirumu.mansur@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Niyokindi Benoit', 761065888, 5888, crypt('5888', gen_salt('bf')), 'niyokindi.benoit@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Kusaasira Barbra', 705547386, 7386, crypt('7386', gen_salt('bf')), 'kusaasira.barbra@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Akullo Monica', 779547969, 7969, crypt('7969', gen_salt('bf')), 'akullo.monica@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Nantongo Fatuma', 756569488, 9488, crypt('9488', gen_salt('bf')), 'nantongo.fatuma@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Akello Sarah', 784161222, 1222, crypt('1222', gen_salt('bf')), 'akello.sarah@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Bukenya Isaac', 700476174, 6174, crypt('6174', gen_salt('bf')), 'bukenya.isaac@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Mujuni Graciano', 789307524, 7524, crypt('7524', gen_salt('bf')), 'mujuni.graciano@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Nansubuga Gloria', 706482420, 2420, crypt('2420', gen_salt('bf')), 'nansubuga.gloria@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Lwanga Vicent', 773231567, 1567, crypt('1567', gen_salt('bf')), 'lwanga.vicent@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Wathum Herbert', 785102351, 2351, crypt('2351', gen_salt('bf')), 'wathum.herbert@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Gerald Benjamin Epodoi', 704932329, 2329, crypt('2329', gen_salt('bf')), 'gerald.epodoi@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Nazzziwa Sharon', 759230048, 0048, crypt('0048', gen_salt('bf')), 'nazzziwa.sharon@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Nabisubi Brenda', 740894540, 4540, crypt('4540', gen_salt('bf')), 'nabisubi.brenda@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Namuli Martha', 708166226, 6226, crypt('6226', gen_salt('bf')), 'namuli.martha@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Nakato Faridah', 704173217, 3217, crypt('3217', gen_salt('bf')), 'nakato.faridah@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Ssemukasa Lawrence', 700589511, 9511, crypt('9511', gen_salt('bf')), 'ssemukasa.lawrence@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Abitegera Sylivia', 703770389, 0389, crypt('0389', gen_salt('bf')), 'abitegera.sylivia@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Asio Joyce Mary', 773753228, 3228, crypt('3228', gen_salt('bf')), 'asio.joyce@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Karungi Olivia', 787393767, 3767, crypt('3767', gen_salt('bf')), 'karungi.olivia@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Bongomin Gabriel', 705715959, 5959, crypt('5959', gen_salt('bf')), 'bongomin.gabriel@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Moses Turyomurugyendo', 700718846, 8846, crypt('8846', gen_salt('bf')), 'moses.turyomurugyendo@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Hakim Lukwago', 740935415, 5415, crypt('5415', gen_salt('bf')), 'hakim.lukwago@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Alpha John', 763265705, 5705, crypt('5705', gen_salt('bf')), 'alpha.john@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Noelyn Namuju', 785766454, 6454, crypt('6454', gen_salt('bf')), 'noelyn.namuju@school.com', true, now(), now()),
  (gen_random_uuid()::text, 'Taremwa Fravia', 705866440, 6440, crypt('6440', gen_salt('bf')), 'taremwa.fravia@school.com', true, now(), now());