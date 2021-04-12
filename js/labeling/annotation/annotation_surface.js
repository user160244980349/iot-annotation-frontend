import Layer from '../layers/layer';
import MetaLayer from '../layers/meta_layer';
import Selection from './selection';

export default class AnnotationSurface {

    constructor (metaLayers) {
        this.id = "annotation_surface";
        this.el = document.getElementById(this.id);
        this.layers = this.importMetaLayers(metaLayers);
        this.selection = null;
    }

    importMetaLayers(metaLayers) {
        let layers = {};
        for (let i = 0; i < metaLayers.length; i++) {
            layers[metaLayers[i].label] = new MetaLayer(metaLayers[i]);
        }
        return layers;
    }

    addLayer (type) {

        if (this.selection == null) {
            return;
        }

        let newLayer = new Layer(this.layers[type], this.selection);
        this.pushToContainer(newLayer);
        this.applyLayer(newLayer);
    }

    getLayer (id) {
        // abstract method
    }

    validateHierarchy (layers) {

        let labels = [];
        for (let i = 0; i < layers.length; i++) {
            labels.push(this.getLayer(layers[i]).label);
        }

        let leaf = labels[layers.length - 1];

        for (let i = labels.length - 2; i >= 0; i--) {
            if (leaf == labels[i]) {
                return false;
            }
        }

        if (this.layers[leaf].superlayer == null) {
            return true;
        }

        for (let i = labels.length - 2; i >= 0; i--) {
            if (this.layers[leaf].superlayer == labels[i]) {
                return true;
            }
        }

        return false;
    }

    updateShadows (e) {

        let layers = e.getAttribute("data-layers").split(",");

        let shadows = [];
        for (let i = 0; i < layers.length - 1; i++) {
            let x = 2 * (i + 1); 
            let y = 6 * (i + 1); 
            let c = layers.length - i - 2;
            let layer = this.getLayer(layers[c]);

            shadows.push(`${x}px ${y}px 0 0 ${layer.color}`);
        }

        if (layers.length > 1) {
            let h = 30 + 6 * (layers.length - 1);
            let t = -3 * (layers.length - 1);
            let m = 2 * (layers.length);
            e.style.boxShadow = `${shadows.join(',')}`
            e.style.lineHeight = `${h}px`; 
            e.style.marginLeft = `${m}px`;
            e.style.top = `${t}px`;
        }

    }

    mouseEnter (e) {
        // abstract method
    }

    pushToContainer (l) {
        // abstract method
    }

    removeFromContainer (l) {
        // abstract method
    }

    offerNewLayer () {
        // abstract method
    }

    splitContent (e, wrapper) {

        let elements = [];
        let children = e.childNodes;

        for (let i = 0; i < children.length; i++) {

            let layers = [];
            let wrapperClone = wrapper.cloneNode(true);
            let clone = children[i].cloneNode(true);

            wrapperClone.appendChild(clone);

            if (clone.nodeType == 3) { // TEXT_NODE
                if (this.selection.p != null && this.selection.p.id != this.id) {
                    layers.push(...this.selection.p.getAttribute("data-layers").split(","));
                }
            } else {
                layers.push(...clone.getAttribute("data-layers").split(","));
                while (clone.firstChild) {wrapperClone.insertBefore(clone.firstChild, clone);}
            }

            layers.push(...wrapperClone.getAttribute("data-layers").split(","));
            wrapperClone.setAttribute("data-layers", layers);
            elements.push(wrapperClone);

        }

        return elements;
    }

    applyLayer (l) {
        let elements = this.splitContent(this.selection.m, l.element);

        for (let i = 0; i < elements.length; i++) {
            if (!this.validateHierarchy(elements[i].getAttribute("data-layers").split(","))) {
                this.removeFromContainer(l.id);
                return;
            }
        }

        this.clearDocument();

        this.el.appendChild(this.selection.s);

        for (let i = 0; i < elements.length; i++) {
            this.updateShadows(elements[i]);
        }

        for (let i = 0; i < elements.length; i++) {
            this.el.appendChild(elements[i]);
        }

        this.el.appendChild(this.selection.e);
        
        for (let i = 0; i < this.selection.m.children.length; i++) {
            this.selection.m.children[i].remove();
        }

        this.removeEmpty();
        this.recoverEvents();
    }

    checkParent (e) {
        while (e != null) {
            if (e.id == this.id) {
                return true;
            } else {
                e = e.parentNode;
            }
        }
        return false;
    }
    
    removeEmpty() {
        let spans = this.el.getElementsByClassName('selection');
        for (let el of spans) {
            if (el.innerHTML == '&nbsp;' || el.innerHTML == '') {
                el.remove(el);
            }
        }
    }

    recoverEvents() {
        let spans = this.el.getElementsByClassName('s');
        for (let el of spans) {
            el.onmouseenter = (e) => {this.mouseEnter(e);};
        }
    }

    clearDocument () {
        while (this.el.firstChild) { 
            this.el.removeChild(this.el.firstChild); 
        }
    }

    readSelection () {

        if (typeof window.getSelection == "undefined") {
            this.selection = null;
            return;
        }

        let s = 0, e = 0, p = null;
        let start, middle, end;
        let selection = window.getSelection();

        middle = selection.getRangeAt(0).cloneRange();

        if (!this.checkParent(selection.anchorNode)) {
            this.selection = null;
            return;
        }

        start = middle.cloneRange();
        start.selectNodeContents(this.el);
        start.setEnd(middle.startContainer, middle.startOffset);

        s = start.toString().length;
        e = s + middle.toString().length;

        if (s == e) {
            this.selection = null;
            return;
        }

        if (middle.startContainer == middle.endContainer) {
            p = middle.startContainer.parentNode.cloneNode(true);
        }

        end = middle.cloneRange();
        end.selectNodeContents(this.el);
        end.setStart(middle.endContainer, middle.endOffset);

        this.selection = new Selection(
            start.cloneContents(), 
            middle.cloneContents(), 
            end.cloneContents(),
            p, s, e
        );

        this.offerNewLayer();

    }

}