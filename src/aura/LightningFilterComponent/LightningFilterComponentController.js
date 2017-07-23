({
	myAction : function(component, event, helper) {
		var modal = component.find("lookupModal");
        $A.util.addClass(modal,"toggle");
		var modal1 = component.find("closeButton");
        $A.util.addClass(modal1,"toggle");
        //var filter = component.get("v.fw");
        //filter.selectedField = component.get("v.selectedField");
        console.log('sf=='+component.get("v.selectedField"));
    },
    delay : function(component,event,helper){
        window.setInterval(this.dispOperator(component,event,helper),1000);
    },
    dispOperator : function(component, event, helper) {
        var filter = component.get("v.fw");
        var sf = filter['selectedField'];
        console.log('sfdis=='+sf);
        console.log(filter);
        var dataType = sf.split('==')[1];
        filter['dataType'] = dataType;
        var opts = [];
        console.log('ta-='+filter['triggerAction']);
        if(filter['triggerAction'] == 'ops' || filter['triggerAction'] == 'actionops'){
            opts.push({label: '--None--', value: ''});
            opts.push({label: 'Equals', value: '='});
            opts.push({label: 'Not Equal to', value: '!='});
            if(dataType == 'DATETIME' || dataType == 'DATE' || dataType == 'DECIMAL' || dataType == 'INTEGER'){
                opts.push({label: 'greater than', value: '>'});
                opts.push({label: 'less than', value: '<'});
                opts.push({label: 'greater or equal', value: '>='});
                opts.push({label: 'less or equal', value: '<='});
                opts.push({label: 'is null', value: '= null'});
                opts.push({label: 'is not null', value: '!= null'});
            } else if(dataType == 'STRING'){
                opts.push({label: 'contains', value: 'like'});
                opts.push({label: 'does not contain', value: 'not like'});
                opts.push({label: 'starts with', value: 'starts'});
                opts.push({label: 'is null', value: '= null'});
                opts.push({label: 'is not null', value: '!= null'});
            }
        }else{
            opts.push({label: 'Equals', value: '='});
        }
        
        if(dataType == 'PICKLIST'){
            filter['operators'] = opts;
            component.set("v.fw",filter);
            var event = component.getEvent("getPicklistValues");
            event.setParams({
                'filWrap':component.get("v.fw")
            });
            event.fire();         
        }
        filter['operators'] = opts;
        
        component.set("v.fw",filter);
    },
    assignLookup : function(component,event,helper) {
        var act = event.getParam("selectedValue");
        var act1 = event.getParam("selectedValueId");
        var filW = component.get("v.fw");
        filW.selectedValue = act;
        filW.selectedValueId = act1;
        component.set("v.fw",filW);
		var modal = component.find("lookupModal");
        $A.util.addClass(modal,"toggle");
    },
    addWrapper : function(component, event, helper) {
        var filW = component.get("v.fw");
        var event = component.getEvent("addFilterEvent");
        event.setParams({
            'filWrap':filW
        });
        event.fire();        
    },
    removeLine : function(component, event, helper) {
        var event = component.getEvent("removeFilterEvent");
        event.setParams({
            'filWrap':component.get("v.fw")
        });
        event.fire();        
    },
    addSubFields : function(component,event,helper) {
        var event = component.getEvent("addSubFilterEvent");
        event.setParams({
            'filWrap':component.get("v.fw")
        });
        event.fire();        
    },
    dispModal : function(component,event,helper) {
        var modal = component.find("lookupModal");
        $A.util.removeClass(modal,"toggle");
        component.set("v.search","");
        component.set("v.lookupDialogHeader","");
        component.set("v.lookupDialogValues","");
        var timer = component.get('v.timer');
        clearTimeout(timer);
    },    
    searchFunc : function(component,event,helper) {
        var timer = component.get('v.timer');
        clearTimeout(timer);
        var search = component.get("v.search");
        if(search == undefined || search == '') return;
        console.log(component.get("v.search"));
        var filW = component.get("v.fw");
        var action = component.get("c.lookupObject");
        action.setParams({"so":filW.selectedObject,
                          "fldName": filW.selectedField,
                          "searchtxt":component.get("v.search")
                         });
        action.setCallback(this, function(data) {
            var state = data.getState();
            if (component.isValid() && state === "SUCCESS") {
                var ret = data.getReturnValue();
                //component.set("v.lookupDialogHeader","");
                //component.set("v.lookupDialogValues","");
                console.log(ret);
                var header = [];
                var bodyVals = [];
                for (var i = 0; i < ret[0].length; i++) {
                    header.push(ret[0][i]);
                }
                component.set("v.lookupDialogHeader",header);
                for (var i = 1; i < ret.length; i++) {
                    console.log('i=='+i);
                    var body = [];
                    for(var j=0; j <ret[i].length; j++){
                        console.log(ret[i][j]);
                        body.push(ret[i][j]);
                    }
                    console.log('j');
                    bodyVals[i] = body;
                    console.log('k');
                }
                console.log('l');
                component.set("v.lookupDialogValues",bodyVals);
                console.log('m');
            }else if (component.isValid() && state === "ERROR") {
                var errors = data.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }

        });
        
        var timer = window.setTimeout($A.getCallback(function() {
            $A.enqueueAction(action);
        }), 500);
        component.set('v.timer', timer);
        console.log('tim=='+timer);
    }
})