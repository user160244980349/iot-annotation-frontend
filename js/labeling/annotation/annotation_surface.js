import Layer from '../layers/layer';
import MetaLayer from '../layers/meta_layer';
import Selection from './selection';
import tools from '../../tools';
import State from './state';

export default class AnnotationSurface {

    constructor (metaLayers) {
        this.id = "annotation_surface";
        this.el = document.getElementById(this.id);
        this.layers = this.importMetaLayers(metaLayers);

        this.state = State.HOVERING;
        this.selection = null;
        this.contextElement = null;

        document.addEventListener("click", tools.throttle((e) => {

            if (this.state == State.SELECTING) {
                this.state = State.UNSELECT;
                return;
            }

            if (this.state == State.UNSELECT) {
                this.state = State.HOVERING;

                if (e.target.id != this.id 
                    && this.isAnnotationElement(e.target)) {
                    this.contextElement = e.target;
                } else {
                    this.contextElement = null;
                }
                this.mouseEnter(this.contextLayers, this.state);
                return;
            }

            if (!this.isAnnotationElement(e.target)) {
                return;
            }

            if (this.state == State.HOVERING) {
                this.state = State.FOCUSING;
            } else if (this.state == State.FOCUSING) {
                this.state = State.HOVERING;
            }

            this.mouseClick(this.contextLayers, this.state);

        }, 10));

        document.addEventListener("mouseover", tools.throttle((e) => {

            if (this.state != State.HOVERING 
                || !this.isAnnotationElement(e.target)) {
                return;
            }

            if (e.target.id != this.id) {
                this.contextElement = e.target;
            } else {
                this.contextElement = null;
            }

            this.mouseEnter(this.contextLayers);

        }, 10));

        document.addEventListener('selectionchange', tools.throttle(() => {

            this.readSelection();

            if (this.selection != null) {
                this.state = State.SELECTING;
                this.suggestNewLayer(this.appliableLayers, this.state);
            } else {
                this.mouseEnter(this.contextLayers, this.state);
            }

        }, 10));
    }

    get contextLayers() {
        let layers = null;
        if (this.contextElement != null) {
            if (this.contextElement.nodeType != 3) {
                layers = this.contextElement.getAttribute("data-layers").split(",");
            }
        }
        return layers;
    }

    getLayer (id) {
        throw "Not implemented!";
    }

    mouseEnter (ls, state) {
        throw "Not implemented!";
    }

    mouseClick (ls, state) {
        throw "Not implemented!";
    }

    pushToContainer (l) {
        throw "Not implemented!";
    }

    removeFromContainer (l) {
        throw "Not implemented!";
    }

    suggestNewLayer (state) {
        throw "Not implemented!";
    }

    cancelSuggestion () {
        throw "Not implemented!";
    }

    importMetaLayers(metaLayers) {
        let layers = {};
        for (let ml of metaLayers) {
            layers[ml.label] = new MetaLayer(ml);
        }
        return layers;
    }

    // Remove layer stuff

    removeLayer (l) {
        this.removeFromContainer(l);
        let parts = this.findLayerParts(l);
        parts = this.updateLayerCells(parts, l);
        this.mergeSame(parts);
        this.state = State.HOVERING;
    }

    updateLayerCells (parts, l) {

        let pre = parts.pre;
        let suf = parts.suf;

        this.contextElement = this.removeLayerFromCell(this.contextElement, l);

        // REPLACEMENT
        let pre2 = [];
        let suf2 = [];

        while (pre.length > 0) {
            let p = pre.pop();
            let e = this.removeLayerFromCell(p, l);
            if (e == null) {
                pre2.unshift(p);
            } else {
                pre2.unshift(e);
            }
        }
        pre2.push(this.contextElement);

        while (suf.length > 0) {
            let s = suf.shift();
            let e = this.removeLayerFromCell(s, l);
            if (e == null) {
                suf2.push(s);
            } else {
                suf2.push(e);
            }
        }

        return {pre: pre2, suf: suf2};
    }

    mergeSame (parts) {

        let pre = parts.pre;
        let suf = parts.suf;

        // MERGING
        let ee = true;
        while (pre.length > 1) {
            let e1 = pre.pop();
            let e2 = pre.pop();

            if (this.sameStructure(e2, e1)) {
                let n = tools.merge(e2, e1);
                pre.push(n);
                if (ee) {
                    this.contextElement = n;
                }
            } else {
                ee = false;
                pre.push(e2);
            }
        }
        suf.unshift(this.contextElement);

        ee = true;
        while (suf.length > 1) {
            let e1 = suf.shift();
            let e2 = suf.shift();

            if (this.sameStructure(e1, e2)) {
                let n = tools.merge(e1, e2);
                suf.unshift(n);
                if (ee) {
                    this.contextElement = n;
                }
            } else {
                ee = false;
                suf.unshift(e2);
            }
        }
    }

