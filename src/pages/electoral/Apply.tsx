import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  UserPlus, 
  Trophy, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  User,
  GraduationCap,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Confetti } from "@/components/ui/confetti";
import { useAuth } from "@/hooks/useAuth";

interface Student {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

interface Stream {
  id: string;
  name: string;
  students: Student[];
}

interface Class {
  id: string;
  name: string;
  streams: Stream[];
}

interface ApplicationForm {
  selectedClass: string;
  selectedStream: string;
  selectedStudent: string;
  position: string;
  experience: string;
  qualifications: string;
  whyApply: string;
}

export default function Apply() {
  const navigate = useNavigate();
  const { user, userName } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showConsentError, setShowConsentError] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Real school data with classes, streams and students
  const schoolData = {
    "P2": {
      "GOLDEN": [
        "ABAHO FIACRE EUGENE", "ADIL KIVIIRI MITTI", "AGASHA ABIGAIL", "AHURIRE JONATHAN", "AINEBYONA GABRIELLA ALINDA",
        "AKAMPULIRA ARISTARCHUS SAMUEL", "ALUMA AARON", "ASHABA ABIGAIL CHLOE", "ATUKUNDA SALOME", "AYONGYERAHO SAMANTHA",
        "BUKENYA POWEL JUNIOR", "BYAMUKAMA MULUNGI RHODAH", "GANZA HOLLY SHAK", "GITTA JAMAL", "HIRWA TETA HUGUETTE",
        "JJUUKO DRAKE PUIS", "KABUYAYA SHANNA", "KATO JESSE", "KATUMBA WALLACE MUGERWA", "KAYANJA DALTON",
        "KIJJAMBU GRACE", "KIRENDA HAVANS KERAMO", "KISAKYE ELIANA TENDO", "KISITU TREVIS STEVEN", "KITENDA GIAN MUKIRIZA",
        "KIYAGA HADIJAH", "KUBAGYE ISAIAH", "KUNDHUBA LEVITICUS MIGUEL", "KWAGALA GRAHAM", "LUBOWA ABDUL KARIM",
        "LUTAAYA JORDIN SAAVA", "LWASA DAVIS", "MAGUMBA SHAMYRAH", "MAWEJJE EXPERITO", "MAYANJA FABIAN VANVAN",
        "MBOGGA JOEL", "MIREMBE LUCY FLAVIA", "MUHOZA PRAISE", "MUSIITWA MARCUS FRANCIS", "MUWANGA HAIMA AADIHA",
        "MUWANGUZI CHRIS DANIEL", "MWEBIGWA ELIJAH", "NAJJUUKO NALUZZI", "NAKAAYI ABIGAIL", "NALUJJA TIMAYA",
        "NAMULINDWA MIRACLE", "NANKYINGA SHANNEL MARIA", "NASSALI BASHIRAH JOY", "NATUHWERA ABIGAIL KATONGOLE", "NAZZIWA ELIANA GRACE",
        "NUWASIIMA ELIJAH JUNIOR", "RUGABA CAESER", "SSEBBUMBA ISAAC IQRAM", "SSEGAWA JORAM", "TIBANYAGA GENESIS", "ZAWEDDE NADRA"
      ],
      "KITES": [
        "AGUTI MATINA", "AKATUKUNDA TRIUMPHANT", "AMIR ADAMS KYEYUNE", "ATUHURA TRISHA LINATE", "ATULINDA CLARA MERISHA",
        "BALAM EDITH LUGOJA", "CYOGERE JAYDEN MUVARA", "EKYE AKMAL PRICELESS", "EKYE KAMAL", "KABAGAMBE SPEEDMAN JESUS",
        "KALULE CATHERINE VANNAH", "KHIISA PETRONELLA", "KIRUNDA EMMANUEL KWAME", "LAKER LIZETH", "LUMU DAGLOUS LUCKY",
        "LUSIBA JONAH", "LUTAAYA JOHN WYCLIFF", "LUZINDA ELIJAH KISAKYE", "MUGAMBE TYRONE", "MUGARURA SHAROT",
        "MUHUMUZA NEWTON", "MUKISA TREASURE", "MULUMBA MELISSA MICHELLE", "MULUNGI MACKYLA", "MUYOMBA PAMELLA",
        "NABAALE MARIA MACKEILA", "NABATANZI BLESSING", "NABATANZI MARIA", "NABAYEGO MARTHA ARIANA", "NABUKEERA MARTHA BETTY",
        "NABUMBO BEATRICE", "NAGADYA WENDYWEEKS", "NAKALINZI VICTORIA NABBIMBA", "NAKAYIWA BLESSING", "NAKIGUDDE JESCA",
        "NALWADDA MARIANAH", "NAMAGANDA MARY MUBEEZI", "NAMAGEMBE ABIGAIL KIRABILA", "NAMATA PRISCILLA SHALOM", "NAMBUUSI FIRIDAUS",
        "NAMBUUSI VERONICA NAKATO", "NANSUBUGA KELSIE", "NANTIMBA JULIAN SEKATE", "NASSANGA RIDAH BASINGA", "NENDEJYE MARION",
        "NGOGE VIVIAN", "OPI HIRAM ANISON", "RABEIA ABDALLAH HAMED", "SSEGAWA CLYDE LARKIN", "SSEGUJJA DAVASHA LOVE",
        "SSENTONGO JEMIMAH PRECIOUS", "YAWE AMBER HADIA"
      ],
      "MARIGOLD": [
        "ABIGABA MATTHEW", "ABIGARURAHO SPLENDID", "ACHOLA SAMANTHA", "AHIMBISIBWE JEREMIAH", "AHIMBISIBWE KEVIN",
        "ALIGUMA EMILLY", "ALINDA TIFFANY", "ANZOA FAITH", "ATAI KAYLAH ARINDA", "ATUHAIRE TRACY KARUNGI",
        "ATUHIRE ANNA MARY LORETTA", "BIRUNGI KIMORA", "BYARUHANGA TRACY", "KAGIMU JESHAIAH MELODY", "KANYI MPAKANYE MAURICE",
        "KASIRYE BADURIAH", "KASOZI CYRUS MUBIRU", "KAVUMA LIBERTY", "KIGGUNDU FRANCIS EXAVIER", "KIGOZI CALVIN",
        "KIMBUGWE MUHAMMAD ALI", "KIMERA JERICHO", "KIMULI ELIJAH", "KOBUSINGYE NATALIE", "KYOBE JOSIAH MULUNGI",
        "LAKICA ABIGAIL CHLOE", "MAGUMBA JAHIM", "MUGERWA EDRINE", "MUKISA HAM", "MUKISA JEREMIAH",
        "MULUNGI ASHER NTWALI", "NABIRYE LAILAT", "NAKYANZI CHLOE MALAIKA", "NAKYEYUNE MARIA DARLEN", "NAMIREMBE JUSTINE NATALIA",
        "NAMPIJJA RAHUMAH", "NAMUKASA CLAIRE", "NANTULYA EZRA", "NDAGIRE SHANER RANISH", "NDAHIRO BRIAN",
        "NIWAGABA DIVINE", "NTEYERA ABIGAIL ZITA", "NYANZI PRESTON", "OLA CHRISLEY", "OMENO MAURICE JUNIOR",
        "ONYIRU JOY ECOKU", "OWAMAHORO RAUTHA", "SAKA RAHIM SUNDAY", "SSEKANJAKO TRAVIS VIANNEY", "WANDERA GARY JOSIAH", "WASSWA JORDAN"
      ]
    },
    "P3": {
      "CRANES": [
        "AINE FLOKI", "AINOMUGISHA PURITY", "AKANDWANAHO MOBERT", "ALOYO JIREH OKOT", "ALPHA SADIKI",
        "AMODING DORCAS LAURETTA", "ANKUNDATRICIA", "ANYOLE JAAD GALA", "ARINAITWE DYLAN GIFT", "ARINDA LINDSAY",
        "ARIO VICTORIA PRETTY", "ASASIRA PHILLIP PROSPER", "ASIIMWE ERINAH MERCY", "ATUHIARE ELLAH MUHABWE", "AYEBALE LUCKY",
        "BAGALA LETICIA KAKYUBYA", "BBOSA CYRUS RICH", "GALABUZI FARHAN", "ISHIMWE NGIRISOKO DEBORAH", "ITUNGO PHILLIP ROMEO",
        "KABUGO ALPHA DICKENS SHINE", "KALEMA ELVIS SSEJINJA", "KAMYUKA RYAN", "KASOZI MOSES DALTON", "KAWEESI MELVIN",
        "KAZOOBA CHARLES", "KIMBUGWE TAPHATH KIRABO", "KIYAGA EMMANUEL", "KOBUSINGE LAURITAH", "KWAGALAKWE TRINITY DIVINE",
        "MAGALA VICTOR PRINCE", "MARIA IVY LUSWATA", "MAYIGA FRANCIS", "MFURAKOZI ELIZABETH", "MUGALU ETHAN MBOWA",
        "MUGANWA GABRIEL ECKOUGHT", "MUHOZA SOPHIE GIFT", "MUTESI FAIZER NAMULONDO", "MUWANGUZI CALVIN", "MUYOMBA KEVIN",
        "NABUTONO PURITY", "NAGAWA ELLA ANNA", "NAKAJIRI JACKLINE CLARICE", "NAKATO BLESSED ABIGAIL", "NAKAWOOYA DIVINE",
        "NAKAYIZA MILKAH", "NAKIBUYE ELIZABETH", "NAKIBUYE ERIKA", "NAKIREMBEKA RUTH TENDO ESTHER", "NALUBEGA NELLYN",
        "NAMATOVU ABIGAIL SHANEL", "NAMATTA JOSELYN CELYN", "NAMIGADDE KIRABO SHAMIRAH", "NAMIREMBE ELIANAH", "NAMULI ADONAI",
        "NANFUKA SYLIVIA", "NANGOBI FAVOUR RIHANA", "NANSAMBA MARTHA MELINA", "NDAGIRE GENESIS PERUTH", "NGELESE RIAM VIANNY",
        "SSAAZI WYNAND RAUBEN", "SSEGUYA SHAFIC", "SSEKITO MUNIRA", "WASSAJJA DICKENS CHARLES", "WASSOZI CALVIN RASHFORD", "WASSWA DOUGLAS"
      ],
      "PARROTS": [
        "ACEN ANNABEL CAISEY", "ADAM SAMA MOKHTAR", "AGABA JOHN AUSTIN", "AKAMPULIRA CATALEYA RUTH", "ALIMPA DESTINY ANGELLA",
        "AMJAD YASIR KASIRYE", "ANYIJUKIRE FAVOUR DOLLARS", "ARISHABA ELIJAH KAHANJIRWE", "ASINGUZA JOLLINE", "ATUHAIRE PRAISE CYNTHIA",
        "ATUKUNZIRE SPLENDOR", "AWADI BENTI SALAH", "BAINOMUGISHA ABIDAN", "BANADDA HUMAIRAH", "BBEMBA SOLOMON DALTON",
        "BUKENYA IMRAN", "BUSHIRAH HAKIM", "DDAMULIRA AMANI KISIRINYA", "DDUMBA CANAAN KISAKYE", "JOHN KEELY KUTEESA",
        "KAZIBA ERIAS", "KIRABO KEISHA", "KYOBE HEAVENS MACKYLINE", "MASSA RAHUMA", "MATOVU KEITH",
        "MAYIGA SADAT", "MUGERWA MARVIN KITIIBWA", "MUGISA VALERIE", "MUGISHA HARVEST", "MUHOOZI ABRAHAM",
        "MUKISA BRINAH AISHA", "MUKISA SEAN", "MUKOOTA SHAREN", "MUSIBIKA SHAHIDAH", "MUTAAWE MARJORINE",
        "NABAGULANYI RHONAH", "NABUUMA EVELYN", "NAGGAYI GLORIA", "NAGUJJA MELLISA", "NAKACWA SYNTHIA",
        "NAKAFEERO CHLOE KATRINAH", "NALUGGWA JULIANAH", "NALUSOZI MADRINE", "NAMBUUSI HASIFA LULE", "NAMPEEWO RHAUDAH",
        "NAMUDDU JULIET NALUSIBA", "NANTEZA JULIAN TENDO", "NANYANGE EMMANUELLA", "NANYUNJA ANGEL MYRA", "NASSUUNA ANNA CHLOE",
        "NGABO ETHAN MAZINGA", "NINSIIMA MARY MERCY", "NSUBUGA ETHAN SAMUEL", "NYANGOMA MARIANA MELISSA", "SANYU LOUIS",
        "SSALI JORDAN", "SSEKYANZI DAVAN", "SSEMWANGA RODNEY", "SSEMWOGERERE SADDAM", "TUMUHAISE BENJAMIN", "WODERO JONATHAN"
      ],
      "SPARROWS": [
        "ABAASA ALVIN", "ABAASA BENJAMIN", "ABDUDALLAH AZIZ KIZZA", "AGABA RUGABA SOLOMON", "AIJUKA ELYNET",
        "AINEMABABAZI AMELIA", "ALINDA ETHAN", "AMORAH BLESSING", "APIYO ABIGAIL CAIRA", "ATWIINE JESSE BYAMUKAMA",
        "BAFUWE JOSIAH SIMON", "BAKYAZI ZULPHER", "BALIRUNO ARTHUR MUWANGUZI", "CHIOMAKA NASHIELLY ABIGAIL", "EMMANUELLA CON",
        "INEZA CANDICE", "KABALI NICHOLAS VICENT", "KABBALE MARK BERNARD", "KAKANDE ROMANS", "KALWAZA JAMES AHURIRE",
        "KARUNGI PRECIOUS", "KASIRYE BASHIRAH", "KASOZI TRAVAN MUWONGE", "KATENDE DALDAH NAEMU", "KEMBABAZI ELEXANA",
        "KIGOZI ABDUL SHAKUR", "KIRYOWA ALOYSIOUS", "KISAKYE PAULINE DELISHA", "KWAGALA DIVINE SSEBUGUZI", "LAGUM NICHOLETTE",
        "LUMU ANDREW", "LWANGA SHAFIK BASUDDE", "MATOVU JOHN HEIDEN", "MATOVU MICAH", "MBABAZI HILTON MIREMBE",
        "MILLA MIRACLE TIMOTHY", "MPAIRWE LESLEY LEONAH", "MUHUMUZA GRACE MUTONI", "MUKAMA LIAM JONATHAN", "MUKIIBI VIANNEY",
        "MUTONI ELISHEBAH ALISON", "MUWONGE LUCKY JONATHAN", "NAKIWALA MALAIKA HAZEL", "NALUBEGA DINAH", "NAMBOGO CHRISTABEL",
        "NAMIIRO MONICA CLARA", "NAMUGGA VALERIA", "NANDAWULA MIRIAM", "NASSOZI VALORIE BLESSINGS", "NDETESHEKO GIFFIN GIDEON",
        "NOKRACH KEYLOR CRUZ", "NSHUTI ELISHA", "NTARE MAURICE NABLE", "NUWAGABA AARON SHELDON", "NYAKATO MARIA MICHELLE",
        "NYOMBI AMIRA", "NZIZA ELIJAH", "OKOT ADRIEL HISGRACE", "OKOTEL EMMANUELLA", "OMODING ETHAN EYALAMA",
        "ROHAAN BAHAR", "SSANGO JOVAN ANGELLO", "SSEBUGWAWO JONATHAN KISLEV", "TOMUSNAGE KATRINAH", "WALAKIRA ALOYSIOUS",
        "WALUKAGGA SALIM", "WASSWA ABEL BRANDON"
      ]
    },
    "P4": {
      "EAGLETS": [
        "AKAMPURIRA CALVIN", "ANKUNDA DONALD", "BESIGYE TRICIA", "BUGEMBE SHAKUR DDUMBA", "BUKENYA KRYSTAL NOEL",
        "BWIRE EMMANUEL", "BYARUHANGA ASHNAZ", "DDUMBA JORAM", "HIRWA ALLE IAN", "ISINGOMA EDGAR",
        "KAFEERO ELIJAH PASCAL", "KAGIMU SHEMAIAH GOODLUCK", "KAITESI LEAH", "KAKINDA FABIAN", "KAMUGISHA GIOVANA",
        "KASIITA UMARU", "KAVUMA AMIR", "KAWEESI ABDUL SHAKUR", "KAWEESI EVANS", "KEEYA MALCOM",
        "KIBUDDE NICHOLAS", "KIGULI NAILOR", "KISIRA JORDAN", "KYEYUNE DANIEL", "LUBEGA MICHEAL  MALCOM",
        "LUTAAYA CATHERINE", "LWALANDA HAKIM", "LWASSA DALTON ELIJAH", "MAGALA DALTON EDWARD", "MAGUMBA SHAKIR",
        "MIGADDE SHAKUR SUCCESS", "MPAIRWE SERENE LYTON", "MUGERWA JERICHO", "MUKIIBI JONATHAN", "MUKISA FAVOR",
        "MUKISA FAVOUR", "MUKULU MAHAD NASSIB", "MUWAMBA WILFRED", "NABUKEERA SHUKRAN", "NAKABUYE CYNTHIA",
        "NAKALANZI PROMISE", "NAKASIISA SHEILLA KABOGGOZA", "NAKIBONEKA PRUDENCE", "NAKIGULI SHIVAN", "NAKITTO RHONEL RUTH",
        "NAMAGALA EDRON JOAN", "NAMBEJJA CHRISTINE", "NAMUBIRU AFRICA RACHEAL", "NAMUYIGA JOVIA", "NAMYALO TASHEEMIM",
        "NANJEGO VICTORIA", "NANKUBUGE SHAINAH", "NANNUNGI ANNA PRECIOUS", "NANTEZA LYAN", "NASASIRA DIVINE",
        "NASIMBWA CIARA NANA", "NASSIMBWA GRACE HANNAH", "NKWISANA REAGAN", "OLA KERON MICHELLE", "RASHMY WAHIDAH IMAN",
        "SEKATE GODFREY JUNIOR", "SSEBUUFU RAYMOND", "SSEKAJIGO VICTOR", "SSERUYANGE TIMOTHY", "SSIMBWA TALIQ",
        "TUMUSIIME FRANCIS", "TURYAKIRA TYRONE", "WAIKYA ISRAELLA PHOENIX", "WALUSIMBI JETHRO VALENTINE"
      ],
      "BUNNIES": [
        "ABAASA MELISA", "AGABA JOHN TREASURE", "AHUMUZA PRAISE ROBERT", "AINEMBABAZI GRACE REINAH", "AINEMBABAZI MELISA",
        "AKAMUTUHA JANET", "AKWERO LYN AUSTINE", "AMILAH ADAMS KYEYUNE", "ANVIKO SHANTAL MARION", "ARIIHO ISRAEL",
        "ARINDA MARTHA ELLONY", "ATUHAIRE GEORGIA ROSE", "BALIKUDDEMBE ELVIS", "BARUNGI VICTORIA", "BATANDA JETHRO",
        "BUYONDO ISRAEL", "ELOY TITUS SSENTONGO", "IRENE MALAIKA NABBAALE", "KABAGAMBE WEISSMAN", "KAKUNGULU RYAN MARK",
        "KALIBBALA AKRAM", "KALYANGO RAHEEM", "KATO JOVANS KABUYE", "KATUMBA CONRAD", "KATUMBA MARIA",
        "KAVUMA NORINE ESTHER", "KAWEESA KEIRAN", "KAWEESI HASHIM SSESSAAZI", "KIMBUGWE ABDALLAH", "KOMUJUNI FEDRACE",
        "KWEZI ROBINS", "MAGOMA BELICIA", "MALAIKA TRIXIE KIYAGA", "MIREMBE RAUDAH", "MUKIRIZA GEORGE MBOOWA",
        "MULUNGI ASABA JOANNAH", "MUSIIME GIFT", "MUYAMA ABIGAIL", "NABBONGOLE KATRINAH", "NABUKENYA JOSEPHINE KATE",
        "NAKALUNGI GABRIELLA IVANNAH", "NAKASUMBA ANITAH", "NALUBEGA MARIA", "NALUYANGE MADRINE DOROTHY", "NALWANGA JAZMINE",
        "NAMAGANDA BRIANNAH STEPHANIA", "NAMANDA MAJORIE", "NAMAZZI DESIRE HILDA", "NAMPIIMA PAULINE", "NAMUGERWA SABRINA",
        "NAMUJJUZI WINFRED", "NAMULI COMFORT", "NAMUTEBI LEONAH ROSELLA", "NANSUMBI DEBORAH KENDRA", "NANYUNJA RINAH NANA",
        "NASIRUMBI ISABELLA", "NDAGIRE SARAH", "NTAMBI REAGAN", "NYAKATO EDRINA", "SANYU NISHA GASARO",
        "SSEMPIJJA OSCAR", "SSEWANYANA AARON", "TAMALE JOHN FRANCIS", "TREASURE ELIZABETH SEKU", "TUKUNDANE EUGENE",
        "WALUSIMBI MARTIN", "WASSWA JONATHAN KABUYE", "WOSERO JOSHUA"
      ]
    },
    "P5": {
      "SKYHIGH": [
        "AKOL LEON MASABA", "ASIIMWE MONICA", "ATUHAIRE ANGELLA", "BAKINDO SIMON SALA", "BANADDA HASHIM",
        "BUKIRWA RAHMA DDUMBA", "CHOL GAI ALIER NHIAL", "KAWULUKUSI SHAKURAN", "KAYAGA KATRINAH", "KEBIRUNGI DAISY EVE",
        "KIGGUNDU FAVOUR MARCUS", "KIGOZI RAHEEM", "KISAKYE MARTHA", "KWAGALA FAITH JOY", "LUMU ANNA GRACIOUS",
        "MATSIKO HANIF", "MAWEJJE UKASHA", "MBABAZI CYRON", "MBAZIIRA JOEL", "METALORO MARY PURITY",
        "MIKKA TYABA NICHOLAS", "MPANGA FAHAD", "MUBIRU INAN", "MUBIRU MIGUEL HERO", "MUKASA BRYTON",
        "MUKIIBI MICHEAL", "MULUMBA FAVOUR CLINTON", "MUTESASIRA JOLLENE", "MUTESI TRINA TEDDY", "NABAGEREKA CHRISTINE MELANIE",
        "NABAGULANYI TENDO TREASURE", "NAKAWOOYA TEACILAM MUYINGO", "NAKIBUUKA ASSUMPTA", "NAKIBUULE MELAN BLESSED", "NAKIGANDA LISA",
        "NAKITTO HAPPY DANIELLA", "NAMATOVU IMMACULATE", "NAMATOVU PROVIA ABIGAIL", "NAMATOVU SHUKRAN", "NAMAYANJA ANTONIO MERCY",
        "NAMULEMA MERCY ALLEN", "NAMULINDWA VICTORIA", "NAMUTALE FEDERICO", "NANTONGO SHANTEL", "NIMUKUNDA CYRUS MURAMIRA",
        "NSAMBA JORDAN RICH", "SSEJJUUKO PEDRO", "SSEKANJAKO ARAFAT", "SSETUMBA JESSIE", "TUSUBIRA ARTHUR", "WASSAJJA MELISSA RAY"
      ],
      "SUNRISE": [
        "ADAM SALAMA MOKHTAR", "AHEREZA HONOUR MULUNGI", "AINOMUGISHA ANGEL", "ALIYAH ADAMS KYEYUNE", "ASHABA ELIZABETH",
        "BAGONZA JOAB", "BLESSING SHILOH", "BUKIRWA SHILOH", "BUYUNGO BRANDON ERIC", "IRANYA MARCUS",
        "KAKONA JORDAN KASH", "KALULE CAESER CARLOS", "KASOZI AAMRAT", "KEMIGISHA ALEXANDRIA", "KIGGUNDU LUKE",
        "KISMART DAUDA", "LUBEGA MALCOM EMMANUEL", "LUGYA AKRAM", "LUYIGA RAYAN", "MANZI EVANS",
        "MUBEEZI SHADIA LUYIGA", "MUHUMUZA ADELITO", "MULANGIRA JOSEPH", "MULUNGI IAN", "MUYIZA SYRUS",
        "NABIRYE PRECIOUS", "NABUUMA VANESSA", "NAKAWEESI MICHELLE", "NAKUNGU PRECIOUS CYNTHIA", "NAMAGANDA IMRAH SSEMPIJJA",
        "NAMAKULA SOPHIA KITIIBWA", "NAMIREMBE ALPHA DDAMULIRA", "NAMUTEBI GETRUDE", "NAMWANJA JOHNBAPTIST", "NANJOBE VANESSA",
        "NANSUBUGA MANNUELLAH", "NANTONGO BUSHIRA", "NANUNGI DRUCILA LUTEETE", "NASSANGA MARIA VIENNA", "NICHOLAS ITAAGA TRUST",
        "NINSIIMA MARY SHALOM", "NVANUNGI SHANIEZ", "PHILLIP DAVID LUKANDWA", "RWOMUSHANA OMUGISHA GABRIEL", "SSEBABENGA KERON",
        "SSEMATIMBA MARK", "SSEMOMBWE ANDERSON", "SSENGENDO PRITA", "SSEWAKIRYANGA HOSEA", "SSUUNA RAFAN WASSAJJA",
        "TEMITOPE ABOSODE", "TENDO HASIFA HAKIM", "TWESIGE ADRIAN", "UWINEZA SHAMAH ZINDUKA"
      ],
      "SUNSET": [
        "AINEBYONA ISAIAH", "ANKUNDA DENISE", "ANYANGO KAREN MERCY", "ASIIMWE SHEENA", "ATAMBA CAROL JIREH",
        "ATUKUNDA GRAMIA", "AYEBAREYESU EXCELLENT", "BWIRE CLARISSA SUCCESS", "DDUMBA FRANCIS", "GITTA RAZAQ",
        "HIPAINGAH SALAH JOSEPHINE", "INEZA PEACE DORIAN", "JIBE IMMACULATE", "KABUYAYA RAYANNA", "KAKANDE BLESSED",
        "KAMUGISHA NATALIE", "KATEREGGA RASHIM", "KATEREGGA RAUL", "KAVUMA LORINE GRACE", "KAYEMBA SHAN",
        "KHARUNDA ESTHER", "KIMBUGWE MELVIN ELISHA", "KIRABIRA ARNOLD", "KITANDWE ABDULSHARKUL", "KUTEESA ISMAIL KALULE",
        "LWANGA RAPHAEL NAMPAGI", "LYMIAH AVRIL SALIM", "MATENYITIA MERCY", "MICHORO ANNA ALEX", "MOYA ELISHA",
        "MUGISA VALENTE CURTIS", "MUKISA SAMSON", "MULINDWA EDDY", "MURAMUZI JAN_JENSEN", "NABAKOOZA CHRISTINE",
        "NABIKOLO ANNA", "NAJIB ALSHAFIQ", "NALUMANSI LYTON", "NAMALA SALASBEL", "NAMBI NAAVA",
        "NANDAWULA DESIRE", "NANONO ROSHAN ISMAIL", "NINSIIMA ALIANAH KIRABO", "NYONYOZI EDRINAH SKYLER", "SSEKANDI RAMADHAN",
        "SSONKO HENRY ARTHUR", "UMUTESI DINAH INEZ", "WALUSIMBI ABDUL SHARIK"
      ]
    },
    "P6": {
      "RADIANT": [
        "ABAHO FARRELL", "AINEMBABAZI ELIANAH", "ARIHO CALVIN", "ATUHAIRE COMFORT", "ATUHAIRE PROMISE",
        "ATWIINE RUTH", "AYEBALE ABORIGINE", "BUKENYA SHADRACK", "ELIANA TREASURE MUKISA", "KABUYAYA TATIANA",
        "KAKOOZA JUMA KAGGWA", "KIDHUUBO PATRICIA GLADYS", "KIMBUGWE TIMOTHY", "KISAWUZI PROSPER JONATHAN", "KIWANA GENEROUS",
        "KIYAGA TERRY ELIJAH", "KIZITO ISAIAH", "LUBOWA SHANITAH", "MURUNGI SHAREEF RAUSHAN", "MUTANDA LEON ARTHUR",
        "MUWANGUZI JEREMIAH ANKUNDA", "NAJJINGO TEOPISTA KALUNGI", "NAKANDI ROCINTA", "NAKINTU RAMLAH", "NAKYANZI BENINA",
        "NAMATA DIVINE HANNAH", "NAMITALA TONNIA", "NAMUTEBI LETICIA", "NAMYALO CLARA KETRA", "NANKYA NUSRAH",
        "NSUBUGA ERON", "NSUBUGA MATILDA YULLIANA", "OMAR ROSHEEN NSEGIMAANA", "PARA PATRINA", "RUGUMAYO JOSEPH REMIGIUS",
        "SANGA FAITH LISA", "SSEKATAWA CLANCY CALVIN", "SSENYONJO SEAN ADRIAN", "TALIDDA SARAH", "WALUGEMBE JONATHAN",
        "WAMALA CHESTNUT", "YIGA INNOCENT"
      ],
      "VIBRANT": [
        "ADITE DIRAN", "AKATUSIIMA RAVEN", "ANZOA JOVANNAH", "ATURINDA KELTON", "BALUKU ELEUTHERIUS BROGAN",
        "BUGINGO JORAM", "ITUNGO ISOBEL AYETA", "KABISWA ISAAC", "KALUNGI DAVID", "KATUMBA MARTHA",
        "KIRABO MADRINE PRINCESS", "KIWENDO CALVIN", "KYOMUGISHA ETHEL HANNAH", "LUYIGA RAHIM", "MAYITTO CHRISTIAN",
        "MIREMBE GIFT REBECCA", "MIRIMU ELIJAH", "MUBARAH RANIAH YAIZD", "MUGARURA PAXTON", "MUGENYI RYAN",
        "MUKIIBI JOSEPH", "MUKISA SHAMMAH", "MURUNGI AARON", "MUSIIMENTA HANNAH AMITO", "MUTEBI JORDAN DIEGO",
        "MUWANGUZI ETHAN", "NABACHWA SHIVAN", "NABUKENYA TYRA", "NAJJINGO RHONITAH LUCY", "NAKAWUKI RIANAH",
        "NAKAYENGA MARY KATEREGGA", "NAKIBUULE SHEENAH", "NAKIJJE PRISCA RESTY", "NAKIMERA MARIA", "NAKIMULI KATRINAH PEACE",
        "NAMAGANDA LUISA JOY", "NAMMANDA HAIFA", "NANGENDO GABRIELLA", "NANSAMBA ESTHER", "NANSUBUGA ASIA",
        "NASSAAZI JACINTA KIZZA", "NATYABA EVELYN TENDO", "NAYIGA SHUDAT ZAHARA", "OSINDE AHMED", "SSAAZI RAPHEAL",
        "SSENDAGI SOLOMON", "SSENUNGI TITUS"
      ],
      "VICTORS": [
        "AMUGE LYNDSEY MILES", "ATIM ZUBEDA", "ATULINDA AISHA", "AYEBARE MELLISA", "BATARINGAYA SHIMARO",
        "BUKIRWA SHAMRA DDUMBA", "BULEGA PIUS", "JJAGWE JOVAN", "JJUMBA ANGELLO", "KAJJUMBA BELLA COLYTE",
        "KAREMERA ABDUL HANAN", "KATONO ALLAN", "KAZIBA JOSHUA", "KIGGUNDU LIA", "KIRABO EVAS",
        "KIZZA JOYCE MYER SEMPA", "KYALIGONZA HARVEY RENATAH", "LUBWAMA MARTIN WASSWA", "LUKWAGO LUCKY AHMET", "LUKWAGO SHAWN",
        "LUYIMBAZI RODNEY", "LWANGA WYCLIFF", "MAKIKA MEEKSON", "MUBIRU RAJAB", "MUKISA PHILEMON",
        "MULWANA  JONATHAN", "MUSASIZI ADRIAN", "MWEBAZA PEACE", "NABWIRE GLORIA MICHELLE", "NAGAWA ANTHONIA BEATRICE",
        "NAKABUYE SHAROM", "NAKITTO MYRA REMEDY", "NAKITTO SHIFURAH ECMAT", "NALUBEGA JANIPHER", "NAMARA REBECCA BLESSED",
        "NAMAWEJJE   ELIZABETH SHANTAL", "NAMIREMBE KAHLAN MARTHA", "NAMPIJJA PATRICIA", "NAMUGENYI HELLEN", "NAMUSISI MARIA FEDERESI",
        "NAMWANJE MACRINAH", "NASSUNA EMILLY MATINAH", "NASSUUNA WILDER", "NAYIGA JOSELINE MARINA", "NYAKATO EDRINAH",
        "NYIRANEZA VIVIAN", "SSEMAKULA EZRA", "SSERUNKUMA ABRIELLE PROSPER", "TUKUNDANE EAMON", "YEBETE MARY SADAD ELIAS"
      ]
    }
  };

