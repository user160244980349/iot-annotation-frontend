import State from "../annotation/state";
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
        let lock = document.createElement("div");
        lock.classList.add("fa");
        lock.classList.add("fa-lock");
        lock.araHidden = true;
        this.icon.appendChild(lock);

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
        let open = document.createElement("div");
        open.classList.add("fa");
        open.classList.add("fa-lock-open");
        open.araHidden = true;
        this.icon.removeChild(this.icon.lastChild);
        this.icon.appendChild(open);
    }

    pin () {
        this.pinned = true;
        let lock = document.createElement("div");
        lock.classList.add("fa");
        lock.classList.add("fa-lock");
        lock.araHidden = true;
        this.icon.removeChild(this.icon.lastChild);
        this.icon.appendChild(lock);
    }

    render (mode, state, what) {

        switch (state) {
            case State.SELECTING: this.pin(); break;
            case State.UNSELECT: this.unpin(); break;
            case State.HOVERING: this.unpin(); break;
            case State.FOCUSING: this.pin(); break;
        }

        if (what == null) {
            this.renderEmpty();
            return;
        }

        switch (mode) {
            case RenderMode.EMPTY:
                this.renderEmpty();
                break;
            case RenderMode.SUGGESTIONS:
                this.renderSuggestions(what);
                break;
            case RenderMode.ELEMENT:
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
        newNode.innerHTML = "Nothing to show...";
        this.ul.appendChild(newNode);
        this.ul.appendChild(this.divider());
    }

    renderSuggestions (metaLayers) {
        if (metaLayers.length === 0) {
            this.renderEmpty();
            return;
        }

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

        let item = document.createElement("li");
        item.classList.add("list-group-item");
        item.classList.add("p-0");
        item.classList.add("m-0");
        item.style.color = layer.color;

        let flex = document.createElement("div");
        flex.classList.add("row");
        flex.classList.add("d-inline-flex");
        flex.classList.add("w-100");
        flex.classList.add("p-2");
        flex.classList.add("m-0");

        let description = document.createElement("div");
        description.classList.add("col");
        description.classList.add("p-0");
        description.classList.add("m-0");
        description.style.minWidth = "90%";
        description.innerHTML = `
            <b>${layer.label}</b><br>
            <i>Class: ${layer.subclassOf[0]}, id: ${layer.id}</i>
        `;

        let control = document.createElement("div");
        control.classList.add("col");
        control.classList.add("p-0");
        control.classList.add("m-0");
        control.style.minWidth = "20px";

        let times = document.createElement("div");
        times.classList.add("fa");
        times.classList.add("fa-times");
        times.araHidden = true;

        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-danger");
        button.classList.add("btn-sm");
        button.classList.add("w-100");
        button.classList.add("h-100");
        button.classList.add("p-0");
        button.classList.add("m-0");
        button.onclick = () => {
            this.unpin();
            this.removeLayer(layer.id);
        }

        button.appendChild(times);
        control.appendChild(button);

        flex.appendChild(description);
        flex.appendChild(control);
        item.appendChild(flex);
        
        return item;
        
    }

    newLayer (layer) {

        let item = document.createElement("li");
        item.classList.add("list-group-item");
        item.classList.add("p-0");
        item.classList.add("m-0");
        item.style.color = layer.color;

        let flex = document.createElement("div");
        flex.classList.add("row");
        flex.classList.add("d-inline-flex");
        flex.classList.add("w-100");
        flex.classList.add("p-2");
        flex.classList.add("m-0");

        let description = document.createElement("div");
        description.classList.add("col");
        description.classList.add("p-0");
        description.classList.add("m-0");
        description.style.minWidth = "90%";
        description.innerHTML = `
            <b>${layer.label}</b><br>
            <i>Class: ${layer.subclassOf[0]}</i>
        `;

        let control = document.createElement("div");
        control.classList.add("col");
        control.classList.add("p-0");
        control.classList.add("m-0");
        control.style.minWidth = "20px";

        let plus = document.createElement("div");
        plus.classList.add("fa");
        plus.classList.add("fa-plus");
        plus.araHidden = true;

        let button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-success");
        button.classList.add("btn-sm");
        button.classList.add("w-100");
        button.classList.add("h-100");
        button.classList.add("p-0");
        button.classList.add("m-0");
        button.onclick = () => {
            this.unpin();
            this.applyLayer(layer);
        }

        button.appendChild(plus);
        control.appendChild(button);

        flex.appendChild(description);
        flex.appendChild(control);
        item.appendChild(flex);
        
        return item;
    }

    divider () {

        let item = document.createElement("li");
        item.classList.add("list-group-item");
        item.classList.add("p-0");
        item.classList.add("m-0");

        let flex = document.createElement("div");
        flex.classList.add("row");
        flex.classList.add("d-inline-flex");
        flex.classList.add("w-100");
        flex.classList.add("p-2");
        flex.classList.add("m-0");

        let divider = document.createElement("div");
        divider.classList.add("divider");

        flex.appendChild(divider);
        item.appendChild(flex);

        return item;
    }

}
