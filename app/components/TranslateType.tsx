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