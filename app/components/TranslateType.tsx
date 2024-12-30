const translateType = (type: string | null) => {
    let displayType = "";
    if (type == null) {
      return;
    } else if (type.toLowerCase().includes("mousserande")) {
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