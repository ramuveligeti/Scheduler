({
    myAction : function(component, event, helper) {

    },
    dispItems: function(component,event,helper) {
        var event = component.getEvent("getRelObjs");
        event.setParams({
            'filWrap':component.get("v.aw")
        });
        event.fire();
    },
    dispRelateObjFields: function(component,event,helper) {
        var act = component.get("v.aw");
        var event = component.getEvent("getRelFilWrap");
        event.setParams({
            'filWrap':component.get("v.aw")
        });
        event.fire();                
    },
    dispUpdateRec : function(component,event,helper) {
        var act = component.get("v.aw");
        act['updateRec'] = true;
        act['noCriteria'] = false;
        console.log('upr=='+act['updateRec']);
        component.set("v.aw",act);
        var event = component.getEvent("getRelFilWrap");
        event.setParams({
            'filWrap':component.get("v.aw")
        });
        event.fire();                
    },
    dispNoCriteria : function(component,event,helper) {
        var act = component.get("v.aw");
        act['noCriteria'] = true;
        act['updateRec'] = false;
        console.log('upr=='+act['updateRec']);
        component.set("v.aw",act);
        component.set("v.relFilterWrapper",[]);
        var event = component.getEvent("getRelFilWrap");
        event.setParams({
            'filWrap':component.get("v.aw")
        });
        event.fire();                
    },
    removeAction : function(component,event,helper) {
        var event = component.getEvent("removeActItem");
        event.setParams({
            'filWrap':component.get("v.aw")
        });
        event.fire();
    },
    dispCriteria : function(component,event,helper) {
        var act = component.get("v.aw");
        if(act.selectedObject != '') component.set("v.dispUpdRec",true);
        else component.set("v.dispUpdRec",false);
    }
})