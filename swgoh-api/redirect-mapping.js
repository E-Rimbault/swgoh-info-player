// redirect-mapping.js
function redirectToUnitPage(unitName) {
    const lowerName = unitName.toLowerCase();

    if (lowerName === "0-0-0") {
        window.open("https://e-rimbault.github.io/swgoh-kit/html/0_0_0.html", "_blank");
    } else if (lowerName === "padawan sabine wren") {
        window.open("https://e-rimbault.github.io/swgoh-kit/html/padawan-sabine.html", "_blank");
    } 
    // 🔁 Ajoute ici autant de conditions que nécessaire
    else {
        alert("Page de présentation non disponible pour : " + unitName);
    }
}
