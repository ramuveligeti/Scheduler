({
    addLineHelper : function(component,event){
        var filter = event.getParam("filWrap");
        var message = ['Field','Operator','Value'];
        var i = message.length;
        if (i>0) {   // (not 0)
            console.log('i1=='+i);
            while (i>-1) {
                console.log('i=='+i+'=='+message[i])
                //if(filter['dataType'] == 'DATE'){filter['selectedValue'] == filter['filterDate'];}
                if( (filter['selectedField'] != '' && message[i] == 'Field') || 
                    (filter['selectedOperator'] != '' && message[i] == 'Operator') || 
                    ((filter['filterDate'] != '' || filter['selectedValue'] != '') && message[i] == 'Value')
                ){
                    console.log('msg=='+message);
                    message.splice(i, 1);
                }
                --i;
            }
        }            
        console.log('message=='+message+'=='+filter['selectedField']+'=='+filter['selectedOperator']+'=='+filter['selectedValue']);
        if(message.length >0){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title: 'Requried fields missing: Row '+filter['lineNumber'],
                message: message.join(", ")
            });
            toastEvent.fire();
            /*$A.createComponents([
                ["ui:message",{
                    "title" : "Missing Required Fields",
                    "severity" : "error"
                }],
                ["ui:outputText",{
                    "value" : "Operator is required"
                }]
                ],
                function(components, status, errorMessage){
                    var message = components[0];
                    var outputText = components[1];
                    // set the body of the ui:message to be the ui:outputText
                    message.set("v.body", outputText);
                    var div1 = component.find("div1");
                    // Replace div body with the dynamic component
                    div1.set("v.body", message);
                }
            );*/
        }else{
            /*var index = filter['index'];
            var wrap = component.get("v.filterWrapper");
            wrap[index] = filter;
            component.set("v.filterWrapper", wrap);*/
            this.createWrapper(component,event);
        }
    },
    createWrapper: function(component,event) {
        var filter = event.getParam("filWrap");
		var wrap = component.get("v.filterWrapper");
        console.log(wrap);
        var cnt =0;
        if(!$A.util.isEmpty(wrap)) {
            wrap.forEach(function(entry) {
                entry['dispAdd'] = false;
                entry['index'] = cnt;
                cnt++;
            });
        }
        var singleObj = {};
        var opts = [];
        opts.push({"class": "optionClass", label: '--None--', value: ''});
        singleObj['selectedField']='';
        singleObj['selectedOperator']='';
        singleObj['actionIndex'] = filter['actionIndex'];
        singleObj['selectedObject'] = filter['selectedObject'];
        singleObj['selectedValue']='';
        singleObj['operators'] = opts;
        singleObj['picklistVals'] = [];
        singleObj['triggerAction'] = filter['triggerAction'];
        singleObj['dataType'] = '';
        singleObj['filterDate'] = component.get("v.filterDate");
        singleObj['index'] = cnt;
        singleObj['lineNumber'] = cnt+1;
        singleObj['dispAdd'] = true;
        singleObj['dispRem'] = true;
        console.log('single');
        console.log(singleObj);
        wrap.push(singleObj);
        component.set("v.filterWrapper", wrap);
        console.log(component.get('v.filterWrapper'));
    },
    createSubWrapper: function(component,event) {
        var filter = event.getParam("filWrap");
        var subWrap = [];
        if(filter['subFilter'] !== undefined){
            subWrap = filter['subFilter'];
        }
		var wrap = component.get("v.filterWrapper");
        var singleObj = {};
        var opts = [];
        var cnt =0;
        if(!$A.util.isEmpty(subWrap)) {
            subWrap.forEach(function(entry) {
                entry['dispAdd'] = false;
                entry['index'] = cnt;
                cnt++;
            });
        }
        opts.push({"class": "optionClass", label: '--None--', value: ''});
        singleObj['selectedField']='';
        singleObj['selectedOperator']='';
        singleObj['actionIndex'] = filter['actionIndex'];
        singleObj['selectedObject'] = filter['selectedObject'];
        singleObj['selectedValue']='';
        singleObj['operators'] = opts;
        singleObj['picklistVals'] = [];
        singleObj['triggerAction'] = filter['triggerAction'];
        singleObj['dataType'] = '';
        singleObj['filterDate'] = component.get("v.filterDate");
        singleObj['index'] = cnt;
        singleObj['lineNumber'] = cnt+1;
        singleObj['dispAdd'] = true;
        singleObj['dispRem'] = true;
        subWrap.push(singleObj);
        if(!$A.util.isEmpty(wrap)) {
            wrap.forEach(function(entry) {
                if(entry['dataType'] == 'REFERENCE' && entry['index'] == filter['index']){
                    entry['subFilter'] = subWrap;
                }
            });
        }
        console.log(wrap);
        component.set("v.filterWrapper", wrap);
    },
    fetchFields: function(component,event,helper){
        var action = component.get("c.getObjFields");
        action.setParams({"so":component.get("v.selectedObject")})
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var ret = response.getReturnValue();
                var options = [];
                for (var i = 0; i < ret.length; i++) {
                    var apiDataTypeWithObjName = ret[i][1];
                    var apiWithDataType = apiDataTypeWithObjName.split('~:~')[0];
                    var fieldLabel = ret[i][0];
                    options.push({ label: fieldLabel, value: apiWithDataType });
                }
                
                component.set("v.fields", options);
            }
            else if (component.isValid() && state === "INCOMPLETE") {
            
            }
            else if (component.isValid() && state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
            
        });
        $A.enqueueAction(action);
    }
})