  // Convert school data to required format
  const classData: Class[] = Object.entries(schoolData).map(([className, streams]) => {
    const classId = className.toLowerCase();
    return {
      id: classId,
      name: className,
      streams: Object.entries(streams).map(([streamName, students]) => {
        const streamId = `${classId}-${streamName.toLowerCase()}`;
        return {
          id: streamId,
          name: streamName,
          students: students.map((name, index) => ({
            id: `${streamId}-${index + 1}`,
            name: name,
            email: `${name.toLowerCase().replace(/\s+/g, '')}@glorious.com`,
            photoUrl: `https://fresh-teacher.github.io/gloriouschool/${name}.JPG`
          }))
        };
      })
    };
  });
  
  // Load form data from localStorage on mount
  const [formData, setFormData] = useState<ApplicationForm>(() => {
    const saved = localStorage.getItem('electoralApplicationForm');
    return saved ? JSON.parse(saved) : {
      selectedClass: "",
      selectedStream: "",
      selectedStudent: "",
      position: "",
      experience: "",
      qualifications: "",
      whyApply: "",
    };
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('electoralApplicationForm', JSON.stringify(formData));
  }, [formData]);

  const allPositions = [
    { value: "head-prefect", label: "HEAD PREFECT", description: "Lead all prefects and student body", eligibleClasses: ["p4", "p5"] },
    { value: "academic-prefect", label: "ACADEMIC PREFECT", description: "Oversee academic activities and excellence", eligibleClasses: ["p5", "p6"] },
    { value: "head-monitor", label: "HEAD MONITOR(ES)", description: "Supervise class monitors and maintain order", eligibleClasses: ["p3", "p4", "p5"] },
    { value: "welfare-prefect", label: "WELFARE PREFECT (MESS PREFECT)", description: "Manage dining hall and student welfare", eligibleClasses: ["p4", "p5"] },
    { value: "entertainment-prefect", label: "ENTERTAINMENT PREFECT", description: "Organize school entertainment and cultural activities", eligibleClasses: ["p2", "p3", "p4", "p5"] },
    { value: "games-sports-prefect", label: "GAMES AND SPORTS PREFECT", description: "Coordinate sports activities and competitions", eligibleClasses: ["p4", "p5"] },
    { value: "health-sanitation", label: "HEALTH & SANITATION", description: "Ensure school cleanliness and health standards", eligibleClasses: ["p3", "p4", "p5"] },
    { value: "uniform-uniformity", label: "UNIFORM & UNIFORMITY", description: "Monitor dress code and appearance standards", eligibleClasses: ["p2", "p3", "p4", "p5"] },
    { value: "time-keeper", label: "TIME KEEPER", description: "Manage school schedules and punctuality", eligibleClasses: ["p4", "p5"] },
    { value: "ict-prefect", label: "ICT PREFECT", description: "Assist with technology and computer resources", eligibleClasses: ["p3", "p4"] },
    { value: "furniture-prefect", label: "FURNITURE PREFECT(S)", description: "Maintain and organize school furniture", eligibleClasses: ["p3", "p4", "p5", "p6"] },
    { value: "upper-section-prefect", label: "PREFECT FOR UPPER SECTION", description: "Supervise upper primary classes (P.4-P.6)", eligibleClasses: ["p4", "p5"] },
    { value: "lower-section-prefect", label: "PREFECT FOR LOWER SECTION", description: "Supervise lower primary classes (Baby-P.3)", eligibleClasses: ["p2"] },
    { value: "discipline-prefect", label: "PREFECT IN CHARGE OF DISCIPLINE", description: "Maintain discipline and good behavior", eligibleClasses: ["p3", "p4", "p5"] }
  ];

