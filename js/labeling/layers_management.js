import State from "./annotation/state";
import RenderMode from "./render_mode";


export default class LayersManagement {

    constructor () {
        this.id = "layers_management";
        this.el = document.getElementById(this.id);
        this.el.classList.add("p-1");

        this.ul = document.createElement("ul");
        this.ul.classList.add("list-group");
        this.ul.classList.add("p-1");
        this.el.appendChild(this.ul);
        
        this.icon_id = "pin_icon";
        this.icon = document.getElementById(this.icon_id);

        this.activeElements = 0;
        this.pinned = 0;

        this.render(RenderMode.EMPTY);
    }

    getLayer (id) {
        throw "Not implemented!";
    }

    applyLayer (l) {
        throw "Not implemented!";
    }

    removeLayer (l) {
        throw "Not implemented!";
    }

    unpin () {
        this.pinned = false;
        this.icon.innerHTML = "<i class='fas fa-lock-open'></i>";
    }

    pin () {
        this.pinned = true;
        this.icon.innerHTML = "<i class='fas fa-lock'></i>";
    }

    render (mode, state, what) {

        switch (state) {
            case State.SELECTING: this.pin(); break;
            case State.UNSELECT: this.unpin(); break;
            case State.HOVERING: this.unpin(); break;
            case State.FOCUSING: this.pin(); break;
        }

        switch (mode) {
            case RenderMode.EMPTY:
                this.renderEmpty();
                break;
            case RenderMode.SUGGESTIONS: 
                if (what == null) {
                    break;
                }
                this.renderSuggestions(what);
                break;
            case RenderMode.ELEMENT:
                if (what == null) {
                    this.renderEmpty();
                    break;
                }
                this.renderElement(what);
                break;
        }
    }

    renderEmpty () {
        this.ul.innerHTML = "";
        this.ul.appendChild(this.divider());
        let newNode = document.createElement("li");
        newNode.classList.add("list-group-item");
        newNode.style.fontStyle = "italic";
        newNode.innerHTML = "Nothing yet...";
        this.ul.appendChild(newNode);
        this.ul.appendChild(this.divider());
    }

    renderSuggestions (metaLayers) {
        this.ul.innerHTML = "";
        this.ul.appendChild(this.divider());
        for (let ml of metaLayers) {
            this.ul.appendChild(this.newLayer(ml));
        }
        this.ul.appendChild(this.divider());
    }

    renderElement (layers) {
        this.ul.innerHTML = "";
        this.ul.appendChild(this.divider());

        this.activeElements = 0;
        for (let l of layers) {
            this.activeElements++;
            this.ul.appendChild(this.existingLayer(this.getLayer(l)));
        }
        this.ul.appendChild(this.divider());
    }

    existingLayer (layer) {
        
        let container = document.createElement("li");
        container.classList.add("list-group-item");
        container.classList.add("p-1");
        container.style.color = layer.color;

        let flex = document.createElement("div");
        flex.classList.add("d-flex");
        flex.innerHTML = `
        <div class="col m-0">
            <div class="row m-0" style="font-weight: bold;">${layer.name}</div>
            <div class="row m-0">
                <i>Layer id: ${layer.id}</i>
            </div>
        </div>
        `;

        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-danger");
        button.classList.add("btn-sm");
        button.classList.add("mr-3");
        button.innerHTML = "<i class='fa fa-times' aria-hidden='true'></i>";
        button.onclick = () => {
            this.unpin();
            this.removeLayer(layer.id);
            container.remove();
            this.activeElements--;
            if (this.activeElements == 0) {
                this.render(RenderMode.EMPTY);
            }
        }

        flex.appendChild(button);
        container.appendChild(flex);

        return container;
        
    }

    newLayer (layer) {

        let container = document.createElement("li");
        container.classList.add("list-group-item");
        container.classList.add("p-1");
        container.style.color = layer.color;

        let flex = document.createElement("div");
        flex.classList.add("d-flex");
        flex.innerHTML = `
        <div class="col m-0">
            <div class="row m-0" style="font-weight: bold;">${layer.name}</div>
        </div>
        `;

        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-success");
        button.classList.add("btn-sm");
        button.classList.add("mr-3");
        button.innerHTML = "<i class='fa fa-plus' aria-hidden='true'></i>";
        button.onclick = () => {
            this.unpin();
            this.applyLayer(layer);
        }

        flex.appendChild(button);
        container.appendChild(flex);
        
        return container;
    }

    divider () {
        let newNode = document.createElement("li");
        newNode.classList.add("list-group-item");
        newNode.classList.add("d-flex");
        newNode.classList.add("justify-content-center");
        newNode.innerHTML = `<div class="divider"></div>`;
        return newNode;
    }

}
