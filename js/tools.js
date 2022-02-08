

function unwrapTextNode (el) {
    let fst = el.firstChild;
    el.parentNode.insertBefore(fst, el);
    el.remove();
    fst.parentNode.normalize();
    return fst;
}


function removeArrayItem (array, value) {
    let index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}


function replaceNode (oldEl, newEl) {
    oldEl.parentNode.insertBefore(newEl, oldEl);
    newEl.appendChild(oldEl);
    unwrapTextNode(oldEl);
}


function mergeNodes (el1, el2) {
    el1.appendChild(el2);
    unwrapTextNode(el2);
    return el1;
}


function equalArrays (a, b) {  
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}


function hasSame (array1, array2) {
    return array1.some((element) => {return array2.includes(element)});
}


function throttle (callback, limit) {
    var waiting = false;                      // Initially, we're not waiting
    return function () {                      // We return a throttled function
        if (!waiting) {                       // If we're not waiting
            callback.apply(this, arguments);  // Execute users function
            waiting = true;                   // Prevent future invocations
            setTimeout(function () {          // After a period of time
                waiting = false;              // And allow future invocations
            }, limit);
        }
    }
}


const tools = {
    unwrap: unwrapTextNode,
    remove: removeArrayItem,
    replace: replaceNode,
    merge: mergeNodes,
    equals: equalArrays,
    throttle: throttle,
    hasSame: hasSame,
 };

 export default tools; 