  // Get available positions based on selected class
  const getAvailablePositions = () => {
    if (!formData.selectedClass) return [];
    
    return allPositions.filter(position => 
      position.eligibleClasses.includes(formData.selectedClass)
    );
  };

  const positions = getAvailablePositions();

  const handleInputChange = (field: keyof ApplicationForm, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes
      if (field === 'selectedClass') {
        newData.selectedStream = "";
        newData.selectedStudent = "";
      } else if (field === 'selectedStream') {
        newData.selectedStudent = "";
      }
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    if (!consentChecked) {
      setShowConsentError(true);
      toast({
        title: "Consent Required",
        description: "Please confirm that all information provided is accurate before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show confetti first
    setShowConfetti(true);
    
    // Store application in localStorage for now
    const applicationData = {
      student_id: user?.id || userName,
      student_name: selectedStudentDetails?.name,
      student_email: selectedStudentDetails?.email,
      student_photo: selectedStudentDetails?.photoUrl,
      position: formData.position,
      class: classData.find(c => c.id === formData.selectedClass)?.name,
      stream: availableStreams.find(s => s.id === formData.selectedStream)?.name,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      experience: formData.experience,
      qualifications: formData.qualifications,
      whyApply: formData.whyApply
    };

    // Store the application
    localStorage.setItem(`electoral_application_${user?.id || userName}`, JSON.stringify(applicationData));
    
    toast({
      title: "🎉 Application Submitted!",
      description: `Congratulations, ${selectedStudentDetails?.name}! You have successfully applied for the post of ${positions.find(p => p.value === formData.position)?.label}. Your application is under review by the Glorious Electoral Commission.`,
    });
    
    // Clear localStorage after successful submission
    localStorage.removeItem('electoralApplicationForm');
    
    // Navigate after confetti animation completes
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/electoral');
    }, 4000);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      // Use setTimeout to ensure the step change is rendered before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Use setTimeout to ensure the step change is rendered before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.selectedClass && formData.selectedStream && formData.selectedStudent;
      case 2:
        return formData.position;
      case 3:
        return true; // Preview step
      default:
        return false;
    }
  };

