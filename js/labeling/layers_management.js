

export default class LayersManagement {

    constructor () {
        this.id = "layers_management";
        this.el = document.getElementById(this.id);
        this.el.classList.add("p-1");
        this.ul = document.createElement("ul");
        this.ul.classList.add("list-group");
        this.ul.classList.add("p-1");
        this.el.appendChild(this.ul);

        this.pinned = false;
    }

    getLayer (id) {
        // abstract method
    }

    pin () {
        this.pinned = true;
    }

    unpin () {
        this.pinned = false;
    }

    render (e) {
        this.ul.innerHTML = "";
        let layers = e.target.getAttribute("data-layers").split(",");
        this.ul.appendChild(this.divider());
        for (let i = layers.length - 1; i >= 0; i--) {
            let layer = this.getLayer(layers[i]);
            this.ul.appendChild(this.existing_layer(layer));
        }
        this.ul.appendChild(this.divider());
        for (let i = layers.length - 1; i >= 0; i--) {
            let layer = this.getLayer(layers[i]);
            this.ul.appendChild(this.new_layer(layer));
        }
        this.ul.appendChild(this.divider());
    }

    existing_layer (layer) {
        let newNode = document.createElement("li");
        newNode.classList.add("list-group-item");
        newNode.classList.add("p-1");
        newNode.style.color = layer.color;
        newNode.innerHTML = `
        <div class="d-flex">
            <div class="col m-0">
                <div class="row m-0" style="font-weight: bold;">${layer.name}</div>
                <div class="row m-0">
                    <i>Layer id: ${layer.id}</i>
                </div>
            </div>
            <button class="btn btn-danger btn-sm mr-3">&times;</button>
        </div>`;
        return newNode;
    }

    new_layer (layer) {
        let newNode = document.createElement("li");
        newNode.classList.add("list-group-item");
        newNode.classList.add("p-1");
        newNode.style.color = layer.color;
        newNode.innerHTML = `
        <div class="d-flex">
            <div class="col m-0">
                <div class="row m-0" style="font-weight: bold;">${layer.name}</div>
                <div class="row m-0">
                    <i>Layer id: ${layer.id}</i>
                </div>
            </div>
            <button class="btn btn-success btn-sm mr-3">+</button>
        </div>`;
        return newNode;
    }

    divider () {
        let newNode = document.createElement("li");
        newNode.classList.add("list-group-item");
        newNode.classList.add("d-flex");
        newNode.classList.add("justify-content-center");
        newNode.innerHTML = `<div class="divider-el"></div>`;
        return newNode;
    }

}
