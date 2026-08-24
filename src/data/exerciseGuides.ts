import type { ExerciseTypeId } from "../domain/types";

export const EXERCISE_SAFETY =
  "Bruk en belastning du kontrollerer, og stopp ved skarp smerte.";

export interface GuideSource {
  label: string;
  href: string;
}

export interface ExerciseGuide {
  how: string;
  why: string;
  understandMore: string;
  important?: string;
  whySource?: GuideSource;
  understandMoreSource?: GuideSource;
}

export const EXERCISE_GUIDES: Record<ExerciseTypeId, ExerciseGuide> = {
  run: {
    how: "Løp med avslappede skuldre, blikket frem og korte, naturlige steg. Finn et tempo du kan holde gjennom distansen.",
    why: "Bygger kondisjon og gjør hjertet, lungene og kroppen bedre til å transportere og bruke oksygen.",
    whySource: {
      label: "Mayo Clinic",
      href: "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/fitness-training/art-20044792",
    },
    understandMore:
      "Gjør det lettere å gå raskt, ta trapper, leke, reise og være aktiv uten å bli fort utslitt. Kondisjonstrening bygger kapasiteten hjertet og lungene bruker gjennom hele livet.",
  },
  stretching: {
    how: "Varm opp lett først. Hold hver tøyning rolig i omtrent 30 sekunder uten å gynge. Du skal kjenne strekk, ikke smerte.",
    why: "Bedrer bevegelighet og gjør det lettere å bruke leddene gjennom hele bevegelsesbanen.",
    whySource: {
      label: "Mayo Clinic",
      href: "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931",
    },
    understandMore:
      "Hjelper deg å bøye deg, snu deg, kle på deg og nå ting uten at kroppen føles unødvendig begrenset. Bevegelighet gir deg flere tilgjengelige bevegelsesmuligheter, men gjør deg ikke automatisk skadefri.",
  },
  "pull-ups": {
    how: "Heng med aktiv overkropp. Trekk albuene ned og løft brystet mot stangen uten å svinge. Senk deg kontrollert.",
    why: "Bygger rygg, lats, biceps og grep.",
    understandMore:
      "Bygger evnen til å trekke og holde din egen kroppsvekt. Det gir styrkereserve til klatring, bæring, tunge trekk og situasjoner hvor du må holde deg fast.",
  },
  "push-ups": {
    how: "Hold kroppen strak. Senk brystet mellom hendene med albuene litt bakover, og press deg opp igjen.",
    why: "Trener bryst, triceps, skuldre og kjernestabilitet.",
    understandMore:
      "Trener kroppen til å skyve samtidig som overkroppen holdes stabil. Det er nyttig når du skyver dører og vogner eller må presse deg opp fra gulvet.",
  },
  "air-squats": {
    how: "Stå omtrent skulderbredt. Sett hoftene bak og ned, hold brystet oppe og la knærne følge tærnes retning.",
    why: "Trener lår og sete og bygger et godt grunnlag for tyngre knebøy.",
    understandMore:
      "Øver direkte på en av livets viktigste bevegelser: å sette seg og reise seg. Den samme kapasiteten brukes på toalettet, fra en lav stol, i trapper og når du plukker opp noe.",
  },
  "box-jumps": {
    how: "Bøy lett i hofter og knær, hopp eksplosivt og land mykt med begge føttene på boksen. Reis deg helt opp og gå ned.",
    why: "Utvikler eksplosiv styrke, koordinasjon og kontroll i landingen.",
    understandMore:
      "Trener evnen til å produsere kraft raskt. Hurtig kraft er nyttig når du må ta et raskt steg, hoppe over noe eller reagere når du mister balansen. Muskelkraft ser ut til å være viktig for fysisk funksjon når vi blir eldre.",
    understandMoreSource: {
      label: "Systematisk forskningsoversikt",
      href: "https://pubmed.ncbi.nlm.nih.gov/35953775/",
    },
  },
  dips: {
    how: "Hold skuldrene nede. Senk kroppen kontrollert til overarmene er omtrent parallelle med gulvet, eller så langt skuldrene tåler, og press opp.",
    why: "Bygger særlig triceps, bryst og fremside skuldre.",
    important: "Dips er ikke nødvendig eller passende for alle skuldre.",
    understandMore:
      "Bygger styrke til å støtte og løfte egen kroppsvekt med armene. Det kan gjøre det lettere å presse seg opp fra lave posisjoner.",
  },
  "floor-wipers": {
    how: "Ligg på ryggen og hold en sikret stang over brystet. Før strake eller lett bøyde ben kontrollert mot hver side uten å miste kontroll over korsryggen.",
    why: "Trener mage, skrå magemuskler og evnen til å kontrollere rotasjon.",
    important: "Dette er en avansert øvelse. Start uten vekt og bruk sikring eller spotter.",
    understandMore:
      "Trener kroppen til å kontrollere beina mens overkroppen holdes stabil. Det er relevant når du snur deg, skifter retning eller håndterer en last som trekker kroppen til siden.",
  },
  "weighted-planks": {
    how: "Hold kroppen strak fra hode til hæl og spenn mage og sete. Plasser vekten på øvre/midtre rygg med hjelp fra en annen person.",
    why: "Bygger kjernestabilitet og utholdenhet mot svai i korsryggen.",
    whySource: {
      label: "NASM",
      href: "https://www.nasm.org/resource-center/exercise-library/plank",
    },
    understandMore:
      "Trener kroppen til å holde ryggraden stabil mens den utsettes for belastning. Det gir et bedre fundament for å bære poser, løfte møbler og overføre kraft mellom armer og ben.",
  },
  deadlifts: {
    how: "Start med stangen tett inntil leggene. Spenn magen, hold ryggen nøytral og løft ved å presse gulvet bort. Hold stangen nær kroppen.",
    why: "Bygger helkroppsstyrke, spesielt sete, bakside lår, rygg og grep.",
    whySource: {
      label: "CrossFit",
      href: "https://www.crossfit.com/essentials/foundational-movement-deadlift-what-is-a-deadlift",
    },
    understandMore:
      "Lærer kroppen å løfte noe fra bakken med hofter, ben og overkropp i samarbeid. Det ligner på å løfte handleposer, bagasje, flytteesker eller et barn.",
  },
  "clean-press": {
    how: "Løft stangen tett langs kroppen, strekk eksplosivt ut hofter og knær og ta imot stangen på skuldrene. Stabiliser før du presser den over hodet.",
    why: "Trener kraft, koordinasjon og styrke i hele kroppen.",
    whySource: {
      label: "CrossFit om clean",
      href: "https://www.crossfit.com/essentials/foundational-movement-clean-what-is-a-clean",
    },
    important: "Øvelsen bør tilpasses eller forenkles for nybegynnere.",
    understandMore:
      "Kombinerer to svært praktiske oppgaver: å løfte noe fra bakken og plassere det over hodet. Øvelsen utvikler koordinasjon, kraft og helkroppskontroll.",
  },
  "bent-over-row": {
    how: "Bøy i hoftene med nøytral rygg. Trekk stangen mot nedre ribbein, før albuene bakover og senk kontrollert.",
    why: "Bygger øvre rygg, lats og biceps samtidig som kjernen stabiliserer kroppen.",
    understandMore:
      "Bygger styrke til å trekke gjenstander mot kroppen og holde dem tett inntil deg. Det er nyttig ved bæring, flytting og andre oppgaver hvor ryggen må arbeide stabilt.",
  },
  squats: {
    how: "Plasser stangen stabilt på øvre rygg. Spenn magen, sett deg kontrollert ned og press opp gjennom hele foten.",
    why: "Bygger styrke i lår, sete og kjerne.",
    understandMore:
      "Bygger ekstra styrkereserve i bevegelsen du bruker når du setter deg, reiser deg, går i trapper og løfter fra lave høyder. Jo sterkere du er, desto mindre krevende blir hver vanlig repetisjon i hverdagen.",
  },
  "bench-press": {
    how: "Plant føttene og trekk skulderbladene sammen. Senk stangen kontrollert mot midtre bryst og press den opp igjen.",
    why: "Bygger bryst, triceps og fremside skuldre.",
    important: "Bruk spotter eller sikkerhetsarmer ved tunge sett.",
    understandMore:
      "Bygger generell skyvestyrke. Den samme typen styrke brukes når du skyver tunge dører, vogner og møbler eller presser kroppen opp fra bakken.",
  },
  "military-press": {
    how: "Start med stangen ved skuldrene. Spenn mage og sete, press stangen tett forbi ansiktet og avslutt rett over kroppen.",
    why: "Bygger skuldre, triceps og stabilitet i kjernen.",
    understandMore:
      "Trener evnen til å løfte ting over hodet uten å miste kontroll over resten av kroppen. Det er nyttig for bagasjehyller, skap, oppbevaring og mange arbeidsoppgaver.",
  },
  "arnold-press": {
    how: "Start med håndflatene vendt mot ansiktet. Roter armene utover mens du presser hantlene over hodet, og reverser kontrollert.",
    why: "Trener skuldre og triceps gjennom både rotasjon og press.",
    understandMore:
      "Trener skuldrene gjennom både rotasjon og løft over hodet. Det utvikler kapasitet i bevegelser som brukes når du kler på deg, rekker etter noe eller plasserer ting på en hylle.",
  },
  "chest-flys": {
    how: "Hold en liten bøy i albuene. Åpne armene kontrollert til du kjenner strekk i brystet, og før dem sammen igjen.",
    why: "Trener brystets jobb med å føre armene inn foran kroppen.",
    understandMore:
      "Trener kontroll når armene føres inn foran kroppen. Den kapasiteten brukes når du holder en stor gjenstand, bærer noe mot brystet eller trekker armene sammen rundt en last.",
  },
  "shoulder-front-raises": {
    how: "Hold hantlene foran lårene. Løft dem kontrollert til omtrent skulderhøyde uten å svinge kroppen.",
    why: "Trener hovedsakelig fremsiden av skuldrene.",
    understandMore:
      "Bygger kapasitet til å løfte og holde armene foran kroppen. Det brukes når du rekker etter, bærer eller plasserer gjenstander foran deg.",
  },
  "sled-pull": {
    how: "Fest sleden i sele eller stropper. Hold kroppen stabil, stroppene stramme og bruk korte, kraftfulle steg med samme løpsteknikk hele veien.",
    why: "Trener beindriv, arbeidskapasitet og kraft. Belastningen skal ikke være så tung at teknikken bryter sammen.",
    whySource: {
      label: "NSCA",
      href: "https://www.nsca.com/education/articles/kinetic-select/light-sled-pulls/",
    },
    understandMore:
      "Trener evnen til å fortsette å bevege seg når kroppen møter motstand. Det bygger beindriv og arbeidskapasitet som kan overføres til bakker, trapper og fysisk arbeid.",
  },
  "lat-pulldown": {
    how: "Hold brystet oppe og trekk stangen foran kroppen mot øvre bryst. Før albuene ned uten å lene deg langt bakover.",
    why: "Trener lats, øvre rygg og biceps og bygger styrke i vertikale trekk.",
    understandMore:
      "Gir en tilgjengelig måte å bygge vertikal trekkstyrke på. Det hjelper deg å trekke noe ned fra høyden og vedlikeholder kapasiteten som senere kan brukes til pull-ups og klatring.",
  },
  "close-grip-cable-row": {
    how: "Sitt med nøytral rygg. Trekk håndtaket mot magen med albuene tett inntil kroppen, og slipp rolig frem igjen.",
    why: "Bygger lats, øvre og midtre rygg samt biceps.",
    understandMore:
      "Trener deg på å trekke noe inn mot kroppen med kontroll. Det bygger kapasitet for bæring og trekking og gir skuldrene støtte fra en sterk øvre rygg.",
  },
  "cable-bicep-curls": {
    how: "Hold albuene i ro ved siden av kroppen. Bøy armene uten å svinge overkroppen, og senk håndtaket kontrollert.",
    why: "Trener biceps med jevn motstand gjennom bevegelsen.",
    understandMore:
      "Styrker bevegelsen som brukes hver gang du bøyer armen for å løfte eller holde noe. Det gjelder alt fra handleposer og verktøy til barn og bagasje.",
  },
  "tricep-pushdown": {
    how: "Hold albuene tett inntil kroppen. Press håndtaket ned til armene er strake, og returner kontrollert.",
    why: "Trener triceps og styrker avslutningen av pressbevegelser.",
    understandMore:
      "Styrker evnen til å rette ut armen under belastning. Det er viktig når du skyver noe fra deg eller bruker armene for å komme deg opp fra en stol eller fra gulvet.",
  },
  "tricep-overhead": {
    how: "Hold albuene smale og pekende fremover. Senk vekten bak hodet og strekk armene ut uten å svaie.",
    why: "Trener triceps, særlig delen som belastes når armen er over hodet.",
    understandMore:
      "Bygger armstyrke i en posisjon mange sjelden trener. Det kan gjøre det lettere å løfte, holde og plassere ting over hodet.",
  },
  "leg-press": {
    how: "Hold rygg og hofter mot puten. Senk vekten kontrollert, la knærne følge tærne og press gjennom hele foten.",
    why: "Lar deg belaste lår og sete tungt i en stabil posisjon.",
    understandMore:
      "Bygger beinstyrke uten at balanse eller kompleks teknikk blir den største begrensningen. Sterkere ben gjør det lettere å reise seg, gå i trapper og holde seg mobil.",
  },
  "hamstring-curls": {
    how: "Plasser kneleddet i linje med maskinens dreiepunkt. Trekk hælene mot setet uten å løfte hoftene, og senk rolig.",
    why: "Trener bakside lår og styrker bevegelsen som bøyer kneet.",
    understandMore:
      "Styrker baksiden av lårene, som hjelper til med å kontrollere knærne og beina når du går, løper og bremser. Det bidrar til et mer robust og balansert understell.",
  },
};
