

export default class LayersContainer {

    constructor () {
        this.layers_pool = {};
        this.btn = document.getElementById("commit");
        this.json = document.getElementById("json_data");
        this.form = document.getElementById("json_form");

        this.btn.addEventListener("click", (e) => {
            this.send();
        });
    }

    push(newLayer) {
        this.layers_pool[newLayer.id] = newLayer;
    }

    remove(id) {
        delete this.layers_pool[id];
    }

    getLayer(id) {
        return this.layers_pool[id];
    }

    send () {
        this.json.value = JSON.stringify(this.layers_pool);
        this.form.submit();
    }
}