  // Get available streams for selected class
  const availableStreams = formData.selectedClass 
    ? classData.find(c => c.id === formData.selectedClass)?.streams || []
    : [];

  // Get available students for selected stream
  const availableStudents = formData.selectedStream
    ? availableStreams.find(s => s.id === formData.selectedStream)?.students || []
    : [];

  // Get selected student details
  const selectedStudentDetails = formData.selectedStudent
    ? availableStudents.find(s => s.id === formData.selectedStudent)
    : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Confetti isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="container mx-auto px-4 py-8">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/electoral')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Electoral Hub
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <UserPlus className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Apply for Leadership
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Step forward and make a difference in your school community
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 ${
                      currentStep > step ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  {currentStep === 1 && (
                    <>
                      <GraduationCap className="h-5 w-5 text-blue-500" />
                      Student Identification
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <Trophy className="h-5 w-5 text-orange-500" />
                      Position Selection
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <Eye className="h-5 w-5 text-purple-500" />
                      Review & Submit
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Student Identification */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2 mb-6">
                      <h3 className="text-lg font-semibold">Identify Yourself</h3>
                      <p className="text-muted-foreground">
                        Select your class, stream, and name from the dropdown menus
                      </p>
                    </div>

                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="class">Class *</Label>
                        <Select value={formData.selectedClass} onValueChange={(value) => handleInputChange('selectedClass', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classData.map((classItem) => (
                              <SelectItem key={classItem.id} value={classItem.id}>
                                {classItem.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.selectedClass && (
                        <div className="space-y-2">
                          <Label htmlFor="stream">Stream/Section *</Label>
                          <Select value={formData.selectedStream} onValueChange={(value) => handleInputChange('selectedStream', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your stream" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStreams.map((stream) => (
                                <SelectItem key={stream.id} value={stream.id}>
                                  {stream.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {formData.selectedStream && (
                        <div className="space-y-2">
                          <Label htmlFor="student">Your Name *</Label>
                          <Select value={formData.selectedStudent} onValueChange={(value) => handleInputChange('selectedStudent', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your name" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableStudents.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedStudentDetails && (
                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800 dark:text-green-200">Student Details Confirmed</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <img
                                src={selectedStudentDetails.photoUrl}
                                alt={`${selectedStudentDetails.name}'s photo`}
                                className="w-16 h-16 rounded-lg object-cover border-2 border-green-300 dark:border-green-600"
                                onError={(e) => {
                                  e.currentTarget.src = "/src/assets/default-avatar.png";
                                }}
                              />
                            </div>
                            <div className="flex-1 text-sm space-y-1 text-green-700 dark:text-green-300">
                              <p><strong>Name:</strong> {selectedStudentDetails.name}</p>
                              <p><strong>Email:</strong> {selectedStudentDetails.email}</p>
                              <p><strong>Class:</strong> {classData.find(c => c.id === formData.selectedClass)?.name}</p>
                              <p><strong>Stream:</strong> {availableStreams.find(s => s.id === formData.selectedStream)?.name}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Position Selection */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                     <div className="text-center space-y-2">
                       <h3 className="text-lg font-semibold">Choose Your Prefectorial Position</h3>
                       <p className="text-muted-foreground">
                         Select from the available prefectorial posts for your class level
                       </p>
                       {formData.selectedClass && (
                         <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm">
                           <p className="text-blue-800 dark:text-blue-200">
                             <strong>Available positions for {classData.find(c => c.id === formData.selectedClass)?.name}:</strong> {positions.length} posts
                           </p>
                         </div>
                       )}
                     </div>
                    
                     {positions.length === 0 ? (
                       <div className="text-center py-8">
                         <AlertCircle className="h-12 w-12 mx-auto text-orange-500 mb-4" />
                         <h4 className="font-medium text-lg mb-2">No Positions Available</h4>
                         <p className="text-muted-foreground">
                           Please select your class first to see available prefectorial positions.
                         </p>
                       </div>
                     ) : (
                       <div className="grid md:grid-cols-1 gap-4">
                         {positions.map((position) => (
                        <Card 
                          key={position.value}
                          className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                            formData.position === position.value 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleInputChange('position', position.value)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{position.label}</h4>
                              {formData.position === position.value && (
                                <CheckCircle className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {position.description}
                            </p>
                          </CardContent>
                         </Card>
                         ))}
                       </div>
                     )}

                    {formData.position && (
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">
                            Position Selected: {positions.find(p => p.value === formData.position)?.label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Review & Submit */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center space-y-2 mb-6">
                      <h3 className="text-lg font-semibold">Review Your Application</h3>
                      <p className="text-muted-foreground">
                        Please review all details before submitting your application
                      </p>
                    </div>

                    <div className="grid gap-6">
                      {/* Student Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Student Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Name</Label>
                            <p className="font-medium">{selectedStudentDetails?.name}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{selectedStudentDetails?.email}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Photo</Label>
                            <img
                              src={selectedStudentDetails?.photoUrl}
                              alt={`${selectedStudentDetails?.name}'s photo`}
                              className="w-12 h-12 rounded-lg object-cover border border-border mt-1"
                              onError={(e) => {
                                e.currentTarget.src = "/src/assets/default-avatar.png";
                              }}
                            />
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Class & Stream</Label>
                            <p className="font-medium">
                              {classData.find(c => c.id === formData.selectedClass)?.name} - {availableStreams.find(s => s.id === formData.selectedStream)?.name}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Position Information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Applied Position
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div>
                            <Label className="text-muted-foreground">Position</Label>
                            <p className="font-medium">{positions.find(p => p.value === formData.position)?.label}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {positions.find(p => p.value === formData.position)?.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Consent Confirmation */}
                      <div className={`bg-blue-50 dark:bg-blue-950/20 border rounded-lg p-4 transition-all duration-300 ${
                        showConsentError 
                          ? 'border-red-500 shadow-lg shadow-red-500/25 animate-pulse' 
                          : 'border-blue-200 dark:border-blue-800'
                      }`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-3">Application Confirmation</h4>
                            <div className="flex items-start gap-3">
                              <Checkbox 
                                id="consent" 
                                checked={consentChecked}
                                onCheckedChange={(checked) => {
                                  setConsentChecked(checked === true);
                                  if (checked === true) setShowConsentError(false);
                                }}
                                className="mt-0.5"
                              />
                               <label 
                                htmlFor="consent" 
                                className="text-sm text-blue-700 dark:text-blue-300 cursor-pointer"
                              >
                                I, <strong>{selectedStudentDetails?.name || 'the applicant'}</strong>, confirm that all information provided is accurate and complete. I understand that any false information may result in disqualification from the election process.
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  {currentStep > 1 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={prevStep}
                      className="flex-1"
                    >
                      Previous
                    </Button>
                  )}
                  {currentStep < 3 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className={currentStep === 1 ? "w-full" : "flex-1"}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={handleSubmit}
                      disabled={isSubmitting || !isStepValid(currentStep) || !consentChecked}
                      className="flex-1"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

          {/* Important Notes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                 <div>
                   <h4 className="font-medium mb-2">Application Deadline</h4>
                   <p className="text-muted-foreground">All applications must be submitted by September 19, 2025 at 4:00 PM EAT</p>
                 </div>
                 <div>
                   <h4 className="font-medium mb-2">Vetting Process</h4>
                   <p className="text-muted-foreground">Nominees will be vetted from September 25-27, 2025</p>
                 </div>
                 <div>
                   <h4 className="font-medium mb-2">Campaign Period</h4>
                   <p className="text-muted-foreground">Approved candidates may campaign from October 1-16, 2025</p>
                 </div>
                 <div>
                   <h4 className="font-medium mb-2">Class Eligibility</h4>
                   <p className="text-muted-foreground">Each position has specific class requirements - check eligibility before applying</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}
