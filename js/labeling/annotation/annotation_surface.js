import Layer from '../layers/layer';
import MetaLayer from '../layers/meta_layer';
import Selection from './selection';
import tools from '../../tools';
import State from './state';

export default class AnnotationSurface {

    constructor (metaLayers, visualLayers) {
        this.id = "annotation_surface";
        this.el = document.getElementById(this.id);
        this.layers = this.importMetaLayers(metaLayers, visualLayers);
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

                this.contextElement = null;
                if (e.target.id != this.id 
                    && this.isAnnotationElement(e.target)) {
                    this.contextElement = e.target;
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

            this.contextElement = null;
            if (e.target.id != this.id) {
                this.contextElement = e.target;
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

    getLayer (id) {
        throw "Not implemented!";
    }

    mouseEnter (ls, state) {
        throw "Not implemented!";
    }

    mouseClick (ls, state) {
        throw "Not implemented!";
    }

    suggestNewLayer (ls, state) {
        throw "Not implemented!";
    }

    pushToContainer (l) {
        throw "Not implemented!";
    }

    removeFromContainer (l) {
        throw "Not implemented!";
    }

    importMetaLayers(metaLayers, visualLayers) {
        let layers = {};
        for (let ml of metaLayers) {
            layers[ml.class] = new MetaLayer(ml, visualLayers[ml.class]);
        }
        return layers;
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

    // Remove layer stuff

    getHierarchy (els, l) {
        let layers = [];
        for (let el of els) {
            layers.push(...this.toRemove(el, l));
        }
        return [...new Set(layers)];
    }

    toRemove (el, l) {

        let toRemove = [];

        if (el.nodeType == 3) {
            return toRemove;
        }

        let layers = el.getAttribute("data-layers").split(",");

        let level = [l.toString()];
        while (level.length != 0) {

            let nextLevel = [];
            while (level.length != 0) {

                let id = level.shift();
                let seq = layers.slice(layers.indexOf(id));
                let pre = layers.slice(0, layers.indexOf(id));
                let item = this.getLayer(id).metaLayer;

                let parent = 0;
                for (let tid of pre) {
                    let t = this.getLayer(tid).metaLayer;
                    if (item.attributeOf.includes(t.class)) {
                        parent++;
                    }
                }

                if (parent < 2 || id == l) toRemove.push(id);

                for (let tid of seq) {
                    let t = this.getLayer(tid).metaLayer;
                    if (t.attributeOf.includes(item.class)) {
                        nextLevel.push(tid);
                    }
                }
            }

            level = nextLevel;
        }

        return toRemove;
    }

    removeLayer (l) {
        let parts = this.findLayerParts(l);
        let layers = this.getHierarchy([...parts.pre, this.contextElement, ...parts.suf] , l);
        parts = this.updateLayerCells(parts, layers);
        this.mergeSame(parts);
        this.removeFromContainer(l);
        this.state = State.HOVERING;
        this.mouseEnter(this.contextLayers, this.state);
    }

    updateLayerCells (parts, ls) {

        let pre = parts.pre;
        let suf = parts.suf;

        this.contextElement = this.removeLayerFromCell(this.contextElement, ls);

        // REPLACEMENT
        let pre2 = [];
        let suf2 = [];

        while (pre.length > 0) {
            let p = pre.pop();
            let e = this.removeLayerFromCell(p, ls);
            if (e == null) {
                pre2.unshift(p);
            } else {
                pre2.unshift(e);
            }
        }
        pre2.push(this.contextElement);

        while (suf.length > 0) {
            let s = suf.shift();
            let e = this.removeLayerFromCell(s, ls);
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

    removeLayerFromCell (el, ls) {

        if (el.nodeType == 3) {
            return null;
        }

        let layers = el.getAttribute("data-layers").split(",");

        for (let l of ls) {
            tools.remove(layers, l.toString());
        }

        let last;
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
        this.mouseEnter(this.contextLayers);
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

        let layers = Object.values(this.layers);
        for (let l of Object.values(this.layers)) {

            for (let c of this.selection.m.childNodes) {

                let applied = [];
                if (c.nodeType == 3) { // TEXT_NODE
                    if (this.selection.p != null && this.selection.p.id != this.id) {
                        applied.push(...this.selection.p.getAttribute("data-layers").split(","));
                    }
                } else {
                    applied.push(...c.getAttribute("data-layers").split(","));
                }

                if (!this.validateHierarchy(applied, l)) {
                    tools.remove(layers, l)
                    break;
                }
            }
        }

        return layers;
    }

    validateHierarchy (appliedLayers, newlayer) {

        let ls = [];
        for (let l of appliedLayers) ls.push(this.getLayer(l));

        // Check if same class
        for (let l of ls.reverse()) {
            if (newlayer.class == l.class) {
                return false;
            }
        }

        // Check if root layer
        if (newlayer.attributeOf.length === 0) {
            return true;
        }

        // Check if attribute of
        for (let l of ls.reverse()) {
            if (newlayer.attributeOf.includes(l.class)) {
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

        let selection = window.getSelection();

        if (selection.rangeCount < 1) {
            this.selection = null;
            return;
        }

        let s = 0, e = 0, p = null;
        let start, middle, end;

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

        let start_el = start.cloneContents();
        let middle_el = middle.cloneContents();
        let end_el = end.cloneContents();
        
        while (start_el.lastChild.nodeType == 1 
                && start_el.lastChild.innerText === "") {
            start_el.lastChild.remove();
        }
        while ((middle_el.firstChild.nodeType == 1 
                && middle_el.firstChild.innerText === "") 
                || (middle_el.firstChild.nodeType == 3 
                && middle_el.firstChild.length == 0)) {
            middle_el.firstChild.remove();
        }
        while ((middle_el.lastChild.nodeType == 1 
                && middle_el.lastChild.innerText === "") 
                || (middle_el.lastChild.nodeType == 3 
                && middle_el.lastChild.length == 0)) {
            middle_el.lastChild.remove();
        }
        while (end_el.firstChild.nodeType == 1 
                && end_el.firstChild.innerText === "") {
            end_el.firstChild.remove();
        }

        this.selection = new Selection(
            start_el, middle_el, end_el,
            p, s, e
        );

    }

}