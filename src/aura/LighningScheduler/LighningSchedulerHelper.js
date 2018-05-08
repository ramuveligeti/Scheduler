({
    hidePanelOnLoad: function(component,event){
        var panel = component.find("filterBlock");
        $A.util.addClass(panel,"toggle");
        var action = component.find("actionsBlock");
        $A.util.addClass(action,"toggle");
    },
    showPanel: function(component,event){
        var panel = component.find("filterBlock");
        $A.util.removeClass(panel,"toggle");
        var action = component.find("actionsBlock");
        $A.util.removeClass(action,"toggle");
    },
    fetchFields: function(component,event){
        var action = component.get("c.getObjFields");
        var actionId = event.getParam("filWrap");
        var act = false;
        //checking if this function called from getRelatedFields function for 'Update Releated Records' option
        if(!$A.util.isEmpty(actionId)){act=true;}
        console.log('act123=='+act);
        if(act){action.setParams({"so":component.get("v.selectedActObj")});}
        else {action.setParams({"so":component.get("v.selectedObj")});}
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var wrap = [];
                if(act){
                    if($A.util.isEmpty(component.get("v.recordId"))){
                        actionId['filterWrapper'] = wrap;
                    }
                    var index = actionId['index'];
                    var actionWrap = component.get("v.actionWrapper");
                    actionWrap[index] = actionId;
                }else {
                    if($A.util.isEmpty(component.get("v.recordId"))){
                        component.set("v.filterWrapper",wrap);
                    }
                }
                var ret = response.getReturnValue();
                var options = [];
                var refOptions = [];
                refOptions.push({ label: '--None--', value: '' });
                for (var i = 0; i < ret.length; i++) {
                    var apiDataTypeWithObjName = ret[i][1];
                    var apiWithDataType = apiDataTypeWithObjName.split('~:~')[0];
                    var fieldLabel = ret[i][0];
                    options.push({ label: fieldLabel, value: apiWithDataType });

                    if(apiWithDataType.split('==')[1] == 'REFERENCE'){
                        var apiWithObjName = apiWithDataType.split('==')[0]+'=='+apiDataTypeWithObjName.split('~:~')[1];
                        refOptions.push({ label: fieldLabel, value: apiWithObjName });
                    }
                }
                
                //if 'update_rel'
                if(act){component.set("v.relFields", options);}
                else{
                    component.set("v.fields", options);
                    component.set("v.refFields", refOptions);
                }
                if($A.util.isEmpty(component.get("v.recordId"))){
                    this.createWrapper(component, event);
                }
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
    },
    objectMethod : function(component,event) {
        var action = component.get("c.getSobjectNames");
        action.setCallback(this, function(data) {
            component.set("v.objects", data.getReturnValue());
        });
        $A.enqueueAction(action);
	},
    createWrapper: function(component,event) {
        var actionId = event.getParam("filWrap");
        var act = false;
        var actCnt = 0;
        if(!$A.util.isEmpty(actionId)){
            actCnt = actionId['index'];
            if(actionId['updateRec']){this.createWrapperRec(component,event);}
            act=true;
        }
		var wrap= [];
        //var act = component.get("v.actionTrigger");
        if(act){wrap = actionId['filterWrapper'];}
        else {wrap = component.get("v.filterWrapper");}
        var cnt =0;
        if(!$A.util.isEmpty(wrap)) {
            wrap.forEach(function(entry) {
                entry['dispAdd'] = false;
                entry['index'] = cnt;
                cnt++;
            });
        }
        console.log('wrap1==');
        console.log(wrap);
        var singleObj = {};
        var opts = [];
        opts.push({ label: '--None--', value: ''});
        if(act){
            singleObj['selectedObject']= component.get("v.selectedActObj");
            singleObj['triggerAction'] = 'action';
            singleObj['actionIndex'] = actCnt;
        }else{
            singleObj['selectedObject']= component.get("v.selectedObj");
            singleObj['triggerAction'] = 'ops';
            singleObj['actionIndex'] = -1;
        }
        singleObj['selectedField']='';
        singleObj['selectedOperator']='';
        singleObj['selectedValue']='';
        singleObj['selectedValueId']='';
        singleObj['operators'] = opts;
        singleObj['picklistVals'] = [];
        singleObj['dataType'] = '';
        singleObj['filterDate'] = component.get("v.filterDate");
        singleObj['index'] = cnt;
        singleObj['lineNumber'] = cnt+1;
        singleObj['dispAdd'] = true;
        singleObj['dispRem'] = true;
        console.log('singleObj==');
        console.log(wrap);
        wrap.push(singleObj);
        console.log('wrap==');
        console.log(wrap);

        if(act){
            actionId['filterWrapper'] = wrap;
            var index = actionId['index'];
            console.log('index99'+index)
            var actionWrap = component.get("v.actionWrapper");
            actionWrap[index] = actionId;
            component.set("v.actionWrapper", actionWrap);
            console.log('ggg');
            console.log(component.get("v.actionWrapper"));
        }else{component.set("v.filterWrapper", wrap);}
    },
    createWrapperRec : function(component,event){
        var actionId = event.getParam("filWrap");
		var wrap= [];
        wrap = actionId['relFilterWrapper'];
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
        opts.push({ label: '--None--', value: ''});
        singleObj['selectedObject']= component.get("v.selectedActObj");
        singleObj['triggerAction'] = 'actionops';
        singleObj['actionIndex'] = actionId['index'];
        singleObj['selectedField']='';
        singleObj['selectedOperator']='';
        singleObj['selectedValue']='';
        singleObj['selectedValueId']='';
        singleObj['operators'] = opts;
        singleObj['picklistVals'] = [];
        singleObj['dataType'] = '';
        singleObj['filterDate'] = component.get("v.filterDate");
        singleObj['index'] = cnt;
        singleObj['lineNumber'] = cnt+1;
        singleObj['dispAdd'] = true;
        singleObj['dispRem'] = true;
        console.log('singleObj==');
        console.log(wrap);
        wrap.push(singleObj);
        actionId['relFilterWrapper'] = wrap;
        var index = actionId['index'];
        console.log('index99'+index)
        var actionWrap = component.get("v.actionWrapper");
        actionWrap[index] = actionId;
        component.set("v.actionWrapper", actionWrap);
    },
    fetchPicklistValues: function(component,event) {
        var action = component.get("c.getPicklistValues");
        var filter = event.getParam("filWrap");
        var so = filter['selectedObject'];
        var act = filter['triggerAction'];
        var fld = filter['selectedField'].split('==')[0];
        console.log('so=='+so+'=='+fld+'=='+filter['selectedRefPar']);
        action.setParams({
            "so":so,
            "fld":fld
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                var ret = response.getReturnValue();
                var options = [];
                for (var i = 0; i < ret.length; i++) {
                    options.push({ label: ret[i][0], value: ret[i][1] });
                }
                filter['picklistVals'] = options;
                var index = filter['index'];
                var wrap = []
                
                if(act == 'ops'){
                    wrap = component.get("v.filterWrapper");
                    wrap[index] = filter;
                    component.set("v.filterWrapper", wrap);
                }else if(act == 'actionops' || act == 'action'){
                    //action wrapper
                    var actionId = component.get("v.actionWrapper");
                    console.log(actionId);
                    var aIndex = filter['actionIndex'];
                    
                    console.log('aIndex=='+aIndex);
                    var aFilter = actionId[aIndex]; 
                    var fWrap = [];
                    if(act == 'actionops'){
                        fWrap = aFilter['relFilterWrapper'];  
                        fWrap[index] = filter;
                        aFilter['relFilterWrapper'] = fWrap;
                    }else{
                        fWrap = aFilter['filterWrapper'];  
                        fWrap[index] = filter;
                        aFilter['filterWrapper'] = fWrap;
                    } 
                    
                    actionId[aIndex] = aFilter;
                    component.set("v.actionWrapper", actionId);
                }
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
    },
    getActions : function(component,event){
        var opts = [];
        opts.push({ label: '--None--', value: ''});
        opts.push({ label: 'Create related record', value: 'create_rel'});
        opts.push({ label: 'Update related records', value: 'update_rel'});
        opts.push({ label: 'Update records', value: 'update'});
        opts.push({ label: 'Update Parent records', value: 'update_par'});
        opts.push({ label: 'Export to CSV', value: 'csv'});
        component.set("v.actions",opts);
    },
    createAction : function(component,event) {
        var actionWrap = component.get("v.actionWrapper");
        var singleObj = {};
        var cnt =0;
        if(!$A.util.isEmpty(actionWrap)) {
            actionWrap.forEach(function(entry) {
                //entry['dispAdd'] = false;
                entry['index'] = cnt;
                cnt++;
            });
        }
        //var wrap = [];
        var opts = [];
        opts.push({ label: '--None--', value: ''});
        opts.push({ label: 'Daily', value: '1'});
        opts.push({ label: 'Weekly', value: '7'});
        opts.push({ label: 'Fortnightly', value: '15'});
        opts.push({ label: 'Monthly', value: '30'});
        singleObj['action'] = component.get("v.actions");
        singleObj['lineNumber'] = cnt+1;
        singleObj['index'] = cnt;
        singleObj['selectedAction'] = '';
        singleObj['filterDate'] = component.get("v.filterDate");
        singleObj['selectedObject'] = '';
        singleObj['dispRelList'] = false;
        singleObj['dispRelWrap'] = false;
        singleObj['fields'] = '';
        singleObj['relFilterWrapper'] = [];
        singleObj['filterWrapper'] = [];
        singleObj['selectedRefPar'] = '';
        singleObj['frequency'] = opts;
        singleObj['occurrence'] = '';
        singleObj['selectedFrequency'] = '';
        singleObj['updateRec'] = false;
        singleObj['noCriteria'] = false;
        actionWrap.push(singleObj);
        component.set("v.actionWrapper",actionWrap);
    },
    getRelatedObjs : function(component,event) {
        var act = event.getParam("filWrap");
        act['dispRelList'] = true;
        component.set("v.selectedActObj",act['selectedObject']);
        if(act['selectedAction'] == 'update_rel' || act['selectedAction'] == 'create_rel'){
            var wrap = component.get("v.actionWrapper");
            var index = act['index'];
            wrap[index] = act;
            component.set("v.actionWrapper",wrap);
            var action = component.get("c.getChildRelations");
            action.setParams({"so":component.get("v.selectedObj")});
            action.setCallback(this, function(data) {
                component.set("v.childObjects", data.getReturnValue());
            });
            $A.enqueueAction(action);
        }
        if(act['selectedAction'] == 'update'){
            act['dispRelWrap'] = true;
            act['dispRelList'] = false;
            component.set("v.selectedActObj",component.get("v.selectedObj"));
            var wrap = component.get("v.actionWrapper");
            var index = act['index'];
            wrap[index] = act;
            component.set("v.actionWrapper",wrap);
            component.set("v.actionTrigger",true);
            this.createWrapper(component, event);
        }
    },
    getRelatedFields : function(component,event) {
        var act = event.getParam("filWrap");
        act['dispRelWrap'] = true;
        console.log('bbb=='+act['selectedRefPar']);
        if(act['selectedAction'] == 'update_rel' || act['selectedAction'] == 'create_rel'){
            var wrap = component.get("v.actionWrapper");
            var index = act['index'];
            //act['filterWrapper'] = [];
            wrap[index] = act;
            console.log('act=='+index);
            console.log(act);
            console.log('zzwrapzz');
            console.log(wrap);
            component.set("v.actionWrapper",wrap);
            component.set("v.actionTrigger",true);
            component.set("v.selectedActObj",act['selectedObject']);
            this.fetchFields(component,event);
        }
        if(act['selectedAction'] == 'update_par'){
            act['filterWrapper'] = [];
            var wrap = component.get("v.actionWrapper");
            var index = act['index'];
            wrap[index] = act;
            component.set("v.actionWrapper",wrap);
            var action = component.get("c.getRefObjFields");
            var obj = act['selectedRefPar'];
            action.setParams({"so":component.get("v.selectedObj"),
                              "fldName":obj.split('==')[0]
                             });
            action.setCallback(this, function(data) {
                var ret = data.getReturnValue();
                var options = [];
                for (var i = 0; i < ret.length; i++) {
                    options.push({ label: ret[i][0], value: ret[i][1] });
                }
                component.set("v.refObjFields", options);
                component.set("v.selectedActObj",obj.split('==')[1]);
                this.createWrapper(component,event);
            });
            $A.enqueueAction(action);
        }
    },
    removeActionItem : function(component,event){
        component.destroy();
        /*var act = event.getParam("filWrap");
        debugger;
        var index = act['index'];
        var wrap = component.get("v.actionWrapper");
        wrap.splice(index,1); //[0,1,2]
        var cnt =0;
        if(!$A.util.isEmpty(wrap)) {
            console.log('is not')
            wrap.forEach(function(entry) {
                entry['index'] = cnt;
                entry['lineNumber'] = cnt+1;
                cnt++;
                console.log('cnt=='+entry['index']);
            });
        }
        component.set("v.actionWrapper", wrap);
        var tabset = component.find("tabset");
        
        console.log(tabset.isValid());
        console.log(tabset.get("v.body"));*/
    },
    saveActions : function(component,event) {
        var wrap = component.get("v.actionWrapper");
        var filter = component.get("v.filterWrapper");
        var sObj = component.get("v.selectedObj");
        var schWrapper = {};
        //schWrapper['sObj'] = sObj;
        schWrapper['filterWrapper'] = filter;
        schWrapper['actionwrap'] = wrap;
        console.log(wrap);
        var action = component.get("c.saveScheduler");
        action.setParams({"schJson":JSON.stringify(schWrapper)});
        action.setCallback(this, function(data) {});
        $A.enqueueAction(action);
    },
    loadOnEdit : function(component,event) {
        var action = component.get("c.getScheduler");
        var schWrapper = {};
        action.setParams({"recId":component.get("v.recordId")});
        action.setCallback(this, function(response) {
            schWrapper = JSON.parse(response.getReturnValue());
            console.log(schWrapper);
            component.set("v.selectedObj",schWrapper.Object__c);
            component.set("v.filterWrapper",JSON.parse(schWrapper.Filter_Wrapper_JSON__c));
            console.log('#$%#');
            console.log(JSON.parse(schWrapper.Filter_Wrapper_JSON__c))
            var actionWrapper = [];
            schWrapper.Scheduler_Actions__r.records.forEach(function(entry) {
                actionWrapper.push(JSON.parse(entry.Action_Wrapper_JSON__c));
            });
            component.set("v.actionWrapper",actionWrapper);
            console.log('actionWrapper');
            console.log(actionWrapper);
            this.objectMethod(component,event);
            this.fetchFields(component,event);
            this.getChildRelations(component,event);
            //this.fetchFields(component,event);
        });
        $A.enqueueAction(action);       
    },
    getChildRelations : function(component,event){
        var action = component.get("c.getChildRelations");
        action.setParams({"so":component.get("v.selectedObj")});
        action.setCallback(this, function(data) {
            component.set("v.childObjects", data.getReturnValue());
        });
        $A.enqueueAction(action);
    }
})