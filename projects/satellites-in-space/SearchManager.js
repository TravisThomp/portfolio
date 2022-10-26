class SearchManager {

    constructor() {
        this._searchListElem = document.getElementById("searchList");
        this._searchBox = document.getElementById("satSearchBox");
        this._count = 0;
        window.addEventListener("input", this.onType.bind(this));
        this._searchListElem.addEventListener("click", this.onClick.bind(this));
    }

    selectSatellite(satCatalogNum) {
        let sat = satManager.getSatByCatalog(satCatalogNum);
        sat.showOrbitPath();
    }

    deselectSatellite(satCatalogNum) {
        let sat = satManager.getSatByCatalog(satCatalogNum);
        sat.removeOrbitPath();
    }

    toggleColor(itemCatalogNum) {
        let item = this.getItemByCatalog(itemCatalogNum);
        if(item.style.color == "") {
            item.style.color =  "#454ADE";
        } else {
            item.style.color = "";
        }
    }

    toggleSelection(item) {
        if(item.style.color == "") {
            item.style.color =  "#454ADE";
            this.selectSatellite(this.getCatalogFromText(item.textContent));
        } else {
            item.style.color = "";
            this.deselectSatellite(this.getCatalogFromText(item.textContent));
        }
    }

    addItemToList(sat) {
        let item = this.createItemLi(sat.name + " (" + sat.catalogNumber + "U)");
        this._searchListElem.appendChild(item);
        this._count++;
    }

    createItemLi(itemName) {
        let item = document.createElement("li");
        item.className = "search-active";
        item.appendChild(document.createTextNode(itemName));

        return item;
    }

    getItemByCatalog(catalogNumber) {
        let items = this._searchListElem.getElementsByTagName("li");
        for(let i = 0; i < items.length; i++) {
            let text = items[i].textContent;
            let itemCatalog = this.getCatalogFromText(text);
            if(itemCatalog == catalogNumber) {
                return items[i];
            }
        }
        return null;
    }

    getCatalogFromText(text) {
        return text.substring(text.indexOf("(") + 1, text.length - 2);
    }

    onType() {
        let searchQuery = this._searchBox.value.toUpperCase();
        let items = this._searchListElem.getElementsByTagName("li");
        let filter = this._searchBox.value.toUpperCase();

        for(let i = 0; i < items.length; i++) {
            if(items[i].textContent.indexOf(filter) > -1) {
                items[i].className = "search-active";
            }
            else {
                items[i].className = "search-inactive";
            }
        }
    }

    onClick(event) {
        let item = event.target;
        this.toggleSelection(item);
    }
}
