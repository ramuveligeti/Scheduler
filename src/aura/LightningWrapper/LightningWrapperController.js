({
	myAction : function(component, event, helper) {
        if(!$A.util.isEmpty(component.get("v.selectedObject"))){
            helper.fetchFields(component,event);
        }
    },
    removeLine : function(component, event, helper) {
        var filter = event.getParam("filWrap");
        var index = filter['index'];
        var wrap = component.get("v.filterWrapper");
        wrap.splice(index,1);
        var cnt =0;
        console.log('wrap.length=='+wrap.length);
        if(!$A.util.isEmpty(wrap)) {
            console.log('is not')
            wrap.forEach(function(entry) {
                if(cnt == (wrap.length-1)){entry['dispAdd'] = true;}
                else {entry['dispAdd'] = false;}
                entry['index'] = cnt;
                entry['lineNumber'] = cnt+1;
                cnt++;
            });
        }
        component.set("v.filterWrapper", wrap);
    },
    addLine : function(component, event, helper) {
        helper.addLineHelper(component,event);
    },
    createSubWrapper : function(component,event,helper) {
        helper.createSubWrapper(component,event);
    },
    allowDrop: function(cmp, event, helper){
        event.preventDefault();
    },
    drag: function(cmp, ev, helper){
        var parentId = document.getElementById(ev.target.id).parentElement.id;
        cmp.set("v.startId",ev.target.id);
        cmp.set("v.parentId",parentId);
    },
    drop: function(cmp, ev, helper){
        var drag = cmp.get("v.startId");
        var div = ev.target.id;
        var fragment = document.createDocumentFragment();
        fragment.appendChild(document.getElementById(drag));
        document.getElementById(div).appendChild(fragment);
        var c = document.getElementById(div).children;
        var x = document.getElementById('drag1').parentElement.id;
        var fragment = document.createDocumentFragment();
        fragment.appendChild(document.getElementById(c[0].id));
        document.getElementById(cmp.get("v.parentId")).appendChild(fragment);
    },
    showLogic : function(component,event,helper){
        component.set("v.customLogic",true);
    },
    allConditions : function(component,event,helper){
        component.set("v.customLogic",false);
    }    
})