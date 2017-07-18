({
	myAction : function(component, event, helper) {
		
	},
    selectedLine : function(component,event,helper) {
        console.log(component.get("v.bId"));
        var event = component.getEvent("getRecId");
        event.setParams({
            'selectedValue':component.get("v.bName"),
            'selectedValueId':component.get("v.bId")
        });
        event.fire();        
    }
})