    testCell (el, l) {

        let lStr = l.toString();

        if (el.nodeType == 3) {
            return false;
        }

        let layers = el.getAttribute("data-layers").split(",");

        if (!layers.includes(lStr)) {
            return false;
        }
        
        return true;
    }

    removeLayerFromCell (el, l) {

        let last;
        let lStr = l.toString();

        if (el.nodeType == 3) {
            return null;
        }

        let layers = el.getAttribute("data-layers").split(",");

        if (!layers.includes(lStr)) {
            return null;
        }

        tools.remove(layers, lStr);

        if (layers.length == 0) {
            last = tools.unwrap(el);
        } else {
            last = this.getLayer(layers[layers.length - 1]).element.cloneNode(true);
            last.setAttribute("data-layers", layers);
            tools.replace(el, last);
            this.updateShadows(last);
        }
        
        return last;
    }

    findLayerParts (l) {

        // INVESTIGATION
        let pre = [];
        let suf = [];

        let p = this.contextElement.previousSibling;
        while (this.testCell(p, l)) {
            pre.unshift(p);
            p = p.previousSibling;
        }
        pre.unshift(p);

        let n = this.contextElement.nextSibling;
        while (this.testCell(n, l)) {
            suf.push(n);
            n = n.nextSibling;
        }
        suf.push(n);

        return {suf, pre};
    }

    sameStructure (el1, el2) {
        if (el1.nodeType == 3 || el2.nodeType == 3) {return false;}
        let layers1 = el1.getAttribute("data-layers").split(",");
        let layers2 = el2.getAttribute("data-layers").split(",");
        return tools.equals(layers1, layers2);
    }

    // Apply layer stuff

    splitContent (el, wrapper) {

        let elements = [];

        for (let c of el.childNodes) {

            let layers = [];
            let wrapperClone = wrapper.cloneNode(true);
            let clone = c.cloneNode(true);

            wrapperClone.appendChild(clone);

            if (clone.nodeType == 3) { // TEXT_NODE
                if (this.selection.p != null && this.selection.p.id != this.id) {
                    layers.push(...this.selection.p.getAttribute("data-layers").split(","));
                }
            } else {
                layers.push(...clone.getAttribute("data-layers").split(","));
                tools.unwrap(clone);
            }

            layers.push(...wrapperClone.getAttribute("data-layers").split(","));
            wrapperClone.setAttribute("data-layers", layers);
            this.updateShadows(wrapperClone);
            elements.push(wrapperClone);

        }

        return elements;
    }

    applyLayer (metaLayer) {

        let l = new Layer(metaLayer, this.selection);

        this.clearDocument();
        this.pushToContainer(l);
        let elements = this.splitContent(this.selection.m, l.element);

        this.el.appendChild(this.selection.s);
        for (let e of elements) {
            this.el.appendChild(e);
        }
        this.el.appendChild(this.selection.e);
        this.state = State.HOVERING;
    }

    updateShadows (el) {

        let layers = el.getAttribute("data-layers").split(",");

        let shadows = [];
        for (let i = 0; i < layers.length - 1; i++) {
            let x = 2 * (i + 1); 
            let y = 6 * (i + 1); 
            let c = layers.length - i - 2;
            let layer = this.getLayer(layers[c]);
            shadows.push(`${x}px ${y}px 0 0 ${layer.color}`);
        }

        if (layers.length > 0) {
            let h = 30 + 6 * (layers.length - 1);
            let t = -3 * (layers.length - 1);
            let m = 2 * (layers.length);
            el.style.boxShadow = `${shadows.join(',')}`;
            el.style.lineHeight = `${h}px`; 
            el.style.marginLeft = `${m}px`;
            el.style.top = `${t}px`;
        }

    }

    clearDocument () {
        while (this.el.firstChild) { 
            this.el.removeChild(this.el.firstChild); 
        }
    }
    
    // Selection processing

    get appliableLayers () {
        return Object.values(this.layers);
    }

    validateHierarchy (appliedLayers, newlayer) {

        let labels = [];
        for (let i = 0; i < appliedLayers.length; i++) {
            labels.push(this.getLayer(layers[i]).label);
        }

        let leaf = this.getLayer(newlayer).label

        for (let i = labels.length - 1; i >= 0; i--) {
            if (leaf == labels[i]) {
                return false;
            }
        }

        if (this.layers[leaf].superlayer == null) {
            return true;
        }

        for (let i = labels.length - 1; i >= 0; i--) {
            if (this.layers[leaf].superlayer == labels[i]) {
                return true;
            }
        }

        return false;

    }

    isAnnotationElement (el) {
        while (el != null) {
            if (el.id == this.id) {
                return true;
            } else {
                el = el.parentNode;
            }
        }
        return false;
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

        if (!this.isAnnotationElement(middle.startContainer) 
            || !this.isAnnotationElement(middle.endContainer)) {
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

    }

}