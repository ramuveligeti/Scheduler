({
	myAction : function(component, event, helper) {
        if(!$A.util.isEmpty(component.get("v.recordId"))){
            helper.loadOnEdit(component,event);
        }else{
            helper.objectMethod(component,event);
            helper.hidePanelOnLoad(component,event);
        }
	},
	dispFilter : function(component, event, helper) {
        var selectedObj = component.get("v.selectedObj");
        if(selectedObj != ''){
            helper.showPanel(component,event);
            helper.fetchFields(component, event);
            helper.getActions(component, event);
        }else{
            helper.hidePanelOnLoad(component,event);
        }
    },
    getValues : function(component, event, helper) {
        helper.fetchPicklistValues(component,event);
    },
    addAction : function(component,event,helper) {
        helper.createAction(component,event);
    },
    getRelatedObjs : function(component,event,helper) {
        helper.getRelatedObjs(component,event);
    },
    getRelatedFields : function(component,event,helper) {
        helper.getRelatedFields(component,event);
    },
    removeActionItem : function(component,event,helper) {
        helper.removeActionItem(component,event);
    },
    fetchLookupFields : function(component,event,helper) {
        helper.fetchLookupFields(component,event);
    },
    saveActions : function(component,event,helper) {
        helper.saveActions(component,event);
    }
})