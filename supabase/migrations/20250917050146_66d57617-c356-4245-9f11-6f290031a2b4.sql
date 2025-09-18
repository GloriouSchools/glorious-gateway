-- Clean and reinsert P4 CUBS students with correct names, emails (first two names), and photo URLs (surname + third + second)
-- 1) Remove existing P4 CUBS data (both legacy and current stream ids)
DELETE FROM public.students
WHERE class_id = 'P4' AND stream_id IN ('CUBS', 'P4-CUBS');

-- 2) Insert the exact provided names with computed email and photo_url
WITH names(ord, full_name) AS (
  VALUES
    (1,  'AGABA JOSHUA WALTER'),
    (2,  'AINOMUGISHA PETRINAH'),
    (3,  'AKATUHEREZA WILLISHA MERRICK'),
    (4,  'AMPUMUZA ELIANAH'),
    (5,  'ARINITWE CLEIN'),
    (6,  'ASIIMWE DERRICK RUJOKI'),
    (7,  'ASINGUZA BRENDA'),
    (8,  'ATWIINE JOTHAM'),
    (9,  'BATANDA DYLAN'),
    (10, 'BUWEMBO NEYMAR JUNIOR'),
    (11, 'BYAMUKAMA KEITH'),
    (12, 'HANNAH FRIEND KIZITO'),
    (13, 'ISHIMWE QUEEN NGABIRE'),
    (14, 'ISIKOT VERON JOY'),
    (15, 'JAKIRA FLAVOUR ROBIN'),
    (16, 'KARUNGI NEIRAH'),
    (17, 'KASULE ELSEN ZAWADI'),
    (18, 'KATUNDA DARREN'),
    (19, 'KAWUKI GIPSON'),
    (20, 'KAYONGO HYRAT NAMBALIRWA'),
    (21, 'KIBUDDE MICHEAL'),
    (22, 'KIMBUGWE STEWART'),
    (23, 'KIMERA JONATHAN'),
    (24, 'KISENYI MAGGIE MELLISA'),
    (25, 'KITENDA ALMAH ZURI'),
    (26, 'KOBUSINGE MARIANAH NATAL'),
    (27, 'KYALIGONZA JOSEPHINE TUSIIME'),
    (28, 'KYENYINE COSSILINE'),
    (29, 'KYOMUHENDO GRACE KIBIRIGE'),
    (30, 'LUBOWA ABUBAKER'),
    (31, 'LUKWAGO RAYAN'),
    (32, 'LUMU ANGEL FAVOUR'),
    (33, 'MAGOMA CHARLES BENHUR'),
    (34, 'MAYANJA VUUBI'),
    (35, 'MUBINZI MOSES'),
    (36, 'MUGABI JOSH MICHEAL'),
    (37, 'MUNEZERO BLESSEN'),
    (38, 'MWIMA RAIHAN'),
    (39, 'NAKANWAGI KEIRAH'),
    (40, 'NAKISIGE PRECIOUS SHALOM'),
    (41, 'NALUGO PRECIOUS CHLOE'),
    (42, 'NAMBALIRWA TRUDE ABIGAIL'),
    (43, 'NAMUBIRU REGINA MULASANGEYE'),
    (44, 'NAMUMBEJJA RYHAN'),
    (45, 'NAMUYANJA CARLTON NAKAWUNGU'),
    (46, 'NANSUBUGA TRACY CAMILLA'),
    (47, 'NANYONGA ZIADAH LUYIGA'),
    (48, 'NANYONJO AGNES'),
    (49, 'NANYONJO PATIENCE'),
    (50, 'NASSIWA HAILEY ULRIKA'),
    (51, 'NATASHA ESTHER OKALLO'),
    (52, 'NAYEBARE TIMOTHY'),
    (53, 'NGELESE HOSANAH VALERIA'),
    (54, 'NIYIBIZI JERUSA'),
    (55, 'NKIMULI ETHEL GRACE'),
    (56, 'NSIIMIRE FAITH'),
    (57, 'NSUBUGA MICHEAL JORDAN'),
    (58, 'SEKATE NOELLA'),
    (59, 'SSALI MICHEAL'),
    (60, 'SSEKAJJA NASHIFU'),
    (61, 'SSENDYOSE CYRUS FRANKLIN'),
    (62, 'SSENKAAYI EVERISTO NILL'),
    (63, 'SSENYONGA JEREMIAH'),
    (64, 'SSENYONJO MERCY'),
    (65, 'SSEREMBA JEREMIAH'),
    (66, 'SSERUMAGA PUTIN TREVIS'),
    (67, 'WANYENZE MARIANAH TATIANAH'),
    (68, 'YIGA SEBASTIAN TRAVIS')
)
INSERT INTO public.students (id, name, email, class_id, stream_id, photo_url, is_verified, created_at)
SELECT
  'P4-CUBS-' || lpad(ord::text, 3, '0') AS id,
  full_name AS name,
  -- Email: first two names only, lowercased, alphanumeric only
  lower(
    regexp_replace(
      (split_part(full_name, ' ', 1) || coalesce(split_part(full_name, ' ', 2), '')),
      '[^a-z0-9]+', '', 'g'
    )
  ) || '@glorious.com' AS email,
  'P4' AS class_id,
  'CUBS' AS stream_id,
  -- Photo URL: follow established pattern base + computed photo name + .JPG
  'https://fresh-teacher.github.io/gloriouschool/' || (
    -- Build photo filename as SURNAME + (3rd name if exists) + (2nd name if exists)
    CASE
      WHEN array_length(string_to_array(full_name, ' '), 1) >= 3 THEN
        upper(
          concat_ws(' ',
            split_part(full_name, ' ', 1),
            split_part(full_name, ' ', 3),
            split_part(full_name, ' ', 2)
          )
        )
      WHEN array_length(string_to_array(full_name, ' '), 1) = 2 THEN
        upper(full_name)
      ELSE
        upper(full_name)
    END
  ) || '.JPG' AS photo_url,
  false AS is_verified,
  now() AS created_at
FROM names
ORDER BY ord;