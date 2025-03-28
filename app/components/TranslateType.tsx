const translateType = (type: string | null) => {
    let displayType = "";
    if (type == null) {
      return;
    } else if (type.toLowerCase().includes("mousserande") || type.toLowerCase().includes("champagne")) {
      displayType += "🍾 ";
      displayType += "Mousserande";
    } else if (type.toLowerCase().includes("cocktail") && !type.toLowerCase().includes("cider")) {
      displayType += "🍸 ";
      displayType += "Sprit till cocktail";
    } else if (type.toLowerCase().includes("blanddryck")) {
      displayType += "🍹 ";
      displayType += "Blanddryck";
    } else if (type.toLowerCase().includes("beer,")) {
      displayType += "🍺 ";
      displayType += "Öl";
    } else if (type.toLowerCase().includes("wine,")) {
      displayType += "🍷 ";
      displayType += "Vin";
    } else if (type.toLowerCase().includes("liquor,")) {
      displayType += "🥃 ";
      displayType += "Sprit";
    } else if (type.toLowerCase().includes("cider,")) {
      displayType += "🍏 ";
      displayType += "Cider";
    }
    if (type.toLowerCase().includes("ordervara")) {
      displayType += " (Ordervara)";
    }
    return displayType;
  };
  
  export default translateType;

  export function displaySortCriteria(criteria: string) {
    switch (criteria) {
      case 'apk':
        return 'APK';
      case 'price':
        return 'Pris';
      case 'alcohol':
        return 'Alkoholhalt';
      case 'volume':
        return 'Volym';
      case 'vpk':
        return 'Volym/kr';
      default:
        return criteria.toUpperCase();
    }
  }
  
  export function displayFilterType(filter: string | null) {
    if (!filter) return '';
    switch (filter.toLowerCase()) {
      case 'beer':
        return 'Öl';
      case 'wine':
        return 'Vin';
      case 'liquor':
        return 'Sprit';
      case 'cider':
        return 'Cider & blanddrycker';
      default:
        return filter;
    }
  }
  
  export function displayNestedFilterType(nested: string | null) {
    if (!nested) return '';
    switch (nested.toLowerCase()) {
      case 'lager':
        return 'Ljus lager';
      case ' ale':
        return 'Ale';
      case 'ipa':
        return 'IPA';
      case 'syrlig öl':
        return 'Syrlig öl';
      case 'porter och stout':
        return 'Porter & Stout';
      case 'mörk lager':
        return 'Mellanmörk & mörk lager';
      case 'veteöl':
        return 'Veteöl';
      case 'annan öl':
        return 'Annat öl';
      case 'rött':
        return 'Rödvin';
      case 'vitt':
        return 'Vitt vin';
      case 'rosé':
        return 'Rosévin';
      case 'mousserande':
        return 'Mousserande vin';
      case 'starkvin':
        return 'Starkvin';
      case 'whiskey':
        return 'Whiskey';
      case 'vodka':
        return 'Vodka';
      case 'rom':
        return 'Rom';
      case ' gin':
        return 'Gin';
      case 'tequila':
        return 'Tequila';
      case 'likör':
        return 'Likör';
      case 'akvavit':
        return 'Akvavit';
      case 'kryddat brännvin':
        return 'Kryddat brännvin';
      case 'cognac':
        return 'Cognac';
      case 'grappa':
        return 'Grappa';
      case 'fruktsprit':
        return 'Fruktsprit';
      case 'bitter':
        return 'Bitter';
      case 'calvados':
        return 'Calvados';
      case 'drinkar & cocktails':
        return 'Drinkar & cocktails';
      case 'punsch':
        return 'Punsch';
      case 'torr':
        return 'Torr cider';
      case 'söt':
        return 'Söt cider';
      case 'blanddryck':
        return 'Blanddryck';
      default:
        return nested;
    }
  }

export const alcoholFacts = [
  "Sprit har använts som medicin i tusentals år.",
  "Vin är en av de äldsta alkoholhaltiga dryckerna och har funnits i över 8 000 år.",
  "Öl var en gång en del av den dagliga kosten i medeltida Europa.",
  "Champagne uppfanns av misstag av munkar i Frankrike.",
  "Tequila tillverkas endast i vissa regioner i Mexiko.",
  "Absint var förbjudet i många länder på grund av dess påstådda hallucinogena effekter.",
  "Whisky betyder 'livets vatten' på gaeliska.",
  "Rom var en gång en viktig handelsvara i Karibien.",
  "Cider är en av de mest populära dryckerna i Storbritannien.",
  "Alkoholfri öl har blivit alltmer populärt de senaste åren.",
  "Det finns över 400 olika sorter av belgisk öl.",
  "Gin serveras traditionellt med tonic och en skiva citron eller lime.",
  "Sake är en traditionell japansk alkoholdryck gjord på ris.",
  "Grappa är en italiensk sprit gjord av rester från vinframställning.",
  "Calvados är en äpplebaserad spritdryck från Normandie i Frankrike.",
  "Punsch är en svensk dryck med anor från 1700-talet.",
  "Sherry får bara produceras i distriktet Jerez i Andalusien, Spanien.",
  "Belgien är känt för sina trappistöl som bryggs i kloster.",
  "Portvin härstammar från Douro-dalen i norra Portugal.",
  "Kombuchaliknande drycker bryggdes redan för tusentals år sedan.",
  "Öl kan spåras tillbaka till antika Mesopotamien för över 5 000 år sedan.",
  "Likör är en söt spritdryck smaksatt med frukt, örter eller kryddor.",
  "Vermouth är ett starkvin som kryddas med örter och kryddor.",
  "Bitters används ofta som en digestif efter en måltid.",
  "Mead, på svenska mjöd, är en av världens äldsta fermenterade drycker.",
  "Korn, ris, majs och vete är vanliga spannmål vid sprittillverkning.",
  "Den tyska renhetslagen (Reinheitsgebot) för öl stiftades 1516.",
  "Prosecco framställs i Venetoregionen i Italien.",
  "Sake bryggs genom att konvertera stärkelse till socker med hjälp av koji.",
  "Olika jästtyper påverkar ölens smakprofil och karaktär."
];